const client = require("../bot");

async function rerolegiveaway(giveawayid, winnertorerole) {
    const giveaway = await client.getGiveaway(giveawayid);
    if (!giveaway) return;

    if (typeof giveaway.winners === 'string' && giveaway.winners.startsWith('"') && giveaway.winners.endsWith('"')) {
        giveaway.winners = giveaway.winners.substring(1, giveaway.winners.length - 1);
    }

    let winners = JSON.parse(giveaway.winners);
    if (!winners) return;

    // remove the winnertorerole from the winners array
    winners = winners.filter(winner => winner !== winnertorerole);
    if (config.debug) console.log("All Winners, except the one to reroll:");
    if (config.debug) console.log(winners);
    giveaway.winners = JSON.stringify(winners);

    await client.addUserToRerolled(giveawayid, winnertorerole);

    // get a new winner
    const newwinners = await client.getWinners(giveaway)
    if (config.debug) console.log("New Winners:");
    if (config.debug) console.log(newwinners);

    // compare the new winners with the old winners and return the difference
    const newwinner = newwinners.filter(winner => !winners.includes(winner));
    if (config.debug) console.log("New Winner:");
    if (config.debug) console.log(newwinner[0]);

    return {
        winners: newwinners,
        newwinner: newwinner[0]
    }
}

module.exports = rerolegiveaway;
