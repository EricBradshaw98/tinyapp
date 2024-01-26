

const getUserByEmail = function(email, users) {
  for (const userId in users) {
    if (users[userId].email === email) {
      const user = users[userId];
      return user
    }
  }
  return null;
};

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;

}





module.exports = { getUserByEmail, generateRandomString };


