const BaseEvent = require('../../utils/structures/BaseEvent');
const GuildSchema = require('../../database');

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('channelDelete');
  }
  async run (client, channel) {
    const channelDeleteId = channel.id;

    const networkChannel = await GuildSchema.findOne({ guildChannel: channelDeleteId });

    if (networkChannel) {
      await GuildSchema.deleteOne({ guildChannel: channelDeleteId });
      console.log(`Network channel deleted, removed a server from the database!`);
    } else {
      return;
    }
  }
}