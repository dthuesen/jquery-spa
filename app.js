var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require('method-override');

mongoose.connect("mongodb://localhost/todo_app");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

var todoSchema = new mongoose.Schema({
  text: String,
});

var Todo = mongoose.model("Todo", todoSchema);

// ROUTES

app.get("/", function(req, res){
  res.redirect("/todos");
});

/** ESCAPING ANY SPECIAL CHARACTER WITH A BACKSLASH */

function escapeRegex(text) {
  console.log('incoming text: ', text);
  let escapedText = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  console.log('escaped text: ', escapedText)
  return escapedText;
}

app.get("/todos", function(req, res){
  
  if(req.query.keyword) { // if there's a query string called keyword then..
    const regex = new RegExp(escapeRegex(req.query.keyword), 'gi') //set the const regex equal to new regex from the keyword pulled from from query string
    console.log('escaped text: ', regex)
    
    Todo.find({text: regex}, function(err, todos){
      if(err){
        console.log(err);
      } else {
        res.json(todos); // send back the todos found as json
      } 
    })
  } else {
    /** IF THERE WASN'T A QUERY STRING KEYWORD THEN... */
    Todo.find({}, function(err, todos){ // query the db for all todos
      if(err){
        console.log(err);
      } else {
        if (req.xhr) { // if request was made with AJAX then...
          res.json(todos); // send back all todos as JSON
        } else{
          res.render("index", {todos: todos}); // otherwise render the index view and pass in all todos with EJS
        } 
      }
    })
    
  }
  
  
});

app.get("/todos/new", function(req, res){
 res.render("new"); 
});

app.post("/todos", function(req, res){
 req.body.todo.text = req.sanitize(req.body.todo.text);
 var formData = req.body.todo;
 Todo.create(formData, function(err, newTodo){
    if(err){
      res.render("new");
    } else {
      res.json(newTodo);
    }
  });
});

app.get("/todos/:id/edit", function(req, res){
 Todo.findById(req.params.id, function(err, todo){
   if(err){
     console.log(err);
     res.redirect("/")
   } else {
      res.render("edit", {todo: todo});
   }
 });
});

app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, {new: true}, function(err, todo){
   if(err){
     console.log(err);
   } else {
     res.json(todo);
   }
 });
});

app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
     res.json(todo);
   }
 }); 
});


app.listen(3000, function() {
  console.log('Server running on port 3000');
});