const express = require("express");
const cookieSession = require("cookie-session");
const { getUserByEmail, generateRandomString  } = require("./helpers");
const { urlsForUser, urlDatabase , users  } = require("./database");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
//==========================================================================

app.get("/", (req, res) => {

  res.redirect(302, '/login').send("You need to login first.");
});
//==========================================================================
// app.get for /URLS INDEX =================================================

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const userurls = urlsForUser(userId);
  const templateVars = {
    user,
    userurls,
  };
  if (user) {
    res.render("urls_index", templateVars);
  } else {
    res.status(403).send("You need to login first.");
  }
});
//==========================================================================

// app.get for /URLS New CREATE NEW URL=====================================
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const userurls = urlsForUser(userId);

  const templateVars = {
    user, userurls,
  };
  if (user) {
    res.render("urls_new", templateVars);
  } if (!user) {
    res.redirect(302,`/login`);
  }
  
});
//==========================================================================

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const userId = req.session.user_id;
  const user = users[userId];
  const urlEntry = urlDatabase[shortURL]; 

  if (!urlEntry) {
    res.status(403).send("The ID does not exist.");
    return; 
  }

  const longURL = urlEntry.longURL;
  const userUrls = urlsForUser(userId);
console.log(shortURL)
  if (user && userUrls) {
    const templateVars = { shortURL, longURL, user };
    res.render("urls_show", templateVars);
  } else if (!user) {
    res.status(404).send("You need to login first.");
  }
});
//==========================================================================
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];
  if (!url) {
    res.status(403).send("The ID does not exist.");
    
    return
  }
 

    res.redirect(url.longURL);
  
});
//==========================================================================
app.get("/register", (req, res) => {
  const userId = req.session.user_id;

  const user = users[userId];

  const templateVars = {
    user,
  };
  res.render("register", templateVars);
});
//==========================================================================
app.get("/login", (req, res) => {
  const userId = req.session.user_id;

  const user = users[userId];

  const templateVars = {
    user,
  };
  res.render("login", templateVars);
});
//==========================================================================


//APP POSTS BELOW
//==========================================================================


app.post("/urls", (req, res) => {
  
  const userID = req.session.user_id;
  const user = users[userID];
  if (!user) {
    res.status(403).send("You must be logged in to shorten URLs");
    return;
  }

  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);
  const url = { longURL, userID,};



  urlDatabase[shortURL] = url;
  
  res.redirect(`/urls/${shortURL}`);

});

//==========================================================================

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  const userID = req.session.user_id;
  const user = users[userID];
  
  if (!user) {
    res.status(403).send("You must be logged in to delete URLs.");
    return;
  }
  
  if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found.");
    return;
  }
  
  if (urlDatabase[shortURL].userID !== userID) {
    res.status(403).send("You don't have permission to delete this URL.");
    return;
  }
  
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});
//==========================================================================
const validUrlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newURL = req.body.newURL;
  const userID = req.session.user_id;
  const user = users[userID];
  if (!user) {
    res.status(403).send("You must be logged in to edit URLs.");
    return;
  }

  if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found.");
    return;
  }

  if (urlDatabase[shortURL].userID !== userID) {
    res.status(403).send("You don't have permission to edit this URL.");
    return;
    
  }

  if (!newURL || !newURL.match(validUrlRegex)) {
    res.status(400).send("Invalid URL format.");
    return;
  }
  urlDatabase[shortURL].longURL = newURL;
  res.redirect(`/urls`);
});

//==========================================================================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Input email and password");
    return;
  }
  const user = getUserByEmail(email, users);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
  if (user && !bcrypt.compareSync(password, user.password)) {
    res.status(403).send("Email and password don't match or user not found.");
  }
  if (!user) {
    res.status(404).send("User does not exist");
  }
 
  
  
});
//==========================================================================
app.post("/logout", (req, res) => {
  
  req.session = null;
  
  res.redirect(`/login`);
});
//==========================================================================
app.post("/redirectregister", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (user) {
    res.redirect(`/urls`);
  } else {
    res.redirect(`/register`);
  }
});
//==========================================================================

app.post("/redirectlogin", (req, res) => {
  const userId = req.session.user_id;

  const user = users[userId];
  if (user) {
    res.redirect(`/urls`);

  } else {
  
 
    res.redirect(`/login`);
  }
});
//==========================================================================
//this will take in an email and password inputted
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const userId = generateRandomString(6);
  const existingUser = getUserByEmail(email, users);

  if (existingUser) {
    res.status(400).send("Email in use");
    return;
  }
  if (!email || !password) {
    res.status(400).send("Input email and password");
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: userId,
    email,
    password: hashedPassword,
  };
  users[userId] = newUser;
  req.session.user_id = userId; // Fix typo
  res.redirect(`/urls`);
});
//==========================================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

