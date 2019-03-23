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
var Paratree = require('paratree');

var USERNAME = 'phamct'
var PASSWD = 'phongvu2'
// var HOST 		= 'SSGMES1.tuc.stglabs.ibm.com'

var MAX_QUERIES = 100;          	// Query 10 times at most
var QUERY_INTERVAL = 2000;     	// 2 seconds
var client = new Client();

function InstallUserMods(installUmodAction, callback) {
	var sysmodName = installUmodAction.parameters.usermodName.toUpperCase();
	var HOST = installUmodAction.parameters.systemIP;
	var _client;
	var JCLjob = InstallFixCurrent(sysmodName);
	console.log(sysmodName + '++++++++++++++++++++++++++++++++++++++++++++++++++++');
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

	return SubmitInstallFix(client, JCLjob, sysmodName, callback);
}	// end: InstallUserMods


function SubmitInstallFix(client, JCLjob, sysmodName, callback) {

	submitJob(client, JCLjob).then(function (result) {

		console.log('SubmitInstallFix: ' + result.jobName + ' JobID...' + result.jobId);

		client.getJobLog(result.jobName, result.jobId, 'x')
			.then(function (jobLog) {
				console.log('getJobLog: Job log output:' + jobLog);
				//++++++++++++++++++
				// var filePath = "./output/temp.txt";
				// fs.writeFile(filePath, jobLog, function (err) {
				// 	if (err) {
				// 		return console.log(err);
				// 	}
				// 	console.log("Jog log output was saved to file temp.text.");
				// }
				// );
				//+++++++++++++++++++
				client.close();
				console.log('<=======================CLOSE CONNECTION=========================>');
				callback(null,parsing(jobLog, sysmodName));

			})
	}).catch(function (err) {
		console.log('InstallUserModsa(installUmodAction): returned an error');
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
					console.log('pollJCLJobStatus->RC:' + rc);
				}
				deferred.resolve({ jobName: jobName, jobId: jobId, rc: rc });

			} else {
				setTimeout(function () {
					pollJCLJobStatus(deferred, client, jobName, jobId, timeOutCount - 1);
				}, QUERY_INTERVAL);
			}
		});
}

function InstallFixCurrent(sysmodname) {
	var jcl = fs.readFileSync(path.join(__dirname, '/lib/JCL/INSTALL.jcl'), 'utf8');
	jcl = jcl.replace('__INSTASYMOD__', sysmodname + 'S');
	jcl = jcl.replace('__SYSMODNAME__', sysmodname);
	jcl = jcl.replace('__INSTACOMMENT__', sysmodname + 'S');
	return { jobName: sysmodname + 'S', jcl: jcl };
}

function parsing(jobString,sysmodName) {
	var linesArray = jobString.split(/\r?\n/);
	for (var i = 0; i < linesArray.length; i++) {
		console.log("-----" + linesArray[i]);
	}

	var lineOutput = [];
	for (var i = 0; i < linesArray.length; i++) {

		
		if (linesArray[i].indexOf(sysmodName + 'S ENDED - ABEND=S013') >= 0) {
			lineOutput.push('The sysmod ' + sysmodName + ' does not have an APAR/PTF file submitted in the library D55TST.ZOSR2x.LKED.K2x.');
			lineOutput.push('Please check and provide the file.');
		}

		// Case that the sysmod has been already installed in the system
		if (linesArray[i].indexOf('ALREADY RECEIVED') >= 0) {
			lineOutput.push('The sysmod ' + sysmodName + ' has already been installed in this system. Here is its status:');
			for (var j = i; j < linesArray.length; j++) {
				if (linesArray[j].indexOf('  TYPE            =') >= 0) {
					while (linesArray[j].indexOf('TARGET ZONE') < 0) {
						console.log("++++++++" + linesArray[j]);
						lineOutput.push(linesArray[j]);
						j++;
					}
				}	
			}
		}
		// Case that the sysmod has been installed succesfully in the system
		// if (linesArray[i].indexOf('  TYPE            =') >= 0) {
		// 	while (linesArray[i].indexOf('TARGET ZONE') < 0) {
		// 		console.log("++++++++" + linesArray[i]);
		// 		lineOutput.push(linesArray[i]);
		// 		i++;
		// 	}
		// }
		// Case that the sysmod is failed to be installed
		if (linesArray[i].indexOf('ERROR DESCRIPTION AND POSSIBLE CAUSES') >= 0) {
			i++;
			lineOutput.push('Installing is not completed. Here are error description and possible causes:');
			while (linesArray[i].indexOf('TARGET ZONE') < 0) {
				console.log("++++++++" + linesArray[i]);
				lineOutput.push(linesArray[i]);
				i++;
			}
		}

	}
	var textResult = lineOutput.join('<br>');
console.log('textResult:' +  textResult);
	return textResult;
}

module.exports = {
	action: InstallUserMods
}
