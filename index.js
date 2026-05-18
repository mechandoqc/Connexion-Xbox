const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
    console.log(`Bot connecté : ${client.user.tag}`);

    const channel = await client.channels.fetch("1505632960236355724");

    channel.send("Méchando est connecté 🤖");
});

client.login(process.env.TOKEN);
