const discord = require("discord.js");
const client = require("../bot");
const config = require("../../config");
async function reroll(interaction) {
    // return interaction.reply({ content: 'This command is not available yet', ephemeral: true })
    const gwid = interaction.options.getString('giveawayid');

    const giveaway = await client.getGiveaway(gwid);

    if (!giveaway) return interaction.reply({ content: 'This giveaway does not exist', ephemeral: true })

    const channel = await client.channels.fetch(giveaway.channel);
    const message = await channel.messages.fetch(giveaway.id);

    if (!message) return interaction.reply({ content: 'This giveaway does not exist', ephemeral: true })

    // if (giveaway.host !== interaction.user.id) return interaction.reply({ content: 'You are not the host of this giveaway', ephemeral: true })

    if (!giveaway.ended) return interaction.reply({ content: 'This giveaway has not ended yet', ephemeral: true })
    
    if (typeof giveaway.winners === 'string' && giveaway.winners.startsWith('"') && giveaway.winners.endsWith('"')) {
        giveaway.winners = giveaway.winners.substring(1, giveaway.winners.length - 1);
    }

    const winners = JSON.parse(giveaway.winners);

    if (winners.length === 0) return interaction.reply({ content: 'No one has entered this giveaway', ephemeral: true })

    const options = (await Promise.all(winners.map(async (winner, index) => {
        const user = await interaction.guild.members.fetch(winner).catch(() => {});
        if (config.debug) console.log(user);
        if (!user) return null; // Return null if user not found
        return {
            label: `${index + 1}. ${user.displayName}`,
            value: winner.toString() // Ensure value is a string
        };
    }))).filter(option => option !== null); // Filter out null options
    
    if (config.debug) console.log(options);

    // create a select menu with all the winners
    const select = new discord.StringSelectMenuBuilder()
    .setCustomId('reroll')
    .setPlaceholder('Select a winner to reroll')
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(options)

    const row = new discord.ActionRowBuilder()
    .addComponents(select)

    await interaction.reply({ content: 'Select a winner to reroll\nGiveaway ID: (' + gwid + ')', components: [row], ephemeral: true })
}

module.exports = reroll;