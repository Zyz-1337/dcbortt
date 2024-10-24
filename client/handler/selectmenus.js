const client = require('../bot');
const config = require('../../config');

const rerolegiveaway = require('../functions/rerole');

client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    const { customId } = interaction;

    if (customId === "reroll") {
        const gwid = interaction.message.content.split('\n')[1].split('(')[1].split(')')[0];
        const winnertorerole = interaction.values[0];

        const { winners, newwinner}  = await rerolegiveaway(gwid, winnertorerole);

        if (!newwinner) return interaction.reply({ content: 'There is no new winner', ephemeral: true });
        await client.setGiveawayWinners(gwid, winners);
        const giveaway = await client.getGiveaway(gwid);

        const channel = await client.channels.fetch(giveaway.channel);
        const message = await channel.messages.fetch(giveaway.id);
        let msg = config.rerollemesasge.replace('{winner}', "<@" + newwinner + ">").replace('{prize}', giveaway.price).replace('{host}', "<@" + giveaway.host + ">").replace('{oldwinner}', "<@" + winnertorerole + ">");
        await message.reply(msg)
        interaction.update({ content: 'Giveaway rerolled, the new winner is <@' + newwinner + '>', components: []})


    }
})