const Discord = require('discord.js');
const config = require('../config');

const client = new Discord.Client({
    autoReconnect: true,
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
    ]
});

client.once('ready', async () => {
    client.embedBuilder = require('./functions/embedcreator');
    client.parseDuration = require('./functions/parseduration');
    console.log('Discord Client started 🗸');
    console.log('Discord Client Informations:')
    console.table([{Name: client.user.username, Tag: client.user.discriminator, ID: client.user.id}]);
    console.log('Discord Client Guilds:')
    console.table(client.guilds.cache.map(guild => {
        return {
            Name: guild.name,
            ID: guild.id,
            Members: guild.memberCount
        }
    }));
    require('./handler/autocomplete');
    require('./handler/presence');
    require('./functions/commandcreator');
    require('./handler/commands');
    require('./handler/contextmenu');
    require('./handler/modals');
    require('./handler/buttons');
    require('./handler/selectmenus');
    await require('../data/datastore').init();
    client.createGiveaway = require('../data/datastore').createGiveaway;
    client.getRunningGiveaways = require('../data/datastore').getRunningGiveaways;
    client.endGiveaway = require('./functions/endgiveaway');
    client.getGiveaway = require('../data/datastore').getGiveaway;
    client.setGiveawayWinners = require('../data/datastore').setGiveawayWinners;
    client.isUserInGiveaway = require('../data/datastore').isUserInGiveaway;
    client.addUserToGiveaway = require('../data/datastore').addUserToGiveaway;
    client.removeUserFromGiveaway = require('../data/datastore').removeUserFromGiveaway;
    client.updateEntrys = require('./functions/entryupdate');
    client.deleteGiveaway = require('../data/datastore').deleteGiveaway;
    client.getWinners = getWinners
    client.addUserToRerolled = require('../data/datastore').addUserToRerolled;
    client.getGiveAwaysFromLast7Days = require('../data/datastore').getGiveAwaysFromLast7Days;
    require('./handler/checkgiveaways')();
})

client.on('messageDelete', async message => {
    if (config.debug) console.log(message)
    if (!message.author.bot) return;
    const giveaways = await client.getRunningGiveaways();
    const giveaway = Object.values(giveaways).find(gw => gw.id === message.id);
    if (!giveaway) return;
    client.deleteGiveaway(message.id);
})

async function getWinners(giveaway) {
    try {
        if (typeof giveaway.winners === 'string' && giveaway.winners.startsWith('"') && giveaway.winners.endsWith('"')) {
            giveaway.winners = giveaway.winners.substring(1, giveaway.winners.length - 1);
        }
        let winners
        let entries
        let reroles
        if (config.datastore.database) {
            winners = JSON.parse(giveaway.winners) || [];
            entries = JSON.parse(giveaway.entries);
            reroles = JSON.parse(giveaway.reroles);
        } else {
            winners = giveaway.winners || [];
            entries = giveaway.entries;
            reroles = giveaway.reroles;
        }

        // Filter out entries that are already winners or in reroles
        let validEntries = entries.filter(entry => !winners.includes(entry) && !reroles.includes(entry));

        for (let i = 0; i < giveaway.winners_ammount && validEntries.length > 0; i++) {
            // Randomly select a winner from the valid entries
            let randomIndex = Math.floor(Math.random() * validEntries.length);
            winners.push(validEntries[randomIndex]);

            // Remove the selected winner from valid entries
            validEntries.splice(randomIndex, 1);
        }

        return winners;
    } catch (error) {
        console.error('Error in getWinners:', error);
        return []; // Return an empty array or handle the error as appropriate
    }
}

console.log("Starting Discord Client ...")

client.login(require("dotenv").config().parsed.TOKEN).catch(err => console.log(err));

module.exports = client;