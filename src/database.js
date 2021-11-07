const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        require: true,
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildDescription: String,
    guildChannel: String,
    guildInvite: String,
    guildTime: { 
        type: String,
        default: 0
    }
});

module.exports = mongoose.model("NetworkDB", guildSchema);