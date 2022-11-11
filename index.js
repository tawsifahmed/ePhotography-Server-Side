const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 1000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tawsifahmed.18d0gsh.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


// middle wares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('a11 server running')
})

app.listen(port, () => {
    console.log(`a11 sever running on port ${port}`);
})