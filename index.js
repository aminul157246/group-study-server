
const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.6v8amsy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const assignmentCollection = client.db('assignmentCollection').collection('assignment')



   app.post('/assignment', async(req, res)=> {
    const body = req.body
    const result = await assignmentCollection.insertOne(body)
    res.send(result)
   })

   app.get('/assignment', async(req, res) => {
    const result = await assignmentCollection.find().toArray()
    res.send(result)
   })


   app.get('/assignment/:id', async(req, res) => {
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const result = await assignmentCollection.findOne(query)
    res.send(result)
   })


   


  // //  update 
  //  app.get('/assignments/:id', async(req, res) => {
  //   const id = req.params.id
  //   const query = {_id : new ObjectId(id)}
  //   const result = await assignmentCollection.findOne(query)
  //   res.send(result)
  //  })


   app.put('/assignment/:id' , async(req,res) => {
    const id =req.params.id
    console.log(id);
    const filter = {_id : new ObjectId(id)}
    const updateDoc = req.body;
    const  assignment = {
      $set : {
        title : updateDoc.title,
        assignmentMarks : updateDoc.assignmentMarks,
        description : updateDoc.description,
        imageURL : updateDoc.imageURL
      }
    }
    const result = await assignmentCollection.updateOne(filter,assignment )
    res.send(result)
  })

  // delete 
   app.delete('/assignments/:id', async(req, res) => {
    const id = req.params.id
    // console.log(id);
    const query = { _id : new ObjectId(id)}
    const result = await assignmentCollection.deleteOne(query)
    res.send(result) 
   })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('CRUD  is running......!')
})

app.listen(port, () => {
  console.log(`App is  listening on port ${port}`)
})



