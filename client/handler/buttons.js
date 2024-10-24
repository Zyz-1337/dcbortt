const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const client = require('../bot');
const config = require('../../config');

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === "gentry") {
        const isinga = await client.isUserInGiveaway(interaction.message.id, interaction.user.id)
        const button = new ButtonBuilder()
        .setCustomId("gleave")
        .setLabel(config.giveawayleavebutton.label)
        .setStyle(config.giveawayleavebutton.style)
        .setEmoji(config.giveawayleavebutton?.emoji)
        if (isinga) return interaction.reply({ content: 'You already entered this giveaway, wanna leave it?', components: [new ActionRowBuilder().addComponents(button)], ephemeral: true })
        await client.addUserToGiveaway(interaction.message.id, interaction.user.id)
        client.updateEntrys(interaction.message.id)
        interaction.reply({ content: 'You entered succesfully the giveaway', ephemeral: true })
    } else if (customId === "gleave") {
        const gwid = interaction.message.reference.messageId
        const isinga = await client.isUserInGiveaway(gwid, interaction.user.id)
        if (!isinga) return interaction.update({ content: 'You are not in this giveaway', components: [], ephemeral: true })
        await client.removeUserFromGiveaway(gwid, interaction.user.id)
        client.updateEntrys(gwid)
        interaction.update({ content: 'You left the giveaway', components: [], ephemeral: true })
    }
})