const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 1000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tawsifahmed.18d0gsh.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// jwt function
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const serviceCollection = client.db('a11-server').collection('services');
        const reviewerCollection = client.db('a11-server').collection('reviewers')

        // jwt post api
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10d' });
            res.send({ token })
        })

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
        app.get('/reviewers', verifyJWT, async (req, res) => {
            const decoded = req.decoded;
            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'unauthorized access' })
            }

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

        app.get('/reviewers1', async (req, res) => {
            let query = {};
            if
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

a