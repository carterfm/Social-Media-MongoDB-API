const {Schema, Types, model} = require('mongoose');
const moment = require('moment');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
            minLength: 1
        }, 
        username: {
            type: String,
            required: true
        }, 
        createdAt: {
            type: Date,
            default: Date.now,
            get: (created) => moment(created).format("MMMM Do YYYY, h:mm:ss a")
        }

    }
);

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            maxLength: 280,
            minLength: 1
        }, 
        createdAt: {
            type: Date,
            default: Date.now,
            get: (created) => moment(created).format("MMMM Do YYYY, h:mm:ss a")
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]

    }, 
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

thoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

//Initializing Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;