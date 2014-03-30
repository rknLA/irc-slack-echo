var _ = require('underscore');
var fs = require('fs');

var userMapPath = 'userMap.json';

var userMap = JSON.parse(fs.readFileSync(userMapPath, 'utf8'));

var writeUserMap = function() {
  // synchronously write the user map file
  var userMapString = JSON.stringify(userMap);
  var fsSuccess = fs.writeFileSync(userMapPath, userMapString);
  return fsSuccess;
};

module.exports = {
  ircToSlack: function(originalMessage) {
    var modifiedMessage = originalMessage;
    _.each(userMap, function(val, key, list) {
      var re = new RegExp("@?" + key, 'gi');
      modifiedMessage = modifiedMessage.replace(re, "<@" + val + ">");
    });
    return modifiedMessage;
  },

  link: function(slackName, ircName) {
    userMap[ircName] = slackName;
    var writeError = writeUserMap();
    if (writeError) {
      return "Error writing user map file. " + writeError;
    }
    return "Mapped " + slackName + "(slack) to " + ircName + "(irc)";
  },

  unlink: function(slackName, ircName) {
    if (ircName) {
    } else {
      _.each(userMap, function(val, key, list) {
        if (val == slackName) {
          delete userMap[key];
        }
      });
    }
    var writeError = writeUserMap();
    if (writeError) {
      return "Error writing user map file. " + writeError;
    }
    return "Unmapped " + slackName + "(slack) from " + ircName + "(irc)";
  },

  list: function() {
    var output = "(slack)\t-> (irc)\n";
    _.each(userMap, function(val, key, list) {
      output += val + "\t-> " + key + "\n";
    });
    return output;
  }
};
