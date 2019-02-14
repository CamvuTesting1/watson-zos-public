'use strict';
var fs = require('fs');
var sysmodName = "AH05318";
var path="./output/temp.txt";
var linesArray = fs.readFileSync(path, 'utf8').split('\r\n')
var lineOutput = [];

for (var i = 0; i < linesArray.length; i++) {
  console.log("-----" + linesArray[i]);
}


for (var i = 0; i < linesArray.length; i++) {
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
  if (linesArray[i].indexOf(sysmodName + '  RECEIVED      APAR') >= 0) {
    lineOutput.push('The sysmod ' + sysmodName + ' has been installed successfully in this system. Here is its status:');
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
console.log('===///////////');
console.log('textResult:' +  textResult);