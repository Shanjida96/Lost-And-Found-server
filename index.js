const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ncobj2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection = client.db("LostAndFoundDB").collection("users");
    const  lostandfoundCollection = client.db("LostAndFoundDB").collection("LostAndFound")
    const  recoveredCollection = client.db("RecoveredDB").collection("RecoveredDB")
    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });
    app.post("/items",async(req,res)=>{
      const newPost = {
        ...req.body,
        date: new Date(req.body.date)
      }
      console.log(newPost)
      const result = await lostandfoundCollection.insertOne(newPost)
      console.log(result)
      res.send(result)
    })
    app.post('/recovered/:id',async(req,res)=>{
      const recovered = req.body;
      const Id = req.params.id
      const result = await recoveredCollection.insertOne(recovered);
      res.send(result);
    })
      app.get('/recovered/:id',async(req,res)=>{
      const result =await recoveredCollection.find().toArray();
      res.send(result)
    })
    app.get('/allRecovered',async(req,res)=>{
      const email = req.query.email;
      const query = {email: email}
      const recovered = await recoveredCollection.find(query).toArray()
      res.send(recovered);
    })
    app.get("/items",async(req,res)=>{
      const result = await lostandfoundCollection.find().sort({date: -1}).toArray();
      res.send(result)
    })
    app.get("/items/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await lostandfoundCollection.findOne(query);
      res.send(result);
    })
    app.get('/myitems',async(req,res)=>{
      const email = req.query.email;
      const query = {email: email}
      const posts = await lostandfoundCollection.find(query).toArray();
      res.send(posts)
    })
    app.get('/myitems/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await lostandfoundCollection.findOne(query)
      res.send(result);
    })
    app.patch("/myitems/:id",async(req,res)=>{
        const id = req.params.id;
        const updatedItem =req.body
        const filter = {_id: new ObjectId(id)};
        const updatedDoc = {
          $set: {
           ...updatedItem
          }
        }
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Lost and Found server is running");
});

app.listen(port, () => {
  console.log(`Lost and Found server running on port ${port}`);
});
