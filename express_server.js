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
function getUserByEmail(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

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
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect(`/login`)
  }
  
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
  if (!longURL) {
    res.status(403).send("The ID does not exist.");
  } else
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

app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;

  const user = users[userId];

const templateVars = {
    user,
  };
res.render("login", templateVars);
});


app.post("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
 if (user) {
  const longURL = req.body.longURL
 const shortURL = generateRandomString(6);
 urlDatabase[shortURL] = longURL;
 res.redirect(`/urls/${shortURL}`);
}
else {
  res.status(403).send("You must be logged in to shorten URLs");
}
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
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (user) {
    
    if (user.password === password) {
      
      res.cookie("user_id", user.id);
      res.redirect("/urls");
    } else {
      
      res.status(403).send("Email and password don't match.");
    }
  } else {
    
    res.status(403).send("Email not found.");
  }
});

app.post("/logout", (req, res) => {

  
 res.clearCookie("user_id");
 console.log(users)
 res.redirect(`/login`);
  
});

app.post("/redirectregister", (req, res) => {
  const userId = req.cookies.user_id;

  const user = users[userId];
  if (user) {
    res.redirect(`/urls`);

  } else {
 
  res.redirect(`/register`);
}
 });

 app.post("/redirectlogin", (req, res) => {
  const userId = req.cookies.user_id;

  const user = users[userId];
  if (user) {
    res.redirect(`/urls`);

  } else {
  
 
  res.redirect(`/login`);
}
 });

app.post("/register", (req, res) => {
  const { email, password } = req.body
  const userId = generateRandomString(6);
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    res.status(400).send("Email in use");
    return;
  }
  
  if (!email) {
    res.status(400).send("Input an email");
    return;

  }
  if (!password) {
    res.status(400).send("Input apassword");
    return;
  }
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