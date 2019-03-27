/**
 * Copyright (c) 2018 David Seager
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const express = require('express');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const bodyParser = require('body-parser');
const async = require('async');
const _ = require('lodash');

const queryUmodfAction = require('./QueryUsermod.js');
const installUmodAction = require('./InstallFix.js');
const IplAction = require('./Ipl.js');
const DalAction = require('./Dal.js');
const DIPLinfoAction = require('./DIplinfo.js');
const app = express();


//Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());
//Create the service wrapper
var assistant = new AssistantV1({
  version: '2018-07-10'
});

// credentials for cloud action
const actionUsername = process.env.ACTION_USERNAME || null;
const actionPassword = process.env.ACTION_PASSWORD || null;

// switch to use client or cloud actions: Use Client Action
let useClientActions = process.env.USE_CLIENT_ACTIONS || false;
if (useClientActions === "true") {
  console.log('Using client actions');
  useClientActions = true;
} else {
  console.log('Using cloud actions');
  useClientActions = false;
}

app.post('/api/message', (req, res) => {
  let workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a WORKSPACE_ID environment variable. Please refer to the README documentation on how to set this variable.'
      }
    });
  }

  // credentials for cloud action
  /*
  let actionCredentials = null;
  if(actionUsername && actionPassword) {
    actionCredentials = {
      user : actionUsername,
      password : actionPassword
    };
  } else {
    console.log('Warning: variables ACTION_USERNAME and ACTION_PASSWORD are not set, Cloud actions will not work');
  }
  */

  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {},
    nodes_visited_details: true
  };
  // add credentials
  //if(actionCredentials) {
  //   payload.context.private = { actionCredentials : actionCredentials };
  //}
  // indicate to use client actions or cloud
  payload.context.useClientActions = useClientActions;

  callAssistant(payload, res, false);   // skipActions = false to process actions

});

// call assistant with the payload and send response back to res
// if skipActions is true then do not process any actions
function callAssistant(payload, res, skipActions, actionPayloads) {
  console.log('Calling Assistant with:');
  console.log(JSON.stringify(payload, null, 2));
  try {
    assistant.message(payload, (err, data) => {
      if (data) {
        console.log('Assistant replied with:');
        console.log(JSON.stringify(data, null, 2));
      }
      if (err) {
        console.log('Assistant returned an error:');
        console.log(JSON.stringify(err, null, 2));
        return res.status(Number.parseInt(err.code) ? err.code : 500).json(err);
      }

      if (data.context && data.context.skip_user_input && !skipActions && data.actions) {
        // action
        return processActions(data, (err, response) => {
          if (err) {
            return res.status(err.code || 500).json(err);
          }
          // return data to assistant, skip any further actions
          var newPayload = {
            workspace_id: payload.workspace_id,
            context: response.context,
            output: response.output,
            input: {},
            nodes_visited_details: true
          };
          return callAssistant(newPayload, res, true, { userActionResultPayload: newPayload, watsonInitial: data });
        });
      } else {
        // here you can remove response.context.private.actionCredentials to avoid the credentials leaking to the client
        if (!data.output) {
          data.output = {};
        }
        if (actionPayloads) {
          // attach for client to display
          data.actionPayloads = actionPayloads;
        }
        return res.json(data);
      }
    });
  } catch (error) {
    console.log('Calling Assistant failed with:');
    console.log(JSON.stringify(error, null, 2));
    return res.status(500).json(error);
  }
}

// Process an action
function processActions(response, callback) {
  let actions = response.actions;
  console.log("Action configuration:");
  console.dir(actions);
  async.map(actions, (action, done) => {
    switch (action.name) {
      case 'QueryPTFUsermod':
        queryUmodfAction.action(action, done);
        break;
      case 'InstallUsermod':
        installUmodAction.action(action, done);
        break;
      case 'Dal':
        DalAction.action(action, done);
        break;
      case 'Diplinfo':
        DIPLinfoAction.action(action, done);
        break;
      case 'Ipl':
        // if (response.context.IPLrun=true){
        // DalAction.action(action, done);
        // DIPLinfoAction.action(action, done);
        IplAction.action(action, done);
        // response.context.IPLrun=false;
        //  };
        break;
      default:
        done('Unknown action name : ' + action.name);
        break;
    }
  }, (err, results) => {
    if (err) {
      return callback(err, response);
    }

    // copy results to context variables
    console.log("...........Returning new response to Watson Assistant...........");
    //console.dir(response);
    let newResponse = _.cloneDeep(response);
    for (let i = 0; i < actions.length; i++) {
      newResponse.context[actions[i].result_variable] = results[i];
    }
    //newResponse.context.skip_user_input = true;
    callback(null, newResponse);
  });
}

module.exports = app;

