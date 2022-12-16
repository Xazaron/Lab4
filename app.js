const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const trackScheme = new Schema({name: String, 
    author: String, genre: String, date: Number}, 
    {versionKey: false});
const Track = mongoose.model("Track", trackScheme);
 
app.use(express.static(__dirname + "/public"));
 
// підключення до бази даних
mongoose.connect("mongodb://localhost:27017/songsdb", 
    { useUnifiedTopology: true, useNewUrlParser: true}, 
    function(err){
    if (err) 
        return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер очікує на підключення...");
    });
});

// для отримання книг
app.get("/api/songs", function(req, res){
        
    Track.find({}, function(err, tracks){
        if(err) 
            return console.log(err);
        res.send(tracks)
    });
});
 
// для отримання книги
app.get("/api/songs/:id", function(req, res){
         
    const id = req.params.id;
    Track.findOne({_id: id}, function(err, track){       
        if(err) 
            return console.log(err);
        res.send(track);
    });
});
    
// для додавання книги в базу даних
app.post("/api/songs", jsonParser, function (req, res) {
        
    if(!req.body) 
        return res.sendStatus(400);
        
    const trackName = req.body.name;
    const trackAuthor = req.body.author;
    const trackGenre = req.body.genre;
    const trackDate = req.body.date;
    const track = new Track({name: trackName, 
        author: trackAuthor, genre: trackGenre, date: trackDate});
        
    track.save(function(err){
        if(err) 
            return console.log(err);
        res.send(track);
    });
});

// для вилучення книги із бази даних
app.delete("/api/songs/:id", function(req, res){
         
    const id = req.params.id;
    Track.findByIdAndDelete(id, function(err, track){            
        if(err) 
            return console.log(err);
        res.send(track);
    });
});

// для оновлення інформації про книгу
app.put("/api/songs", jsonParser, function(req, res){
         
    if(!req.body) 
        return res.sendStatus(400);
    const id = req.body.id;
    const trackName = req.body.name;
    const trackAuthor = req.body.author;
    const trackGenre = req.body.genre;
    const trackDate = req.body.pages;
    const newTrack = {author: trackAuthor, 
        name: trackName, genre: trackGenre, date: trackDate};
     
    Track.findOneAndUpdate({_id: id}, newTrack, {new: true}, 
        function(err, track){
        if(err) 
            return console.log(err); 
        res.send(track);
    });
});