const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

const GuildSchema = require('../../database');

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('setup', 'Admin', []);
  }

  async run(client, message, args) {
    message.delete();

    if (!message.author.id === "868092439976607785" || !message.author.id === "847976407798906890") return;

    const guildID = message.guild.id;
    const guildName = message.guild.name;
    const guildChannel = message.channel.id;

    let guildInvite;
    try {
        guildInvite = await message.channel.createInvite({
            maxAge: 0,
            maxUses: 0
        }, `Bump invite`)
    } catch {
        return message.channel.send("Cannot create invite link");
    }


    const guild = await GuildSchema.findOne({ guildID });

    if (!guild) {
        const newGuild = new GuildSchema({ guildID, guildName, guildInvite, guildChannel });

        newGuild.save()
        .then(result => console.log("Succesfully created guild collection!"))
        .catch(err => console.error(err));

        message.channel.send("This server has been added to the database!");
    } else {
        message.channel.send("This server has been updated");
    }
  }
}