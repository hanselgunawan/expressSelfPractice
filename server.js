/**
 * Created by hansel.tritama on 11/12/17.
 */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'assets')));

let userArr = [];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/list", (req, res) => {
    res.sendFile(path.join(__dirname, "list.html"));
});

app.get("/api", (req, res) => {
    return res.json(userArr);
});

app.post("/register_user", (req, res) => {
    let flag = false;
    let userData = req.body;//body-parser works here!
    for(let i = 0;i < userArr.length; i++)
    {
        if(userArr[i].name === userData.name)
        {
            flag = true;
            break;
        }
    }
    if(flag === false)
    {
        userArr.push(userData);//push data from user input to an array
        res.json(userArr);//POST data to the API
    }
    else
    {
        res.send("found");
    }
});

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});