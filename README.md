IRC Slack Bot
========

We built this bot to echo conversations from #rdio on Freenode to a [Slack](https://slack.com/) chat.

It's designed so that it can be easily configured to work with your own IRC channel / Slack instance combo.


Setup
-----

* Make sure you're running node 0.10.26.  Other versions might work, but are untested.
* Fork the repo and run `npm install`
* Create a new Incoming Web Hook on Slack (https://your.slack.com/services/new/incoming-webhook)
* Create a new Outgoing Web Hook on Slack and grab the token from it.
* Open the config file and update the parameters.  Mostly, you need to make sure that the Outgoing Web Hook points at the server that gets set up in `lib/slack.js`.
* Update the Outgoing Web Hook with your server info and trigger words. (We use `ircbot` and `!`).
* Find a server to run it on, and `node .`

Note that the user map listens for IRC mentions with an optional @ character, and automatically wraps the Slack username in <@username> so that Slack sends notifications appropriately.

Slack Commands
--------------

IRCBot listens for commands based on your trigger words.  At Rdio, we use
both `ircbot` and `!` as triggers, so we can use `ircbot say hello` and
`!say hello` interchangeably.

The bot will strip the `:` character from slack commands, so `ircbot: say hello` will also work properly.

In order for Slack commands to work, you must make sure that the Outgoing
Web Hook and the web server in `lib/slack.js` are set up correctly.


Currently supported Slack commands:

* `ping` -- bot responds with `pong`
* `show` -- lists Slack <-> IRC handle mappings.
* `say` -- tell the bot to say things in IRC on your behalf
* `link` -- link an IRC handle to a Slack handle
  Usage:
    `link [ircName]` links your slack handle to an irc handle.
    `link [slackName] [ircName]` links [slackName] to [ircName].
* `unlink` -- unlink an IRC handle from a Slack handle
  Usage:
    `unlink` unlinks all irc names associated with your Slack handle
    `unlink [ircName]` unlinks your slack handle from [ircName]
    `unlink [slackName] [ircName]` unlinks [slackName] from [ircName]


IRC Commands
------------

Currently supported IRC commands:

* `ping` (and a few variations) -- bot responds with `pong`.
