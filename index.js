const express = require('express');
const path = require('path'); // Fixed path import
const app = express();
const fs = require('fs');

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Route to display a list of files
app.get("/", function(req, res) {
  fs.readdir(`./files`, function(err, files) { // Error: relative path may cause issues
    if (err) {
      return res.status(500).send('Error reading directory.');
    }
    res.render("index", { files: files });
  });
});

// Route to display a specific file
app.get("/files/:filename", function(req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) { // Error: relative path may cause issues
    if (err) {
      return res.status(500).send('Error reading file.');
    }
    res.render('show', { filename: req.params.filename, filedata: filedata });
  });
});

// Route to render the edit form for a specific file
app.get("/edit/:filename", function(req, res) {
  res.render("edit", { filename: req.params.filename });
});

// Route to handle the file rename operation
app.post("/edit/:filename", function(req, res) {
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err) { // Error: leading slash removed
    if (err) {
      return res.status(500).send('Error renaming file.');
    }
    res.redirect("/");
  });
});

// Route to handle file creation
app.post('/create', function(req, res) {
  fs.writeFile(`./files/${req.body.Title.split(' ').join('')}.txt`, req.body.details, function(err) { // Error: relative path may cause issues
    if (err) {
      return res.status(500).send('Error creating file.');
    }
    res.redirect("/");
  });
});

app.listen(3000, function(err) {
  if (err) {
    console.error("Error starting the server:", err); 
  } else {
    console.log("Server is running on port 3000");
  }
});
