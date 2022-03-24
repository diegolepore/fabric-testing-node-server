const { getFirestore } = require('firebase-admin/firestore')
const { initializeApp, getApps, cert } = require('firebase-admin/app')
const dotenv = require('dotenv')
dotenv.config()

function configFirebase() {
  const apps = getApps()
  const credentials = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
  }
  
  if (!apps.length) {
    initializeApp({
      credential: cert(credentials)
    })
  }
}

async function saveJSONCanvas(req, res) {
  try {     
    
    // console.log(JSON.stringify(req.body))
    // const jsonString = req.body.jsonString
    const jsonString = JSON.stringify(req.body)
    const db = getFirestore() 
    const jsonAddedRes = await db.collection('designs').add({ 
      jsonString
    })
    res.status(201)
    res.json(jsonAddedRes)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

async function updateJSONCanvasString(req, res) {
  try {     
    const id = req.params.id
    const db = getFirestore() 
    const designRef = db.collection('designs').doc(id);
    // console.log(designRef)
    // Set the 'capital' field of the city
    const jsonString = JSON.stringify(req.body)
    const res = await designRef.update({ jsonString });
    res.status(201)
    res.json(res)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

async function getJSONCanvasString(req, res) {
  try {
    const id = req.params.id
    const db = getFirestore() 
    const designRef = await db.collection('designs').doc(id)
    // console.log(designRef)
    const doc = await designRef.get();
    if (!doc.exists) {
      res.status(404)
      res.json('No such document!')
    } else {
      // console.log('Document data:', doc.data());
      res.status(200)
      res.json(doc.data())
    }
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

const designRoutes = (app) => {
  configFirebase()
  app.post('/designs', saveJSONCanvas)
  app.get('/designs/:id', getJSONCanvasString)
  app.put('/designs/:id', updateJSONCanvasString)
}

module.exports = designRoutes






