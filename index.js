const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const uri =
  "mongodb+srv://crudUser:wlpI0tQnPzGpHla5@cluster0.wascw.mongodb.net/crudDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollections = client.db("crudDB").collection("products");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollections.insertOne(product).then((result) => {
      res.redirect("/");
    });
  });
  app.get("/products", (req, res) => {
    productCollections.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/product/:id", (req, res) => {
    productCollections
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.patch("/update/:id", (req, res) => {
    productCollections
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    productCollections.deleteOne({ _id: ObjectID(id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
});

app.listen(3000, () => console.log("listening"));
