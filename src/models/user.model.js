import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    avatar: {
        type: String,
        required: false
    },

    refreshToken: {
        type: String
    }

}, {timestamps: true});

// Encrypt password before save
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Check if the password is correct
UserSchema.methods.isPasswordValid = async function(password){
    return await bcrypt.compare(password, this.password);
}

// Generate Access Token
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

//Generate Refresh Token
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;