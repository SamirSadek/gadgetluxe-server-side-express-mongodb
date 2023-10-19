const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmjacbf.mongodb.net/?retryWrites=true&w=majority`;

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
    const productCollection = client.db("productDB").collection("product");
    const cartCollection = client.db("cartDB").collection("cart");
    const brandCollection = client.db("brandDB").collection("brand");

    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);
      const result = await productCollection.insertOne(newProducts);
      res.send(result);
    });
    app.post("/addCart", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);
      const result = await cartCollection.insertOne(newProducts);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = {upsert: true}
      const updatedProduct =req.body
      const product = {

        $set: {
          name: updatedProduct.name,
          image: updatedProduct.image,
          brandName: updatedProduct.brandName,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
        }
        
      }
    const result = await productCollection.updateOne(filter, product, options)
    res.send(result)

    });

    app.post("/brands", async (req, res) => {
      const brands = req.body;
      console.log(brands);
      const result = await brandCollection.insertOne(brands);
      res.send(result);
    });
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(port, () => {
  console.log(`Server is Running On Port : ${port}`);
});
