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
  configFirebase()
  try {     
    
    const jsonString = req.body.jsonString
    const db = getFirestore() 
    // const querySnapshot = await db.collection('designs').where('email', "==", email).get()
    // const emailData = querySnapshot.docs.map(doc => {
    //     return {
    //         uuid: doc.id,
    //         ...doc.data()
    //     }
    // })

    // if(emailData.length === 0) {
    const jsonAddedRes = await db.collection('designs').add({ 
      jsonString
    })
    res.status(201)
    res.json(jsonAddedRes)
    // } else {
    //   throw new Error({ exists: true })
    // }
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

const designRoutes = (app) => {
  app.post('/designs', saveJSONCanvas)
  // app.get('/designs/:id', getJSONCanvas)
}

module.exports = designRoutes






