import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {type: String, trim: true, required: true},
    email: {type: String, lowercase: true, trim: true, required: true, unique: true},
    password: {type: String, trim: true, required: true},
    pic: {type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",},
    isVerified: {type: Boolean, default: false},
},
{
    timestamps: true,
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.pre('findOneAndUpdate',async function(next){
    console.log(this._update)
    if(!this._update.password){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this._update.password = await bcrypt.hash(this._update.password, salt);
})

const UserModel = mongoose.model('User', userSchema);

export default UserModel;