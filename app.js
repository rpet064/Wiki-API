const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// mongoose setup

mongoose.connect('mongodb://localhost:27017/wikiDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


const articleSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;

//Redirecting to home

app.route("/articles")

  .get(function(req, res){
    Article.find(function(err, foundArticles){
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err){
      if (!err){
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res){
    Article.deleteMany(function(err){
      if (!err){
        res.send ("Seccessfully Deleted All Articles")
      } else {
        res.send(err);
      }
    });
  });

// Redirecting to a specific article

app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No matching articles could be found");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
