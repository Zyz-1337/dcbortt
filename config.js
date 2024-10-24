const config = {}
require('dotenv').config()

config.debug = true

config.guildid = "1290454280418885632"

config.bot = {
    token: process.env.TOKEN,
    name: "Ticket System",
    color: "#2b2b2b",
    avatar: "https://media.discordapp.net/attachments/1061453021902544978/1140418112940945418/cdbz2.png",
    command: "giveaway",
    activitys: [
        {
            name: 'through the matix',
            type: 'Watching',
            status: 'online'
        },
        {
            name: 'with your feelings',
            type: 'Playing',
            status: 'dnd'
        },
    ],
    intervall: 10 * 1000 // 10 Sekunden
}

config.datastore = {
    database: false,
    // !! CHANGE IN .env FILE !! \\
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME
}

config.perms = ["1140432433641160905", "1140462979993833585"]

config.winnermesasge = "{winners} Herzlichen Glückwunsch! Du hast {prize} gewonnen! Öffne bitte hier <#1131279615881650300> ein Ticket um deinen Preis abzuholen!"
config.nowinnermessage = "Niemand hat am Giveaway für {prize} teilgenommen! <:cdbz_sad:1140616627726061598>"
config.rerollemesasge = "Giveaway rerolled, der neue Ausgewählte ist: {newwinner}, Glückwunsch! {oldwinner} wurde entfernt!"
config.noentry = "Keine Teilnehmer"
config.ended = "Bendet vor"

config.giveawayembed = {
    title: "{prize}",
    description: "{description}",
    color: "#FFFFFF",
    author: {
        name: "Giveaway",
        iconURL: "https://media.discordapp.net/attachments/1061453021902544978/1140418112940945418/cdbz2.png"
    },
    footer: {
        text: "Codebotz",
        iconURL: "https://media.discordapp.net/attachments/1061453021902544978/1140418112940945418/cdbz2.png"
    },
    timestamp: true,
    fields: [
        {
            name: "Endet in",
            value: "{end}",
            inline: true
        },
        {
            name: "Gestartet von",
            value: "{host}",
            inline: true
        },
        // {
        //     name: "Entries",
        //     value: "{entries}",
        //     inline: true
        // },
        {
            name: "Gewinner",
            value: "{winners}",
            inline: true
        }
    ]
}

config.giveawaybutton = {
    label: "Giveaway Beitreten ({entries})",
    style: "Primary",
    emoji: "🎉"
}

config.giveawayleavebutton = {
    label: "Giveaway Verlassen",
    style: "Danger",
    emoji: "❌"
}

module.exports = config;