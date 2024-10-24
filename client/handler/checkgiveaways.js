const client = require('../bot');

async function checkgiveaways() {
    await check();
    setInterval(async () => {
        await check();
    }, 5000);
} 

async function check() {
    const giveaways = await client.getRunningGiveaways();
    giveaways.forEach(giveaway => {
        
        let curtime = new Date(Math.floor(Date.now() + 3600000)).toISOString().slice(0, 19).replace('T', ' ');
        let endtime = giveaway.duration
        endtime = new Date(endtime)
        endtime = new Date(endtime.getTime() + 3600000).toISOString().slice(0, 19).replace('T', ' ');
        client.updateEntrys(giveaway.id)
        if (endtime > curtime) return;
        client.endGiveaway(giveaway.id)
    });
}

module.exports = checkgiveaways;