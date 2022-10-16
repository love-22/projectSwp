const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const session = require('express-session');
const path = require('path');

//session 
app.use(session({
    secret: 'secret code',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 //
    }
  }));

//Api middelwares
app.use(express.json()); //this is to appcep data in json format
app.use(express.urlencoded({ extended: true })); //this is to accept data in urlencoded format
app.use(express.static('public')); //this is to serve static files

//Api Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});  

app.get("/login", (req, res) => {
  console.log(req.body);
  res.send("Thank you for logging in");
  
});

/* app.get("/login", (req, res) => {
  let userId = req.body.userId;
  let password = req.body.password;
  console.log(userId, password);
  res.send("Thank you for logging in");
  }); */

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
