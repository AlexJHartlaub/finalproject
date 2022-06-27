
const express = require("express");
const app = express();

app.use(express.static(__dirname + '/static'))

// Start MongoDB Atlas ********
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");
const { Router } = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const mongooseUri = "mongodb+srv://finalproject:finalproject1@cluster0.dfnld.mongodb.net/vocabDatabase"
mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})
const vocabSchema = {
	hiragana: String,
	definition: String,
	kanji: String,
}
const Vocab = mongoose.model("vocab", vocabSchema);
const client = new MongoClient(mongooseUri).db("vocabDatabase");

// Create route called from create.html
app.post("/create", function(req, res){
	let newvocab = new Vocab({
		hiragana: req.body.hiragana,
		definition: req.body.definition,
		kanji: req.body.kanji
	})
	
	newvocab.save();
	res.redirect("/");
})

const rendervocabs = (vocabArray) => {
	let text = "Vocabs Collection:\n\n";
	vocabArray.forEach((vocab)=>{
		text += "Hiragana: " + vocab.hiragana  + "\n";
		text += "Definition: " + vocab.definition  + "\n";
		text += "Kanji: " + vocab.kanji  + "\n";
		text += "ID:" + vocab._id + "\n\n";
	})
	text += "Total Count: " + vocabArray.length;
	return text
}

app.get("/read", function(request, response) {
	Vocab.find({}).then(vocabs => { 
		response.type('text/plain');
		response.send(rendervocabs(vocabs));
	})
})


app.post("/delete", function(req, res){
		const id = req.body.id
		client.collection("vocabs").deleteOne({"_id":ObjectId(id)})
		res.redirect("/");
	})
	
app.post("/update", function(req,res){
		const id = req.body.id
		const hiragana = req.body.hiragana
		const definition = req.body.definition
		client.collection("vocabs").updateOne({"_id":ObjectId(id)},{$set:{"hiragana":hiragana}},{$set:{"definition":definition}});
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
