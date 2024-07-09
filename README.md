
# Discord Nuke Bot

This README provides detailed instructions on setting up and configuring the Discord Nuke Bot, including how to host it on bot-hosting.net, its dependencies, and configuration settings.



## Features

- Sends timed messages to specified channels.
- DMs all members in the server.
- Renames all channels.
- Deletes all channels.
- Kicks all members.
- Deletes all roles.
- Auto-runs specified actions when added to a new server.

## Dependencies


- Node.js v16.6.0 or higher
- discord.js v14 or higher
- @discordjs/rest
## config.json

In config.json, you need to replace the bot token and client id with yours, which can be found in the Discord dev portal.
    "token": "YOUR_BOT_TOKEN",
    "clientId": "YOUR_CLIENT_ID",
## How to run

[Go to bot-hosting.net](https://bot-hosting.net/?aff=935849927832109176)

Create new bot that runs on node.js.
When it asks you what plans, I recommend a minimum of the second (25% cpu), but if you are testing on small servers, then the first usually does (20%).

Login to the panel, go to startup, and enter this into the "Additional Node Packages" box: `discord.js @discordjs/rest discord-api-types`

Go to files, and create a new file, enter the code from the index.js file into there, then save it as index.js.
Do the same with config.json.

Next, create a bot in Discord's dev portal, and paste in the bot token and client id into the correct spaces in config.json. There are plenty of YouTube videos demonstrating how to use the dev portal. The bot token can be found in the bot section, and the client id, in the oauth2 section.

Make sure to enable all Privileged Gateway Intents while in the bot section.

Once you have done all that, configure (in config.json) if you want the bot to do anything automatically when it joins the guild. If not, then you will be required to run the /go command.

To start the bot, go to console, and press start.

Now to install the bot on your server, go to the installation section of the Discord dev portal. Make sure that only the "guild install" is ticked. On the guild install config at the bottom, make sure that "scopes" is set to applications.commands, and bot.
Then select permissions, and set that to admin. Now save changes, then go the "install link" box, and copy the link provided by Discord.


## Be nice

This code is for demo purposes only. DO NOT use it maliciously. To protect against these kinds of nuke bots, never invite a bot that has any dangerous permissions, without being sure of it's integrity. Do not drag the bot's role above any other roles, so that it cannot delete those roles, or take other actions. Always keep backups of your server, whether it be through the template, or another bot such as Xenon.

I have made it so that messages that are DMed can't be spammed/repeated, like is possible in channels, to limit any potential damage.

#### Disclaimer

The creator of this bot takes no responsibility for any use or actions resulting from using this bot. Use at your own risk, and ensure compliance with applicable laws. The bot is provided "as is" without any warranty. Users agree to indemnify and hold the creator harmless from any claims or damages arising from its use.

By using this bot, you agree to this disclaimer. If you do not agree, do not use the bot.
