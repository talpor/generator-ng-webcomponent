'use strict';
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function closeNumber(str1, str2) {
  var len = Math.min(str1.length, str2.length);
  var compareNum = 0;
  for (var i = 0; i < len; i++) {
    if (str1.charAt(i) === str2.charAt(i)) {
      compareNum++;
    } else {
      return compareNum;
    }
  }
  return compareNum;
}

function rewrite(args) {
  /* jshint -W044 */
  // check if splicable is already in the body text
  var re = new RegExp(args.splicable.map(function (line) {
    return '\s*' + escapeRegExp(line);
  }).join('\n'));

  if (re.test(args.haystack)) {
    return args.haystack;
  }

  var otherwiseLineIndex = 0;
  var lines = args.haystack.split('\n');
  var testLine = args.state;
  var closestLine = _.maxBy(lines, function (line) {
    return closeNumber(line.trim().replace('.state(\'', ''), testLine);
  });

  var closestLineIndex = _.lastIndexOf(lines, closestLine);
  if (closestLineIndex !== 0) {
    for (var i = closestLineIndex; i < lines.length; i++) {
      if (lines[i].indexOf('.state(\'') >= 0) {
        otherwiseLineIndex = i;
        break;
      }
    }
  }

  if (otherwiseLineIndex) {
    otherwiseLineIndex = _.findIndex(lines, function (line) {
      return line.indexOf('.state(') >= 0;
    }, otherwiseLineIndex + 1);
  } else {
    // find the last state
    otherwiseLineIndex = _.findLastIndex(lines, function (line) {
      return (line.indexOf('.state(') >= 0);
    });
  }

  // for (var i = 0; i < lines.length; i++) {
  //   // if i reach the end of the file, go back two lines
  //   otherwiseLineIndex = i - 2;
  //   if (lines[i].indexOf(args.needle) !== -1) {
  //   }
  // });

  var spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  var spaceStr = '';
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  lines.splice(otherwiseLineIndex, 0, args.splicable.map(function (line) {
    return spaceStr + line;
  }).join('\n'));

  return lines.join('\n');
}

function rewriteFile(args) {
  args.path = args.path || process.cwd();
  var fullPath = path.join(args.path, args.file);

  args.haystack = fs.readFileSync(fullPath, 'utf8');
  var body = rewrite(args);

  fs.writeFileSync(fullPath, body);
}

function appName(self) {
  var counter = 0;
  var suffix = self.options['app-suffix'];
  // Have to check this because of generator bug #386
  process.argv.forEach(function (val) {
    if (val.indexOf('--app-suffix') > -1) {
      counter++;
    }
  });
  if (counter === 0 || (typeof suffix === 'boolean' && suffix)) {
    suffix = 'App';
  }
  return suffix ? self._.classify(suffix) : '';
}

module.exports = {
  rewrite: rewrite,
  rewriteFile: rewriteFile,
  appName: appName
};
