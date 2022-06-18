// MovieCrudUser
//xfmJHwESEdq9Utja
const express = require("express");
const app = express();

app.use(express.static(__dirname + '/static'))

// Start MongoDB Atlas ********
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");
const { Router } = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const mongooseUri = "mongodb+srv://MovieCrudUser:xfmJHwESEdq9Utja@cluster0.zqckn.mongodb.net/movieDatabase"
mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})
const movieSchema = {
	title: String,
	comments: String,
}
const Movie = mongoose.model("movie", movieSchema);
const client = new MongoClient(mongooseUri).db("movieDatabase");

// Create route called from create.html
app.post("/create", function(req, res){
	let newmovie = new Movie({
		title: req.body.title,
		comments: req.body.comments
	})
	
	newmovie.save();
	res.redirect("/");
})

const rendermovies = (movieArray) => {
	let text = "Movies Collection:\n\n";
	movieArray.forEach((movie)=>{
		text += "Title: " + movie.title  + "\n";
		text += "Comments: " + movie.comments  + "\n";
		text += "ID:" + movie._id + "\n\n";
	})
	text += "Total Count: " + movieArray.length;
	return text
}

app.get("/read", function(request, response) {
	Movie.find({}).then(movies => { 
		response.type('text/plain');
		response.send(rendermovies(movies));
	})
})


app.post("/delete", function(req, res){
		const id = req.body.id
		client.collection("movies").deleteOne({"_id":ObjectId(id)})
		res.redirect("/");
	})
	
app.post("/update", function(req,res){
		const id = req.body.id
		const title = req.body.title
		client.collection("movies").updateOne({"_id":ObjectId(id)},{$set:{"title":title}});
		res.redirect("/");
})

const port = process.env.PORT || 3000
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})
