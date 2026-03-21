
// USERS
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'technician'], default: 'student' },
  description: { type: String, default: "" },
  profilePic: { type: String, default: "/view/images/blank_pfp.jpg"}
});
// Hash the password before saving the user
userSchema.pre('save', async function (next){
  //Hash only if the password is new or modified
  if (!this.isModified('password')) return;

  //add salt 
  try{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model('User', userSchema);
