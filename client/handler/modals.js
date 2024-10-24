const config = require('../../config');
const client = require('../bot');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    const { customId } = interaction;
    
    if (customId === "gcreate") {
        if (config.debug) console.log("gcreate")
        const price = interaction.fields.getTextInputValue('price');
        const duration = interaction.fields.getTextInputValue('duration');
        const winners = interaction.fields.getTextInputValue('winners');
        const description = interaction.fields.getTextInputValue('description');

        if (config.debug) console.log(price, duration, winners, description)

        // if winners isnt an int number return error
        if (isNaN(winners)) return interaction.reply({ content: 'The winners must be a number', ephemeral: true })

        const dur = client.parseDuration(duration)
        // if duration isnt a valid duration return error
        if (!dur) return interaction.reply({ content: 'The duration is not valid', ephemeral: true })

        // create the embed

        const embed = await client.embedBuilder('giveawayembed')

        // go through whole embed and replace the placeholders with the values
        embed.setTitle(embed.data.title.replace('{prize}', price))
        if (description) embed.setDescription(embed.data.description.replace('{description}', description))
        else embed.setDescription(null)
        embed.data.fields.forEach(field => {
            if (field.value === '{end}') field.value = "<t:" + (Math.floor(Date.now() / 1000) + (dur / 1000)) + ":R>"
            if (field.value === '{host}') field.value = interaction.user.toString()
            if (field.value === '{entries}') field.value = '0'
            if (field.value === '{winners}') field.value = winners
        })

        const button = new ButtonBuilder()
            .setCustomId("gentry")
            .setLabel(config.giveawaybutton.label.replace('{entries}', '0'))
            .setStyle(config.giveawaybutton.style)
            .setEmoji(config.giveawaybutton?.emoji)

        const actionRow = new ActionRowBuilder()
            .addComponents(button)

        const message = await interaction.channel.send({ embeds: [embed], components: [actionRow] })
        const id = message.id
        const host = interaction.user.id
        const channel = message.channelId
        // UTC +1 time
        let gwdurration = new Date(Math.floor(Date.now() + dur + 3600000)).toISOString().slice(0, 19).replace('T', ' ');

        // create the giveaway in the database
        client.createGiveaway(id, host, price, gwdurration, winners, description, channel)

        interaction.reply({ content: `Discord Giveaway Created: https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`, ephemeral: true })
    } else if (customId === "gdelete") {
        const id = interaction.fields.getTextInputValue('id');
        const giveaway = await client.getGiveaway(id)
        if (!giveaway) return interaction.reply({ content: 'There is no giveaway with this id', ephemeral: true })

        const message = await interaction.channel.messages.fetch(id)
        if (!message) return interaction.reply({ content: 'There is no giveaway with this id', ephemeral: true })

        message.delete()
        client.deleteGiveaway(id)
        interaction.reply({ content: 'Giveaway deleted', ephemeral: true })
    } else if (customId === "gedit") {
        const gwid = interaction.fields.getTextInputValue('gwid');
        const price = interaction.fields.getTextInputValue('price');
        const duration = interaction.fields.getTextInputValue('duration');
        const winners = interaction.fields.getTextInputValue('winners');
        const description = interaction.fields.getTextInputValue('description');

        let giveaway = await client.getGiveaway(gwid);
        // if winners isnt an int number return error
        if (isNaN(winners)) return interaction.reply({ content: 'The winners must be a number', ephemeral: true })

        const dur = client.parseDuration(duration)
        // if duration isnt a valid duration return error
        if (!dur) return interaction.reply({ content: 'The duration is not valid', ephemeral: true })

        // create the embed

        const embed = await client.embedBuilder('giveawayembed')

        // go through whole embed and replace the placeholders with the values
        embed.setTitle(embed.data.title.replace('{prize}', price))
        if (description) embed.setDescription(embed.data.description.replace('{description}', description))
        else embed.setDescription(null)
        embed.data.fields.forEach(field => {
            if (field.value === '{end}') field.value = "<t:" + (Math.floor(Date.now() / 1000) + (dur / 1000)) + ":R>"
            if (field.value === '{host}') field.value = interaction.user.toString()
            if (field.value === '{entries}') field.value = '0'
            if (field.value === '{winners}') field.value = winners
        })

        const button = new ButtonBuilder()
            .setCustomId("gentry")
            .setLabel(config.giveawaybutton.label.replace('{entries}', '0'))
            .setStyle(config.giveawaybutton.style)
            .setEmoji(config.giveawaybutton?.emoji)

        const actionRow = new ActionRowBuilder()
            .addComponents(button)

    
        const dcchannel = await client.channels.fetch(giveaway.channel);
        const message = await dcchannel.messages.fetch(giveaway.id);
        message.edit({ embeds: [embed], components: [actionRow] })

        const id = giveaway.id
        const host = giveaway.host
        const channel = giveaway.channel


        // UTC +1 time
        let gwdurration = new Date(Math.floor(Date.now() + dur + 3600000)).toISOString().slice(0, 19).replace('T', ' ');

        // create the giveaway in the database
        client.createGiveaway(id, host, price, gwdurration, winners, description, channel)

        interaction.reply({ content: `Discord Giveaway Edited: https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`, ephemeral: true })
    }
})