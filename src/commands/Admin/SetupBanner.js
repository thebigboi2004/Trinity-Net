const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

const GuildSchema = require('../../database');

module.exports = class TestCommand extends BaseCommand {
    constructor() {
      super('description', 'Admin', []);
    }

    async run(client, message, args) {

        let guildBanner = args.slice(0).join(" ");

        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        const System = new MessageEmbed()
        .setColor(client.colors.error)
        .setAuthor(`Failed`, client.user.displayAvatarURL({ dynamic: true }))

        if(!guildBanner) {
            System.setDescription(`${message.author}, please specify a banner for your server!`);
            return message.channel.send({ embeds: [System]});      
        } 


        GuildSchema.findOne({ guildID: message.guild.id }, async(err, data) => {
            if(!data) {
                 const System1 = new MessageEmbed()
                .setColor(client.colors.error)
                .setDescription(`Hello ${message.author}! This server is not found in the network alliance, please ask the bot directors to set up the bot for the server!`);

                message.channel.send({ embeds: [System1]});
            } else {
                await data.updateOne({
                    guildBanner
                });

                const System1 = new MessageEmbed()
                .setColor(client.colors.success)
                .setAuthor(`Added Description`, client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Hello, ${message.author}! The server description has been added, using \`^bump\` command to bump the server!`);

                return message.channel.send({ embeds: [System1]});
            }
        })
    }
}