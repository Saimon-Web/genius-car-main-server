const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors());
app.use(express.json());


//connected mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5gctk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
async function run(){
       try{
           await client.connect();
           const serviceCollection =client.db('genius-car-main').collection('service');

           //api send and collected // all data
          app.get('/service', async(req,res) => {
            const query ={};
            const cursor=serviceCollection.find(query);
            const services=await cursor.toArray();
            res.send(services);
          })
          //end

          //single data 
          app.get('/service/:id', async(req,res)=> {
              const id =req.params.id;
              const query={_id:ObjectId(id)}
              const service=await serviceCollection.findOne(query);
              res.send(service);
          })

          // post
          app.post ('/service',async(req,res) => {
              const newService=req.body;
              const result=await serviceCollection.insertOne(newService);
              res.send(result);
          })

          //delete
          app.delete('/service/:id', async(req,res) => {
              const id =req.params.id;
              const query={_id:ObjectId(id)};
              const result =await serviceCollection.deleteOne(query);
              res.send(result);
          })

       }
       finally{

       }
     
    }
    run().catch(console.dir)
 




app.get('/', (req, res) => {
    res.send('running genius car server')
})



app.listen(port, () => {
    console.log('listening to the', port)
})