//Hordienko Dmytro SMP Lab4
const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const seriesScheme = new Schema({name: String, 
    director: String, genre: String, date: Number}, 
    {versionKey: false});
const Series = mongoose.model("Series", seriesScheme);
 
app.use(express.static(__dirname + "/public"));
 
// підключення до бази даних
mongoose.connect("mongodb://localhost:27017/seriessdb", 
    { useUnifiedTopology: true, useNewUrlParser: true}, 
    function(err){
    if (err) 
        return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер очікує на підключення...");
    });
});

// для отримання seriess
app.get("/api/seriess", function(req, res){
        
    Series.find({}, function(err, seriess){
        if(err) 
            return console.log(err);
        res.send(seriess)
    });
});
 
// для отримання series
app.get("/api/seriess/:id", function(req, res){
         
    const id = req.params.id;
    Series.findOne({_id: id}, function(err, series){       
        if(err) 
            return console.log(err);
        res.send(series);
    });
});
    
// для додавання series в базу даних
app.post("/api/seriess", jsonParser, function (req, res) {
        
    if(!req.body) 
        return res.sendStatus(400);
        
    const seriesName = req.body.name;
    const seriesDirector = req.body.director;
    const seriesGenre = req.body.genre;
    const seriesDate = req.body.date;
    const series = new Series({name: seriesName, 
        director: seriesDirector, genre: seriesGenre, date: seriesDate});
        
        series.save(function(err){
        if(err) 
            return console.log(err);
        res.send(series);
    });
});

// для вилучення seriess із бази даних
app.delete("/api/seriess/:id", function(req, res){
         
    const id = req.params.id;
    Series.findByIdAndDelete(id, function(err, series){            
        if(err) 
            return console.log(err);
        res.send(series);
    });
});

// для оновлення інформації про series
app.put("/api/seriess", jsonParser, function(req, res){
         
    if(!req.body) 
        return res.sendStatus(400);
    const id = req.body.id;
    const seriesName = req.body.name;
    const seriesDirector = req.body.director;
    const seriesGenre = req.body.genre;
    const seriesDate = req.body.date;
    const newSeries = {director: seriesDirector, 
        name: seriesName, genre: seriesGenre, date: seriesDate};
     
    Series.findOneAndUpdate({_id: id}, newSeries, {new: true}, 
        function(err, series){
        if(err) 
            return console.log(err); 
        res.send(series);
    });
});
