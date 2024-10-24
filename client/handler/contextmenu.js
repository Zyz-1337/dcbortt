const client = require("../bot");
const discord = require('discord.js');
const config = require('../../config');

client.on("interactionCreate", async interaction => {
	if (!interaction.isMessageContextMenuCommand()) return;
    const msg = interaction.channel.messages.cache.get(interaction.targetId);
    if (!msg.author.bot) return interaction.reply({ content: 'This command is only available for Giveaways', ephemeral: true });
    const { targetId } = interaction;

    const giveaway = await client.getGiveaway(targetId);

    if (giveaway === null) return interaction.reply({ content: 'This is not a giveaway', ephemeral: true })
    if (config.debug) console.log(giveaway)
    if (giveaway.host !== interaction.user.id) return interaction.reply({ content: 'You are not allowed to do this', ephemeral: true })

    if (interaction.commandName !== "Giveaway Reroll") {
        const runninggws = await client.getRunningGiveaways();
        let isrunning = false;
        for (const [key, value] of Object.entries(runninggws)) {
            if (config.debug) console.log(value.id, targetId)
            if (value.id === targetId) {
                isrunning = true;
            }
        }

        if (config.debug) console.log(isrunning)
        if (!isrunning) return interaction.reply({ content: 'This giveaway isnt running anymore', ephemeral: true })
        if (config.debug) console.log(interaction.commandName)
        if (interaction.commandName === "End Giveaway") {
            client.endGiveaway(targetId);
            return interaction.reply({ content: 'Giveaway ended', ephemeral: true })
        } else if (interaction.commandName === "Delete Giveaway") {
            const channel = client.channels.cache.get(giveaway.channel);
            const message = channel.messages.cache.get(giveaway.id);
            message.delete();
            client.deleteGiveaway(targetId);
            return interaction.reply({ content: 'Giveaway deleted', ephemeral: true })
        } else if (interaction.commandName === "Edit Giveaway") {
            let duration = giveaway.duration
            // format to YYYY-MM-DD HH:MM:SS
                // add 1 hour to duration
            duration = new Date(duration.getTime() + 60 * 60 * 1000);
            duration = new Date(duration).toISOString().slice(0, 19).replace('T', ' ');

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

            interaction.showModal(modal)
        }
    
    } else {
        // interaction.reply({ content: 'This command is not available yet', ephemeral: true })
        if (!giveaway.ended) return interaction.reply({ content: 'This giveaway has not ended yet', ephemeral: true })
        
    }


});