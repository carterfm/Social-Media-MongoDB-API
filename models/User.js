const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            //trims input string by default--so, " user " -> "user", for instance
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                //Writing a custom validator to ensure that we're receiving something in email format
                //Using the regex expression I examined in the previous HW assignment to verify 
                validator: function(value) {
                    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value);
                }
            },
            thoughts: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'thought'
                }
            ],
            friends: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                }
            ]
        },

    }, 
    {
        toJSON: {
            virtuals: true
        }
    }
);

userSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

//Initializing our User model
const User = model('user', userSchema);

module.exports = User;