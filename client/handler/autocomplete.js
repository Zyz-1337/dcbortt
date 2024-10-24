const client = require('../bot');
const config = require('../../config');
client.on('interactionCreate', async interaction => {
    if (!interaction.isAutocomplete()) return;
    if (interaction.commandName !== 'giveaway') return;
    const gwid = interaction.options.getString('giveawayid');
    const subcommand = interaction.options.getSubcommand();


    try {
        let values = []
        if (config.debug) console.log(values)

        if (subcommand === "reroll") {
            const giveaways = await client.getGiveAwaysFromLast7Days();
            if (config.debug) console.log(giveaways)
            if (!gwid) {
                for (const [key, value] of Object.entries(giveaways)) {
                    values.push({
                        name: value.price + " (" + value.id + ")",
                        value: value.id
                    })
                }
            } else {
                for (const [key, value] of Object.entries(giveaways)) {
                    // filter if key or value includes the name
                    if (!value.price.includes(gwid) && !value.id.includes(gwid)) continue;
        
                    values.push({
                        name: value.price + " (" + value.id + ")",
                        value: value.id
                    })
                }
            }
        } else {
            const giveaways = await client.getRunningGiveaways();

            if (!gwid) {
                for (const [key, value] of Object.entries(giveaways)) {
                    values.push({
                        name: value.price + " (" + value.id + ")",
                        value: value.id
                    })
                }
            } else {
                for (const [key, value] of Object.entries(giveaways)) {
                    // filter if key or value includes the name
                    if (!value.price.includes(gwid) && !value.id.includes(gwid)) continue;
        
                    values.push({
                        name: value.price + " (" + value.id + ")",
                        value: value.id
                    })
                }
            }
        }
        // only send 25 results
        values = values.slice(0, 25);

        interaction.respond(values);
    } catch (error) {
        console.log(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        })
    }
})