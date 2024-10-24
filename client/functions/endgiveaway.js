const client = require("../bot");
const config = require("../../config");

async function endgiveaway(id) {
    const giveaway = await client.getGiveaway(id);
    if (config.debug) console.log(giveaway);
    if (!giveaway) return;

    await require('../../data/datastore').endGiveaway(id);

    let winners = await client.getWinners(giveaway);

    client.setGiveawayWinners(id, JSON.stringify(winners));

    const channel = await client.channels.fetch(giveaway.channel);
    if (!channel) return;

    const message = await channel.messages.fetch(id);
    if (!message) return;

    let winnersText = "";
    winners.forEach(winner => {
        winnersText += "<@" + winner + ">, "
    })

    winnersText = winnersText.slice(0, -2);
    let entries
    let winnersn
    if (config.datastore.database) {
        entries = JSON.parse(giveaway.entries).length
        winnersn = JSON.parse(giveaway.winners).length
    } else {
        entries = giveaway.entries.length
        winnersn = giveaway.winners.length
    }
    const embed = await client.embedBuilder('giveawayembed');
    embed.setTitle(embed.data.title.replace('{prize}', giveaway.price))
    if (giveaway.description) embed.setDescription(embed.data.description.replace('{description}', giveaway.description))
    else embed.setDescription(null)
    embed.data.fields.forEach(field => {
        if (field.value === '{end}') {
            field.name = config.ended;
            field.value = "<t:" + (Math.floor(Date.now() / 1000))  + ":R>";
        }
        if (field.value === '{winners}') field.value = (winnersn === 0) ? config.noentry : winnersText
        if (field.value === '{entries}') field.value = entries
        if (field.value === '{host}') field.value = "<@" + giveaway.host + ">"

    })

    const button = message.components[0].components[0];
    button.data.disabled = true;
    button.data.style = 2;
    button.data.label = config.giveawaybutton.label.replace('{entries}', entries);

    const actionRow = message.components[0];
    actionRow.components[0] = button;
    await message.edit({ embeds: [embed], components: [actionRow] });
    let winnerreply
    if (entries === 0) {
        winnerreply = config.nowinnermessage.replace('{prize}', giveaway.price).replace('{host}', "<@" + giveaway.host + ">");
    } else {
        winnerreply = config.winnermesasge.replace('{winners}', winnersText).replace('{prize}', giveaway.price).replace('{host}', "<@" + giveaway.host + ">");
    } 
        
    message.reply({ content: winnerreply });
}

module.exports = endgiveaway;