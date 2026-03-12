
// USERS

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'technician'], default: 'student' },
  description: { type: String, default: "" }
});

module.exports = mongoose.model('User', userSchema);
/*
exports.getUsers = () => users;

exports.findByEmail = (email) =>
    users.find(u => u.email === email);

exports.addUser = (newUser) => {
  users.push(newUser);
};

exports.getbyId = (id) =>
  users.find(u => u.id === parseInt (id));

exports.updateUser = (id, updatedData) => {
  const index = users.findIndex(u => u.id === parseInt(id));

  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updatedData
    };
  }
};

exports.deleteUser = (id) => {
  users = users.filter(u => u.id !== parseInt(id));
}; */
