const { Client, GatewayIntentBits } = require('discord.js');
const XboxLiveAPI = require('@xboxreplay/xboxlive-api');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = "1505632960236355724";
const GAMERTAG = "Méchando Qc";

let lastStatus = null;

async function checkXboxStatus() {
    try {
        const people = await XboxLiveAPI.people.find(GAMERTAG);

        if (!people || !people.people || people.people.length === 0) {
            console.log("Gamertag introuvable");
            return;
        }

        const user = people.people[0];
        const isOnline = user.isOnline;

        const channel = await client.channels.fetch(CHANNEL_ID);

        if (lastStatus === null) {
            lastStatus = isOnline;
            return;
        }

        if (isOnline && lastStatus === false) {
            channel.send(`🟢 ${GAMERTAG} vient de se connecter sur Xbox`);
        }

        if (!isOnline && lastStatus === true) {
            channel.send(`🔴 ${GAMERTAG} est hors ligne sur Xbox`);
        }

        lastStatus = isOnline;

    } catch (error) {
        console.log(error);
    }
}

client.once('ready', async () => {
    console.log(`Bot connecté : ${client.user.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);

    channel.send("🤖 Surveillance Xbox activée");

    setInterval(checkXboxStatus, 60000);
});

client.login(process.env.TOKEN);
