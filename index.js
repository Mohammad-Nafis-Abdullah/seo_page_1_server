const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');


const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());
app.use(cors({origin:true,credentials:true}));

const uri = "mongodb+srv://admin:vwiTe123m7D6VADc@cluster0.7ljgqy3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    
    // collection getting function
    const getCollection = (collection_name)=> {
        return client.db("seo_page_1").collection(collection_name);
    }


    // api endpoints
    // ----------------------------------
      app.get('/collections/:name',async (req,res)=> { // get all document of a collection by "collection_name"
          const {name} = req.params;
          const result = await getCollection(name).find({}).toArray();
          res.send(result);
      })


      app.patch('/collections/:name/:id', async (req,res)=> { // update a document data by "id" of a collection by "collection_name"
          const {name, id} = req.params;



          res.send({name,id})
      })


    // ----------------------------------

  } finally {}
}
run().catch(console.dir);


app.get('/api',async (req,res)=> {
    res.send('Server is running');
})

app.listen(port,()=> {
  console.log(`Server is running in the port : ${port}`);
})