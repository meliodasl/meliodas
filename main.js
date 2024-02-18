const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
const XP_FILE = 'xp.json';
const LEVEL_MULTIPLIER = 0.5;
const INITIAL_XP = 10;
const MAX_LEVEL = 200;

let xpData = {};

// Load XP data from file
if (fs.existsSync(XP_FILE)) {
    xpData = JSON.parse(fs.readFileSync(XP_FILE));
}

client.on('message', message => {
    // Ignore bot messages and DMs
    if (message.author.bot || !message.guild) return;

    const userId = message.author.id;
    const userXP = xpData[userId] ? xpData[userId].xp : 0;
    const userLevel = calculateLevel(userXP);

    // Give random XP between 1 and 10
    const xpGain = Math.floor(Math.random() * 10) + 1;
    xpData[userId] = {
        xp: userXP + xpGain,
        level: userLevel
    };

    // Save XP data
    fs.writeFileSync(XP_FILE, JSON.stringify(xpData, null, 2));

    console.log(`User ${message.author.username} gained ${xpGain} XP.`);

    // Check for level up
    const newLevel = calculateLevel(xpData[userId].xp);
    if (newLevel > userLevel) {
        message.channel.send(`Congratulations, ${message.author}! You've leveled up to level ${newLevel}!`);
    }
});

function calculateLevel(xp) {
    return Math.min(MAX_LEVEL, Math.floor(Math.sqrt(xp / INITIAL_XP) / LEVEL_MULTIPLIER));
}

client.login('YOUR_DISCORD_BOT_TOKEN');
