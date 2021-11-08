
const { Client, Intents, MessageEmbed } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ], partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER'] });
const mongoose = require('mongoose');
require('dotenv').config();


const colors = {
    error: 0xF91A3C,
    success: 0x13EF8D
};

mongoose.connect("mongodb+srv://Ohsusu:Bikavalu1234@cluster0.zizdt.mongodb.net/MainDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database!')
}).catch(err => console.error(err));



(async () => {
  client.ownerID = null;
  client.colors = colors;
  client.supportGuildId = '899759030166224937';
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;

  client.bumpEmbed = function({color, title, description, invite, thumbnail}, channel) {
    const System = new MessageEmbed()
    .setColor(color)
    .setTitle(`${title}`)
    .setThumbnail(thumbnail)
    .setDescription(`${description}`)
    .setFooter(`Trinity Network`, client.user.displayAvatarURL());
    
    client.channels.cache.get(channel).send({content: `${invite}`, embeds: [System]});
  };

  client.bumpEmbedWithBanner = function({color, title, description, invite, thumbnail, banner}, channel) {
    const System = new MessageEmbed()
    .setColor(color)
    .setTitle(`${title}`)
    .setThumbnail(thumbnail)
    .setDescription(`${description}`)
    .setFooter(`Trinity Network`, client.user.displayAvatarURL());
    
    client.channels.cache.get(channel).send({content: `${invite}`, embeds: [System]});
    client.channels.cache.get(channel).send(`${banner}`);

    
  }

  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_TOKEN);
})();

