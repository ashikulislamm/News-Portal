import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  country: { type: String, required: true },  
  password: { type: String, required: true },
  bio: { type: String, required: true , default: "No bio available" }
});

export default mongoose.model("Users", userSchema);
