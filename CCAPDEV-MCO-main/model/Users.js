
// USERS
let users = [
  { id: 1, name: "Thistle Caindoy", email: "thistle_zhi_caindoy@dlsu.edu.ph",password:"thisle123", role: "student", description: "I am a BSMS - Computer Science Student." },
  { id: 2, name: "Luis Carlos", email: "luis_carlos@dlsu.edu.ph", password:"luis123", role: "student", description: "Computer Science student who loves coding." },
  { id: 3, name: "Ramuel Cordero", email: "ramuel_cordero@dlsu.edu.ph", password:"ram123", role: "student", description: "I enjoy working with css!" },
  { id: 4, name: "Alberto Descalzo", email: "alberto_descalzo@dlsu.edu.ph", password:"albert123", role: "student", description: "I prefer quiet computer laboratories." },
  { id: 5, name: "Danny Cheng", email: "danny.cheng@dlsu.edu.ph", password:"dan123", role: "technician", description: "Lab technician assisting students." }
];

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
};
