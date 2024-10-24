const client = require("../bot");
const config = require("../../config");

async function entryupdate(id) {
    if (config.debug) console.log('entryupdate')
    const giveaway = await client.getGiveaway(id);
   
    if (!giveaway) return;

    const channel = await client.channels.fetch(giveaway.channel);
    if (!channel) return;

    const message = await channel.messages.fetch(id);
    if (!message) return;

    const embed = await client.embedBuilder('giveawayembed');
    embed.setTitle(embed.data.title.replace('{prize}', giveaway.price))
    if (giveaway.description) embed.setDescription(embed.data.description.replace('{description}', giveaway.description))
    else embed.setDescription(null)

    let dur = giveaway.duration
    // convert it into dc timestamp from this format 2023-11-06 21:30:10
    dur = new Date(dur)
    // add 1 hour to the timestamp
    dur = new Date(dur.getTime() + 3600000).toISOString().slice(0, 19).replace('T', ' ');
    // convert it into a timestamp
    dur = new Date(dur).getTime() - new Date().getTime()

    if (config.debug) console.log(Math.floor(dur / 1000))
    dur = Math.floor(dur / 1000)

    let entries
    if (config.datastore.database) {
        entries = JSON.parse(giveaway.entries).length
    } else {
        entries = giveaway.entries.length
    }


    embed.data.fields.forEach(field => {
        if (field.value === '{end}') field.value = "<t:" + (Math.floor(Date.now() / 1000) + (dur)) + ":R>"
        if (field.value === '{host}') field.value = "<@" + giveaway.host + ">"
        if (field.value === '{entries}') field.value = entries
        if (field.value === '{winners}') field.value = giveaway.winners_ammount
    })

    

    const button = message.components[0].components[0];
    button.data.disabled = false;
    button.data.style = 1;
    button.data.label = config.giveawaybutton.label.replace('{entries}', entries);

    const actionRow = message.components[0];
    actionRow.components[0] = button;
    await message.edit({ embeds: [embed], components: [actionRow] });
}

module.exports = entryupdate;