const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.set("view-engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get('/', (req, res) => {
    fs.readdir(`records`, (err, files) => {
        if (err) return res.status(500).send(err);
        res.render("index.ejs", { files: files });
    });
});

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./records/${req.params.filename}`, "utf-8", (err, fileData)=>{
        if (err) return res.status(500).send(err.message);
        res.render("edit.ejs", {fileData, fileName: req.params.filename})
    })
});

app.get('/delete/:filename', (req, res) => {
    fs.unlink(`./records/${req.params.filename}`, (err)=>{
        if (err) return res.status(500).send(err.message);
        res.redirect("/");
    })
});

app.get('/hisaab/:filename', (req, res) => {
    fs.readFile(`./records/${req.params.filename}`, "utf-8", (err, fileData)=>{
        if (err) return res.status(500).send(err.message);
        res.render("hisaab.ejs", {fileData, fileName: req.params.filename})
    })
});

app.post('/update/:filename', (req, res) => {
    fs.writeFile(`./records/${req.params.filename}`, `${req.body.content}`, (err)=>{
        if (err) return res.status(500).send(err.message);
        res.redirect("/");
    })
});

app.get('/create', (req, res) => {
    res.render("create.ejs");
});

app.post('/createhisaab', (req, res) => {
    let currentDate = new Date();
    let date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`; 
    const recordsDir = path.join(__dirname, 'records');
    const filePath = path.join(recordsDir, date);

    fs.mkdir(recordsDir, { recursive: true }, (err) => {
        if (err) return res.status(500).send(err.message);
        
        fs.writeFile(filePath, req.body.content, (err) => {
            if (err) return res.status(500).send(err.message);
            res.redirect("/");
        });
    });
});




// Server Port
app.listen(3000)