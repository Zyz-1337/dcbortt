const discord = require('discord.js');

async function gcreate(interaction) {
    const modal = new discord.ModalBuilder()
    .setCustomId('gcreate')
    .setTitle('Giveaway Creator')
    .setComponents(
            new discord.ActionRowBuilder()
            .addComponents(
                new discord.TextInputBuilder()
                .setLabel('Prize')
                .setCustomId('price')
                .setPlaceholder('Enter the prize')
                .setRequired(true)
                .setStyle(discord.TextInputStyle.Short)
            ),
            new discord.ActionRowBuilder()
            .addComponents(
                new discord.TextInputBuilder()
                .setLabel('Duration')
                .setCustomId('duration')
                .setPlaceholder('10 secs, 5 mins, 3 hours, 15 days')
                .setRequired(true)
                .setStyle(discord.TextInputStyle.Short)
            ),
            new discord.ActionRowBuilder()
            .addComponents(
                new discord.TextInputBuilder()
                .setLabel('Winners')
                .setCustomId('winners')
                .setPlaceholder('Enter the number of winners')
                .setValue('1')
                .setRequired(true)
                .setStyle(discord.TextInputStyle.Short)
            ),
            new discord.ActionRowBuilder()
            .addComponents(
                new discord.TextInputBuilder()
                .setLabel('Description')
                .setCustomId('description')
                .setPlaceholder('Enter a detailed description')
                .setRequired(false)
                .setStyle(discord.TextInputStyle.Paragraph)
            ),
    )

    await interaction.showModal(modal)
}

module.exports = gcreate;