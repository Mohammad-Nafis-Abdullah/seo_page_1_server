const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const multer = require('multer');
const cors = require('cors');


const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());
app.use(cors({origin:true,credentials:true}));

// configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

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
    // -------------------------------------------------------------------

    // api endpoints
    // ----------------------------------
      app.get('/collections/:name',async (req,res)=> { // get all document of a collection by "collection_name"
          const {name} = req.params;
          const result = await getCollection(name).find({}).toArray();
          res.send(result);
      })


      app.patch('/collections/:name/:id', upload.array('files'), async (req,res)=> { // update a document data by "id" of a collection by "collection_name"
          const {name, id} = req.params;
          try {
            const uploadFiles = req.files;
            const uploadPromises = uploadFiles.map(async (file)=> {
                const {originalname,buffer} = file;
                try {
                  const result = await getCollection('files').insertOne({
                    name: originalname,
                    data: buffer,
                  });
                  return result;
                } catch (err) {
                  console.log(err);
                }
            });

            const uploadResults = await Promise.all(uploadPromises);
            
            // record uploaded data into the document's attachment property
            const {attachment} = await getCollection(name).findOne({_id: new ObjectId(id)});
            const updated_attachment = [...attachment,...uploadResults];
            const result = await getCollection(name).updateOne({_id: new ObjectId(id)},{$set:{attachment:updated_attachment}});

            res.send(result);

          } catch (err) {
            console.log(err);
          }
      })


    // ----------------------------------

  } finally {}
}
run().catch(console.dir);

// home route
app.get('/',async (req,res)=> {
    res.send('Server is running');
})

// server listening
app.listen(port,()=> {
  console.log(`Server is running in the port : ${port}`);
})