const express = require("express");
const app = express();
const PORT = 8080;
const multer = require("multer");
const path = require("path");
const db = require("./database/client.js");

app.use(express.static("views"));
app.use(express.static("images"));

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("here");
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    console.log("test");
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({
  storage: fileStorageEngine,
  fileFilter: function (req, file, cb) {
    console.log(req);
    console.log(file);
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

app.post("/upload-profile-pic", upload.single("profile_pic"), (req, res) => {
  // console.log(req.file);
  res.send(
    `<h2>Here is the picture:</h2><img src="${req.file.filename}" alt="something" />`
  );
});

app.post("/upload-cat-pics", upload.array("cat_pics"), (req, res) => {
  console.log(req.files);
  res.send(
    `<h2>Here are the pictures:</h2><img src="${req.files.filename}" alt="something" />`
  );
});

app.get("/get-pics");

app.use((error, req, res, next) => {
  console.log("This is the rejected field ->", error.field);
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
