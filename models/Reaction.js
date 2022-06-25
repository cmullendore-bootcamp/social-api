const { Schema, Types, model } = require('mongoose');

const ReactionSchema = new Schema({
    reactionId: {
        type: Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: 'reactionBody is required',
        maxLength: 280
    },
    username: {
        type: String,
        required: 'username is Required'
    },
    createdAt: {
        type: Date,
        default: Date.now
        // Implement getter method!
    }
});

const Reaction = model('Reaction', ReactionSchema);

module.exports = Reaction;