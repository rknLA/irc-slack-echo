IRC Slack Bot
========

We built this bot to echo conversations from #rdio on Freenode to a [Slack](https://slack.com/) chat.

It's designed so that it can be easily configured to work with your own IRC channel / Slack instance combo.


Setup
-----

* Fork the repo and run `npm install`
* Create a new incoming web hook on Slack (https://your.slack.com/services/new/incoming-webhook)
* Open the config file and update the parameters.
* Find a server to run it on, and `node bot.js`

Note that the user map listens for IRC mentions with an optional @ character, and automatically wraps the Slack username in <@username> so that Slack sends notifications appropriately.
