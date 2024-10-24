const client = require("../bot");

async function end(interaction) {
    const gwid = interaction.options.getString('giveawayid');

    const giveaway = await client.getGiveaway(gwid);

    if (!giveaway) return interaction.reply({ content: 'This giveaway does not exist', ephemeral: true })

    const channel = await client.channels.fetch(giveaway.channel);
    const message = await channel.messages.fetch(giveaway.id);

    if (!message) return interaction.reply({ content: 'This giveaway does not exist', ephemeral: true })

    if (giveaway.host !== interaction.user.id) return interaction.reply({ content: 'You are not the host of this giveaway', ephemeral: true })

    if (giveaway.ended) return interaction.reply({ content: 'This giveaway has already ended', ephemeral: true })

    client.endGiveaway(gwid);

    interaction.reply({ content: 'Giveaway ended', ephemeral: true })
}

module.exports = end;