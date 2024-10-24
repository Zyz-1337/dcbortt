const discord = require('discord.js');
const client = require('../bot');
const config = require('../../config');

async function gedit(interaction) {
    const gwid = interaction.options.getString('giveawayid');

    let giveaway = await client.getGiveaway(gwid);
    if (!giveaway) return interaction.reply({ content: 'There is no giveaway with that id', ephemeral: true })

    if (giveaway.host !== interaction.user.id) return interaction.reply({ content: 'You are not the host of this giveaway', ephemeral: true })

    let duration = giveaway.duration
    if (config.datastore.database) {
    // add 1 hour to duration
        duration = new Date(duration.getTime() + 60 * 60 * 1000);
        // format to YYYY-MM-DD HH:MM:SS
        duration = new Date(duration).toISOString().slice(0, 19).replace('T', ' ');
    }

    if (config.debug) console.log(duration)

    const modal = new discord.ModalBuilder()
    .setCustomId('gedit')
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
                .setValue(giveaway.price)
            ),
            new discord.ActionRowBuilder()
            .addComponents(
                new discord.TextInputBuilder()
                .setLabel('Duration')
                .setCustomId('duration')
                .setRequired(true)
                .setStyle(discord.TextInputStyle.Short)
                .setValue(duration.toString())
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
                .setValue(giveaway.winners_ammount.toString())
            ),
            new discord.ActionRowBuilder()
            .addComponents(
                new discord.TextInputBuilder()
                .setLabel('Description')
                .setCustomId('description')
                .setPlaceholder('Enter a detailed description')
                .setRequired(false)
                .setStyle(discord.TextInputStyle.Paragraph)
                .setValue(giveaway.description)
            ),
            new discord.ActionRowBuilder()
            .addComponents(
                new discord.TextInputBuilder()
                .setLabel('Giveaway ID')
                .setCustomId('gwid')
                .setPlaceholder('GWID')
                .setRequired(false)
                .setStyle(discord.TextInputStyle.Short)
                .setValue(giveaway.id)
            ),
    )

    await interaction.showModal(modal)
}

module.exports = gedit;