const client = require('../bot')
const config = require('../../config')
const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('@discordjs/builders')


async function slashcommands() {
    const guild = await client.guilds.fetch(config.guildid).catch((e) => { 
        // chcek if the bot is in the guild
        if (e.code === 10004) return console.log(`Failed to Create Commands! Bot is not in the server with the ID ${config.guildid}`)
     })
    const botcommands = guild.commands

    botcommands.create(
        new SlashCommandBuilder()
            .setName(config.bot.command)
            .setDescription('Giveaway Commands')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('create')
                    .setDescription('Create a giveaway')
    
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('edit')
                    .setDescription('Edit a giveaway')
                    .addStringOption(option =>
                        option
                            .setName('giveawayid')
                            .setDescription('ID of the giveaway')
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('cancel')
                    .setDescription('Cancel a giveaway')
                    .addStringOption(option =>
                        option
                            .setName('giveawayid')
                            .setDescription('ID of the giveaway')
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('end')
                    .setDescription('End a giveaway')
                    .addStringOption(option =>
                        option
                            .setName('giveawayid')
                            .setDescription('ID of the giveaway')
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('delete')
                    .setDescription('Delete a giveaway')
                    .addStringOption(option =>
                        option
                            .setName('giveawayid')
                            .setDescription('ID of the giveaway')
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('reroll')
                    .setDescription('Reroll a giveaway')
                    .addStringOption(option =>
                        option
                            .setName('giveawayid')
                            .setDescription('ID of the giveaway')
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            )
    )
    
    // add context menu commands
    const endgw = new ContextMenuCommandBuilder()
        .setName('End Giveaway')
        .setType(3);
    
    const cancelgw = new ContextMenuCommandBuilder()
        .setName('Cancel Giveaway')
        .setType(3);
    
    const editgw = new ContextMenuCommandBuilder()
        .setName('Edit Giveaway')
        .setType(3);
    
    client.application.commands.set([endgw, cancelgw, editgw])
}

slashcommands();
