'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = mongoose.Schema;

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


// Salting password
UserSchema.pre('save', function(next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
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

var PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('User', UserSchema);
mongoose.model('Post', PostSchema);
