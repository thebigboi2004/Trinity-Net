const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, MessageActionRow } = require("discord.js");
const mongoose = require("mongoose");

const GuildSchema = require('../../database');
module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('bump', 'test', []);
  }

  async run(client, message, args) {
    let arr = [];
    const channel = await GuildSchema.find({guildName: { $exists: true }});

    const currentGuild = await GuildSchema.findOne({ guildID: message.guild.id });

    const Error = new MessageEmbed()
      .setColor(client.colors.error)
      .setAuthor("Failed", client.user.displayAvatarURL({ dynamic: true}));

    if (!currentGuild.guildDescription) {
      Error.setDescription(`Hello, ${message.author}! The server is missing description, please use \`^description\` to describe the server! `)

      return message.channel.send({ embeds: [Error]});
    }

    
    const System = new MessageEmbed()
    .setColor(client.colors.success)
    .setAuthor(`Server Bumped`, client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`The server has been bumped successfully, ${message.author}!`);


    let bumpedTime = currentGuild.guildTime;
    let currentTime = Date.now();
    let cooldown = 7200 * 1000;
    let bumped = Math.round(bumpedTime);
  
    //message.channel.send(`${result1 - cool}`);
    //message.channel.send(`${Math.round(currentTime/1000/60) - Math.round((bumped + cooldown)/1000/60)}`)


    if (bumpedTime > 0) {
      const time = (bumped + cooldown)/1000/60;
      //message.channel.send(`${Math.round(time)}, ${Math.round(currentTime)}`);

      if((currentTime/1000/60) < time) {
        const time_left = Math.floor(time - (currentTime/1000/60));

        Error.setDescription(`${message.author}, please wait ${time_left.toFixed(0) < 1 ? "1" : time_left.toFixed(0)} minutes before using bump command!`)

        return message.reply({ embeds: [Error]});
      }
    } else {
      await currentGuild.updateOne({
        guildTime: currentTime,
      });

      GuildSchema.find({guildName: {$exists: true}}, async(err, data) => {
        data.map(({ guildChannel }) => {
          if (!guildChannel) return;
          if (guildChannel === currentGuild.guildChannel) return;

          
          client.bumpEmbed({
            color: "BLUE",
            title: message.guild.name,
            description: currentGuild.guildDescription,
            invite: currentGuild.guildInvite,
            thumbnail: message.guild.iconURL()
          }, guildChannel);

          message.channel.send({ embeds: [System]});
        })
      });
      return;
    }
    
    await currentGuild.updateOne({
      guildTime: currentTime,
    });
    
    
    if (currentGuild) {
        GuildSchema.find({guildName: {$exists: true}}, async(err, data) => {
            data.map(({ guildChannel }) => {
              if (!guildChannel) return;
              if (guildChannel === currentGuild.guildChannel) return;

              
              client.bumpEmbed({
                color: "BLUE",
                title: message.guild.name,
                description: currentGuild.guildDescription,
                invite: currentGuild.guildInvite,
                thumbnail: message.guild.iconURL()
              }, guildChannel);

                message.channel.send({ embeds: [System]});
            })
        })
    } else {
        const System1 = new MessageEmbed()
        .setColor(client.colors.error)
        .setAuthor(`Failed`, client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Hello ${message.author}! This server is not found in the network alliance, please ask the bot directors to set up the bot for the server!`);

        message.channel.send({ embeds: [System1]});
    }
  }
}
