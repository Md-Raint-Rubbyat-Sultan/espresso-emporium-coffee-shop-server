const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m81o4rz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {
        // db name
        const coffeesDb = client.db("CoffeesDb");
        const coffeesCollection = coffeesDb.collection("Coffees");
        const usersCollection = coffeesDb.collection("Users");

        // get data
        app.get("/coffees", async (req, res) => {
            const query = {};
            const result = await coffeesCollection.find(query).toArray();
            res.send(result);
        })

        app.get("/coffees/:id", async (req, res) => {
            const coffeeId = req.params.id;
            const query = { _id: new ObjectId(coffeeId) };
            const result = await coffeesCollection.findOne(query);
            res.send(result);
        })

        app.get("/user", async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        // post data
        app.post("/add-coffees", async (req, res) => {
            const coffeeData = req.body;
            const result = await coffeesCollection.insertOne(coffeeData);
            res.send(result);
        })

        app.post("/user", async (req, res) => {
            const userData = req.body;
            const result = await usersCollection.insertOne(userData);
            res.send(result);
        })

        // update data
        app.put("/coffees/:id", async (req, res) => {
            const coffeeId = req.params.id;
            const { updateName, updateChef, updateSupplier, updateTaste, updateCategory, updateDetails, updatePhoto } = req.body;
            const query = { _id: new ObjectId(coffeeId) };
            const options = { upsert: true };
            const updateCoffee = {
                $set: {
                    name: updateName,
                    chef: updateChef,
                    supplier: updateSupplier,
                    taste: updateTaste,
                    category: updateCategory,
                    details: updateDetails,
                    photo: updatePhoto
                },
            }
            const result = await coffeesCollection.updateOne(query, updateCoffee, options);
            res.send(result);
        });

        app.put("/user", async (req, res) => {
            const { email, lastSignIn } = req.body;
            const query = { email: email };
            const options = { upsert: true };
            const updateUser = {
                $set: {
                    lastSignIn,
                }
            }
            const result = await usersCollection.updateOne(query, updateUser, options);
            res.send(result);
        });

        // delete data
        app.delete("/coffees/:id", async (req, res) => {
            const coffeeId = req.params.id;
            const query = { _id: new ObjectId(coffeeId) };
            const result = await coffeesCollection.deleteOne(query);
            res.send(result);
        })

        app.delete("/user/:id", async (req, res) => {
            const userId = req.params.id;
            const query = { _id: new ObjectId(userId) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("welcome to coffee shope!");
});

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});