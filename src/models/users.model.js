import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users_camila';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['F', 'M']},
    role: { type: String, enum: ['usuario', 'admin']},
    avatar: String,
    validated: { type: Boolean, required: true, default: false }
});


const userModel = mongoose.model(collection, schema);

export default userModel;