const express = require('express');
const mongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
require("dotenv").config()

//const url = process.env.MONGO_ENV;
const url ='mongodb://localhost:27017';

const dbname = "movie-app";
const collectionName = "movies";
let client;

const app = express();

const connectToDB = async() =>{
    console.log("Connected to the database");
    client = await mongoClient.connect(url);
}
app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.json({message:"Server is up..."});
});
app.get("/moviesList",async(req,res)=>{
    console.log(url)
    const collection = client.db(dbname).collection(collectionName);
    const response = await collection.find().toArray()
    res.json({response});
});

app.post("/addMovie",async(req,res)=>{
    const {id,title,year,length} = req.body
    const collection = client.db(dbname).collection(collectionName);
    const insert = await collection.insertMany([{ 
                id:id,
                title:title,
                year:year,
                length:length
            }])
    res.json(insert.result);
});

app.put("/updateMovie/:name",async(req,res)=>{
    const { name:movieName } = req.params;
    const year = req.body.year;
    const collection = client.db(dbname).collection(collectionName);

    const response = await collection.updateOne(
        { title: movieName },
        {
            $set: {
                year : year
            }
        }
    );
    res.json(response.result);
});

app.delete("/deleteMovie/:name",async(req,res)=>{
    const { name:movieName } = req.params;
    
    const collection = client.db(dbname).collection(collectionName);

    const response = await collection.deleteOne({ title: movieName });
    res.json(response.result);
});


connectToDB();
app.listen(3000);