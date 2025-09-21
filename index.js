const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");


app.use(cors());
app.use(express.json());

const uri =
    `mongodb+srv://${process.env.DB_USER}:${DB_PASSWORD}@cluster0.ncobj2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });
    app.post("/lostandfound",async(req,res)=>{
      const newPost = req.body;
      // console.log(newPost)
      const result = await lostandfoundCollection.insertOne(newPost)
      console.log(result)
      res.send(result)
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
