'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: /.+\@.+\..+/
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate: [
            function(password) {
                return password.length >= 6;
            },
            'Password should be longer'
        ]
    },
    role: {
        type: String,
        enum: ['Admin', 'Owner', 'User']
    },
    created: {
        type: Date,
        default: Date.now
    },
    website: {
        type: String,
        get: function(url) {
            if (!url) {
                return url;
            } else {
                if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                    url = 'http://' + url;
                }
                return url;
            }
        }
    }
});

// Virtual field - combine first and last name into a new field
UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

// Static method - search for user by username
// Can be used directly on the model, i.e. User.findOneByUsername('username', function(err, user) {...})
UserSchema.statics.findOneByUsername = function(username, callback) {
    this.findOne({
            username: new RegExp(username, 'i')
        },
        callback);
};

// Instance method - authenticate password
// Can be used on any instance of UserSchema, i.e. user.authenticate('password')
UserSchema.methods.authenticate = function(password) {
    return this.password === password;
};

// Middleware for logging POST results
UserSchema.post('save', function(next) {
    if (this.isNew) {
        console.log('A new user has been created.');
    } else {
        console.log('A user updated their details.');
    }
});

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('User', UserSchema);