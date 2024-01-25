const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// quality of life functions =============================================

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
};

function urlsForUser(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
}



//==========================================================================

// objects that are constants ==============================================

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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//==========================================================================
// app.get for /URLS INDEX =================================================

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
const user = users[userId];
const userurls = urlsForUser(userId);
const templateVars = {
    user, userurls: urlDatabase
  };
  if (user) {
    console.log(urlDatabase);
res.render("urls_index", templateVars);
 } else {
  res.status(403).send("You need to login first.");
 }

 
});
//==========================================================================

// app.get for /URLS New CREATE NEW URL=====================================
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
//==========================================================================

  app.get("/urls/:id", (req, res) => {
    const shortURL = req.params.id;
    const userId = req.cookies.user_id;
    const user = users[userId];
    const longURL = urlDatabase[shortURL].longURL;
    const userUrls = urlsForUser(userId);
    
  if  (user && userUrls) {
    const templateVars = { shortURL, longURL, user };
    res.render("urls_show", templateVars);
  }
  else {
    res.status(403).send("You need to login first.");
  }
});
//==========================================================================
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL]
  if (!longURL) {
    res.status(403).send("The ID does not exist.");
  } else
  res.redirect(longURL);
});
//==========================================================================
app.get("/register", (req, res) => {
  const userId = req.cookies.user_id;

  const user = users[userId];

const templateVars = {
    user,
  };
res.render("register", templateVars);
});
//==========================================================================
app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;

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
  console.log("post urls------------->><<<><><")
  const userID = req.cookies.user_id;
  const user = users[userID];
 if (!user) {
  res.status(403).send("You must be logged in to shorten URLs");
  return
}

  const longURL = req.body.longURL
 const shortURL = generateRandomString(6);
const url = { longURL, userID,}



 urlDatabase[shortURL] = url ;
 console.log(urlDatabase)
 res.redirect(`/urls/${shortURL}`);

});

//==========================================================================

  app.post("/urls/:id/delete", (req, res) => {
    const shortURL = req.params.id;
    const userID = req.cookies.user_id;
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
 app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newURL = req.body.newURL;
  const userID = req.cookies.user_id;
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
  urlDatabase[shortURL].longURL = newURL;
  res.redirect(`/urls`);
 });

 //==========================================================================

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);
const textPassword = password
  if (user) {
    if (bcrypt.compareSync(textPassword, user.password)) {
       res.cookie("user_id", user.id);
      res.redirect("/urls");
    } else {
       res.status(403).send("Email and password don't match.");
    }
  } else {
    
    res.status(403).send("Email not found.");
  }
  console.log(password)
});
//==========================================================================
app.post("/logout", (req, res) => {
res.clearCookie("user_id");
 console.log(users)
 res.redirect(`/login`);
  });
//==========================================================================
app.post("/redirectregister", (req, res) => {
  const userId = req.cookies.user_id;
const user = users[userId];
  if (user) {
    res.redirect(`/urls`);
} else {
 res.redirect(`/register`);
}
 });
//==========================================================================

 app.post("/redirectlogin", (req, res) => {
  const userId = req.cookies.user_id;

  const user = users[userId];
  if (user) {
    res.redirect(`/urls`);

  } else {
  
 
  res.redirect(`/login`);
}
 });
//==========================================================================

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
    res.status(400).send("Input a password");
    return;
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
 const newUser = {
  id: userId,
  email,
  password : hashedPassword, 
};
users[userId] = newUser;
res.cookie("user_id", userId);
  console.log(users)
  res.redirect(`/urls`);
   
 });

//==========================================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { urlDatabase }