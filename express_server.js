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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id; // Extract the id from the URL parameter
  const longURL = urlDatabase[shortURL]; // Access the longURL using the id
  const templateVars = { shortURL, longURL };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
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

 app.use(cookieParser()); 

app.post("/login", (req, res) => {
  const { username } = req.body;

  res.cookie("username", username);

    
    res.redirect(`/urls`);
  
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_new", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { urlDatabase }