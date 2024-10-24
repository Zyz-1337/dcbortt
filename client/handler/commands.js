const config = require('../../config');
const client = require('../bot');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    // check if user has the roles to use the bot
    if (!interaction.member.roles.cache.some(role => config.perms.includes(role.id))) return interaction.reply({ content: "You don't have the permissions to use this command!", ephemeral: true });
    const { commandName } = interaction;
    
    if (commandName === config.bot.command) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === "create") require('../commands/create')(interaction);
        if (subcommand === "edit") require('../commands/edit')(interaction);
        if (subcommand === "end") require('../commands/end')(interaction);
        if (subcommand === "reroll") require('../commands/reroll')(interaction);
        if (subcommand === "cancel") require('../commands/delete')(interaction);
        if (subcommand === "delete") require('../commands/delete')(interaction);
    }
})