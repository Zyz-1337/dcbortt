const mysql = require('mysql2')
const fs = require('fs')
const config = require('../config.js')
let db

async function init() {
    if (config.datastore.database) {
        db = mysql.createConnection({
            host: config.datastore.host,
            user: config.datastore.user,
            password: config.datastore.pass,
            database: config.datastore.name,
        })
    
        db.connect(async (err) => {
            if (err) return console.error('Error connecting to the database: ' + err.stack);
            console.log('Connection to database established');
            console.log('Checking Tables...')
            await db.promise().query("SELECT * FROM giveaways").catch(async err => {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    console.log('Tables not Found...')
                    console.log('Creating Tables...')
                    await createTable()
                } else {
                    console.log(err)
                }
            })
            console.log('Tables Checked')
        });
    } else {
        if (!fs.existsSync('./data/giveaways.json')) fs.writeFileSync('./data/giveaways.json', '{}', (err) => {if (err) throw err;})
        try {
            JSON.parse(fs.readFileSync('./data/giveaways.json'))
        } catch (error) {
            console.log('Datastore was manipulated, recreating...')
            fs.renameSync('./data/giveaways.json', './data/giveaways_old.json')
            fs.writeFileSync('./data/giveaways.json', '{}', (err) => {if (err) throw err;})
            console.log('Datastore recreated')
        }
    }
}

async function createTable() {
    await db.promise().query(`SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"`).catch(err => console.log(err))
    await db.promise().query(`SET time_zone = "+00:00"`).catch(err => console.log(err))
    await db.promise().query(`CREATE TABLE IF NOT EXISTS giveaways (id varchar(22) NOT NULL, host varchar(22) NOT NULL, price varchar(250) NOT NULL, duration timestamp NOT NULL, winners_ammount int(11) NOT NULL, description text DEFAULT NULL, timestamp timestamp NOT NULL DEFAULT current_timestamp(), channel varchar(22) NOT NULL, ended tinyint(1) NOT NULL DEFAULT 0, entries longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]', winners longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]', PRIMARY KEY (id))`).catch(err => console.log(err))
}

async function createGiveaway(id, host, price, duration, winners_ammount, description, channel) {    
    const doesgwexists = await getGiveaway(id)
    if (config.datastore.database) {
        if (doesgwexists === null) {
            await db.promise().query(`INSERT INTO giveaways (id, host, price, duration, winners_ammount, description, channel) VALUES ('${id}', '${host}', '${price}', '${duration}', '${winners_ammount}', '${description}', '${channel}')`).catch(err => console.log(err))
        } else {
            await db.promise().query(`UPDATE giveaways SET price = '${price}', duration = '${duration}', winners_ammount = '${winners_ammount}', description = '${description}' WHERE id = '${id}'`).catch(err => console.log(err))
        }
    } else {
        let data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        if (doesgwexists === undefined) {
            data[id] = {
                id: id,
                host: host,
                price: price,
                duration: duration,
                winners_ammount: winners_ammount,
                description: description,
                channel: channel,
                timestamp: new Date(Math.floor(Date.now() + 3600000)).toISOString().slice(0, 19).replace('T', ' '),
                entries: [],
                winners: [],
                reroles: [],
                ended: false
            }
            fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
        } else {
            data[id].price = price
            data[id].duration = duration
            data[id].winners_ammount = winners_ammount
            data[id].description = description
            fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
        }
    }
}

async function getRunningGiveaways() {
    if (config.datastore.database) {
        const result = await db.promise().query(`SELECT * FROM giveaways WHERE ended = 0`).catch(err => console.log(err))
        return result[0] || null
    } else {
        const data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        let giveaways = []
        for (const [key, value] of Object.entries(data)) {
            if (value.ended) continue;
            giveaways.push(value)
        }
        return giveaways
    }
}

async function getGiveaway(id) {
    if (config.datastore.database) {
        const result = await db.promise().query(`SELECT * FROM giveaways WHERE id = ${id}`).catch(err => console.log(err))
        return result[0][0] || null
    } else {
        const data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        let giveaway = data[id]
        return giveaway
    }
}

async function endGiveaway(id) {
    if (config.datastore.database) {
        await db.promise().query(`UPDATE giveaways SET ended = 1 WHERE id = '${id}'`).catch(err => console.log(err))
    } else {
        let data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        data[id].ended = true
        fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
    }
}

async function setGiveawayWinners(id, winner) {
    if (config.datastore.database) {
        await db.promise().query(`UPDATE giveaways SET winners = '${JSON.stringify(winner)}' WHERE id = '${id}'`).catch(err => console.log(err))
    } else {
        let data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        data[id].winners = winner
        fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
    }
}

async function isUserInGiveaway(id, userid) {
    console.log(id, userid)
    if (config.datastore.database) {
        const result = await db.promise().query(`SELECT * FROM giveaways WHERE id = ${id}`).catch(err => console.log(err))
        if (!result[0][0]) return false
        let entries = result[0][0].entries
        if (config.debug) console.log(entries)
        console.log(entries.includes(userid))
        if (entries.includes(userid)) return true
        else return false
    } else {
        const data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        const giveaway = data[id]
        const entries = giveaway.entries
        if (entries.includes(userid)) return true
        else return false
    }
}

async function addUserToRerolled(id, user) {
    if (config.datastore.database) {
        const result = await db.promise().query(`SELECT * FROM giveaways WHERE id = ${id}`).catch(err => console.log(err))
        if (!result[0][0]) return false
        const reroles = JSON.parse(result[0][0].reroles)
        reroles.push(user)
        await db.promise().query(`UPDATE giveaways SET reroles = '${JSON.stringify(reroles)}' WHERE id = '${id}'`).catch(err => console.log(err))
    } else {
        let data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        data[id].reroles.push(user)
        fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
    }
}

async function addUserToGiveaway(id, user) {
    if (config.datastore.database) {
        const result = await db.promise().query(`SELECT * FROM giveaways WHERE id = ${id}`).catch(err => console.log(err))
        if (!result[0][0]) return false
        const entries = JSON.parse(result[0][0].entries)
        entries.push(user)
        await db.promise().query(`UPDATE giveaways SET entries = '${JSON.stringify(entries)}' WHERE id = '${id}'`).catch(err => console.log(err))
    } else {
        let data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        data[id].entries.push(user)
        fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
    }
}

async function removeUserFromGiveaway(id, user) {
    if (config.datastore.database) {
        const result = await db.promise().query(`SELECT * FROM giveaways WHERE id = ${id}`).catch(err => console.log(err))
        if (!result[0][0]) return false
        const entries = JSON.parse(result[0][0].entries)
        const index = entries.indexOf(user)
        if (index > -1) {
            entries.splice(index, 1)
        }
        await db.promise().query(`UPDATE giveaways SET entries = '${JSON.stringify(entries)}' WHERE id = '${id}'`).catch(err => console.log(err))
    } else {
        let data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        const giveaway = data[id]
        const entries = giveaway.entries
        const index = entries.indexOf(user)
        if (index > -1) {
            entries.splice(index, 1)
        }
        fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
    }
}

async function deleteGiveaway(id) {
    if (config.datastore.database) {
        await db.promise().query(`DELETE FROM giveaways WHERE id = '${id}'`).catch(err => console.log(err))
    } else {
        let data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        delete data[id]
        fs.writeFileSync('./data/giveaways.json', JSON.stringify(data), (err) => {if (err) throw err;})
    }
}

async function getGiveAwaysFromLast7Days() {
    if (config.datastore.database) {
        const result = await db.promise().query(`SELECT * FROM giveaways WHERE duration > NOW() - INTERVAL 7 DAY AND ended = 1`).catch(err => console.log(err))
        return result[0] || null
    } else {
        const data = await JSON.parse(fs.readFileSync('./data/giveaways.json'))
        let giveaways = []
        for (const [key, value] of Object.entries(data)) {
            if (value.ended) continue;
            if (new Date(value.timestamp).getTime() < new Date(Math.floor(Date.now() - 604800000)).getTime()) continue;
            giveaways.push(value)
        }
        return giveaways
    }
}

module.exports = { init, createGiveaway, getRunningGiveaways, getGiveaway, endGiveaway, setGiveawayWinners, isUserInGiveaway, addUserToRerolled, addUserToGiveaway, removeUserFromGiveaway, deleteGiveaway, getGiveAwaysFromLast7Days }