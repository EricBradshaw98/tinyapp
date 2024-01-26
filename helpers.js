

const getUserByEmail = function(email, users) {
  for (const userId in users) {
    if (users[userId].email === email) {
      const user = users[userId];
      return user
    }
  }
  return null;
};




module.exports = { getUserByEmail };

