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
            console.log("Gamertag not found");
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
            channel.send(`🟢 ${GAMERTAG} just connected on Xbox`);
        }

        if (!isOnline && lastStatus === true) {
            channel.send(`🔴 ${GAMERTAG} is now offline on Xbox`);
        }

        lastStatus = isOnline;

    } catch (error) {
        console.log(error);
    }
}

client.once('ready', async () => {
    console.log(`Bot connected as ${client.user.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);

    channel.send("🤖 Xbox monitoring started");

    setInterval(checkXboxStatus, 60000);
});

client.login(process.env.TOKEN);
