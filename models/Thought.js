const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        trim: true,
        required: 'thoughtText is Required',
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: 'username is Required'
    },
    reactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reaction'
        }
     ]
}, {
    toJSON: {
        virtuals: true
    }
});

ThoughtSchema.virtual("reactionCount").get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
