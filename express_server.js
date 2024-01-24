const express = require("express");
const cookieParser = require("cookie-parser");

function generateRandomString (length) {
 const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;

};

const app = express();

const PORT = 8080;

app.set("view engine", "ejs");
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.get("/urls", (req, res) => {
 
  const userId = req.cookies.user_id;

  const user = users[userId];

const templateVars = {
    user, urls: urlDatabase
  };
res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;

  const user = users[userId];

const templateVars = {
    user,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id; // Extract the id from the URL parameter
  const longURL = urlDatabase[shortURL]; // Access the longURL using the id
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = { shortURL, longURL, user };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const userId = req.cookies.user_id;

  const user = users[userId];

const templateVars = {
    user,
  };
res.render("register", templateVars);
});


app.post("/urls", (req, res) => {
 const longURL = req.body.longURL
 const shortURL = generateRandomString(6);
 urlDatabase[shortURL] = longURL;
 res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const deleteURL = req.params.id; 
  delete urlDatabase[deleteURL];
  res.redirect(`/urls`);
 });

 app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newURL = req.body.newURL;

  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls`);
 });

 

app.post("/login", (req, res) => {
  const { username } = req.body;

  res.cookie("username", username);

    
    res.redirect(`/urls`);
  
});

app.post("/logout", (req, res) => {

  
 res.clearCookie("user_id");
 console.log(users)
 res.redirect(`/urls`);
  
});

app.post("/register", (req, res) => {
  const { email, password } = req.body
  const userId = generateRandomString(6);
 // Create a new user object
 const newUser = {
  id: userId,
  email,
  password, 
};
// add to object
users[userId] = newUser;

res.cookie("user_id", userId);
  console.log(users)
  res.redirect(`/urls`);
   
 });



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { urlDatabase }