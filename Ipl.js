/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 */
'use strict';
var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests

/**********************************************************************
 *  Variables for zos-node-accessor module 
 **********************************************************************/
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var Q = require('q');
var Client = require('zos-node-accessor');

var USERNAME = 'phamct'
var PASSWD = 'phongvu2'

var MAX_QUERIES = 100;          	// Query 10 times at most
var QUERY_INTERVAL = 2000;     	// 2 seconds
var client = new Client();

function IplNativeSys(IplAction, callback) {
	var sysToIpl = IplAction.parameters.targetSysName;
	var HOST = IplAction.parameters.systemIP;
	var JCLjob = IplCurrent(sysToIpl);
	console.log(sysToIpl + '++++++++++++++++++++++++++++++++++++++++++++++++++++');
	console.log(HOST + '+++++++++++++++++++++++++++++++++++++++++++++');
	client.connect({ user: USERNAME, password: PASSWD, host: HOST })
		.then(function (client) {
			_client = client;
			if (client.connected) {
				console.log('Connected to...', HOST);
				return client;
			} else {
				console.log('Failed to connect to', HOST);
			}
			return Q.reject('Failed to connect to', HOST);
		});

	return SubmitIplJob(client, JCLjob, callback);
}	// end: IplNativeSys


function SubmitIplJob(client, JCLjob, callback) {

	submitJob(client, JCLjob).then(function (result) {

		console.log('SubmitIplJob: ' + result.jobName + ' JobID...' + result.jobId);

		client.getJobLog(result.jobName, result.jobId, 'x')
			.then(function (jobLog) {
				console.log('getJobLog: Job log output:' + jobLog);
				client.close();
				console.log('<=======================CLOSE CONNECTION=========================>');
				callback(null,parsing(jobLog));

			})
	}).catch(function (err) {
		console.log('IplNativeSysa(IplAction): returned an error');
		console.dir(error);
		callback(JSON.stringify(error.jobLog));
	});
}

/***********************************************************************
 * Functions
 ***********************************************************************/
function submitJob(client, job) {
	var jcl = job.jcl.replace(/ADCDA/g, USERNAME);
	return client.submitJCL(jcl)
		.then(function (jobId) {
			console.log('Submitted: ', job.jobName, jobId);
			var deferred = Q.defer();
			setTimeout(function () {
				pollJCLJobStatus(deferred, client, job.jobName, jobId, MAX_QUERIES);
			}, QUERY_INTERVAL);
			return deferred.promise;
		});
}

function pollJCLJobStatus(deferred, client, jobName, jobId, timeOutCount) {
	if (timeOutCount === 0) {
		console.log('SetTimeout=0 now...');
		deferred.resolve(Client.RC_FAIL);
	}
	client.queryJob(jobName, jobId)
		.then(function (rc) {
			console.log(jobId, rc);		// JOBxxxxx Success or Failing
			if (rc === Client.RC_SUCCESS || rc === Client.RC_FAIL) {
				if (rc == Client.RC_SUCCESS) {
					consol=e.log('pollJCLJobStatus->RC:' + rc);
				}
				deferred.resolve({ jobName: jobName, jobId: jobId, rc: rc });

			} else {
				setTimeout(function () {
					pollJCLJobStatus(deferred, client, jobName, jobId, timeOutCount - 1);
				}, QUERY_INTERVAL);
			}
		});
}

function IplCurrent(sysToIpl) {
	var jcl = fs.readFileSync(path.join(__dirname, '/lib/JCL/AUTOIPL.jcl'), 'utf8');
	jcl = jcl.replace('__VOLSERTYPE__', 'ACT');
	jcl = jcl.replace('__FORCEBOOLEAN__', 'Y');
	jcl = jcl.replace('__SYSTEMNAME__', sysToIpl);
	return { jobName: 'AUTOIPLW', jcl: jcl };
}

function parsing(jobString) {
	var linesArray = jobString.split(/\r?\n/);
	for (var i = 0; i < linesArray.length; i++) {
		console.log("-----" + linesArray[i]);
	}

	// var lineOutput = [];
	var textResult ='';
	for (var i = 0; i < linesArray.length; i++) {
		// Case that the sysmod has been installed in the system
		if (linesArray[i].indexOf('AUTOIPLW ENDED') >= 0) {
			textResult=linesArray[i];
		}
	}
	// var textResult = lineOutput.join('<br>');
console.log('textResult:' +  textResult);
	return textResult;
}

module.exports = {
	action: IplNativeSys
}
