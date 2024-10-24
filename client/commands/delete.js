const client = require('../bot');

async function giveawaydelete(interaction) {
    const gwid = interaction.options.getString('giveawayid');

    let giveaway = await client.getGiveaway(gwid);
    if (!giveaway) return interaction.reply({ content: 'There is no giveaway with that id', ephemeral: true })

    if (giveaway.host !== interaction.user.id) return interaction.reply({ content: 'You are not the host of this giveaway', ephemeral: true })


    const channel = await client.channels.fetch(giveaway.channel);
    const message = await channel.messages.fetch(giveaway.id);

    await message.delete();
    await client.deleteGiveaway(gwid);

    interaction.reply({ content: 'Giveaway deleted', ephemeral: true })
}

module.exports = giveawaydelete;