const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 1000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tawsifahmed.18d0gsh.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('a11-server').collection('services');
        const reviewerCollection = client.db('a11-server').collection('reviewers')


        // services api for home page (showing 3 services)
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services.slice(-3).reverse());
        });

        // services api for showing all services
        app.get('/servicesall', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services.reverse());
        });

        // specific service detail card api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // add service api post method
        app.post('/services', async (req, res) => {
            const addedService = req.body;
            const result = await serviceCollection.insertOne(addedService);
            res.send(result);
        });

        // reviewers api
        app.get('/reviewers', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            else if
                (req.query.service) {
                query = {
                    service: req.query.service
                }
            }

            const cursor = reviewerCollection.find(query);
            const reviewers = await cursor.toArray();
            res.send(reviewers.reverse());
        });


        // reviewers post 
        app.post('/reviewers', async (req, res) => {
            const reviewer = req.body;
            const result = await reviewerCollection.insertOne(reviewer);
            res.send(result);
        });

        // reviewers dlt
        app.delete('/reviewers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewerCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('a11 server running')
})

app.listen(port, () => {
    console.log(`a11 sever running on port ${port}`);
})