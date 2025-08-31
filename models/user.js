import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    google_id: { type: String },
    phone: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    user_photo: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const User = mongoose.model("User", UserSchema)

export default User;