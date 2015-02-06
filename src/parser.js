var moment = require('moment');
var fs = require('fs');

var DATE_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):/i;
var ADDED_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):\s([A-z0-9\+\s'\-]+)\s(were|was)\sadded$/i;
var ADDED_BY_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):\s([A-z0-9\+\s'\-]+)\sadded.+(\+[A-z0-9\s]+).*$/i;
var REMOVED_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):\s([A-z0-9\+\s'\-]+)\s(were|was)\sremoved$/i;
var EXIT_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):.\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?\sleft$/i;
var MESSAGE_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):.\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?:\s(.*)/i;
var CHANGED_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):.\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?\schanged\sfrom\s\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?\sto\s\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?/i;
var CHANGED_ALT_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):.\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?\schanged\sto\s\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?/i;
var ICON_CHANGE_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):.\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?\schanged\sthis\sgroup\'s\sicon$/i;
var TOPIC_CHANGE_REGEX = /^(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}):.\u202A?(\+?[A-z0-9\+\s'\-]+)\u202C?\schanged\sthe\ssubject\sto\s“([^”]+)”$/i;

module.exports.parseChatFile = parseChatFile;
module.exports.parseChat = parseChat;

function parseChatFile( path ) {
  var data = fs.readFileSync(path, 'utf8');
  return parseChat(data);
}

function parseChat( data ) {
  var lines = data.toString().match(/[^\r\n]+/g);

  var parsedLines = [];
  var parsedLine;
  var line;
  var matches;

  for (var i = 0; i < lines.length; i++) {
    line = lines[i];
    if ( ADDED_REGEX.test( line ) ) {
      matches = line.match(ADDED_REGEX);
      parsedLine = {
        type: 'added',
        date: matches[1],
        name: matches[2]
      };
    } else if ( ADDED_BY_REGEX.test( line ) ) {
      matches = line.match(ADDED_BY_REGEX);
      parsedLine = {
        type: 'addedBy',
        date: matches[1],
        addedByName: matches[2],
        name: matches[3],
      };
    } else if ( REMOVED_REGEX.test( line ) ) {
      matches = line.match(REMOVED_REGEX);
      parsedLine = {
        type: 'removed',
        date: matches[1],
        name: matches[2]
      };
    } else if ( CHANGED_REGEX.test( line ) ) {
      matches = line.match(CHANGED_REGEX);
      parsedLine = {
        type: 'changed',
        date: matches[1],
        name: matches[2]
      };
    } else if ( CHANGED_ALT_REGEX.test( line ) ) {
      matches = line.match(CHANGED_ALT_REGEX);
      parsedLine = {
        type: 'changed',
        date: matches[1],
        name: matches[2]
      };
    } else if ( EXIT_REGEX.test( line ) ) {
      matches = line.match(EXIT_REGEX);
      parsedLine = {
        type: 'exit',
        date: matches[1],
        name: matches[2]
      };
    } else if ( ICON_CHANGE_REGEX.test( line ) ) {
      matches = line.match(ICON_CHANGE_REGEX);
      parsedLine = {
        type: 'icon',
        date: matches[1],
        name: matches[2]
      };
    } else if ( TOPIC_CHANGE_REGEX.test( line ) ) {
      matches = line.match(TOPIC_CHANGE_REGEX);
      parsedLine = {
        type: 'topic',
        date: matches[1],
        name: matches[2],
        topic: matches[3]
      };
    } else if ( MESSAGE_REGEX.test( line ) ) {
      matches = line.match(MESSAGE_REGEX);
      parsedLine = {};
      parsedLine.type = 'message';
      parsedLine.message = 'message';
      parsedLine.date = matches[1];
      parsedLine.name = matches[2];
      parsedLine.message = matches[3];

      while ( lines[ ++i ] && !DATE_REGEX.test(lines[ i ]) ) {
        parsedLine.message += '\n' + lines[ i ];
      }
      i--;
    } else {
      console.info('\t>> NO MATCH');
      console.info('\t' + line);
    }
    if ( parsedLine ) {
      parsedLine.date = moment(parsedLine.date, 'DD/MM/YYYY HH:mm:ss', true).toDate();
      parsedLines.push(parsedLine);
    }
  }
  return parsedLines;
}
