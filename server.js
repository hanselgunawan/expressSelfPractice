/**
 * Created by hansel.tritama on 11/12/17.
 */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    let userData = req.body;//body-parser works here!
    console.log(userData);
    userArr.push(userData);//push data from user input to an array
    res.json(userArr);//POST data to the API
});