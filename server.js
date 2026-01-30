const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// CRUD operations
// Create
// Read
app.get('/duvidas', async (req, res) => {
  try {
    const snapshot = await db.collection('duvidas').get();
    const duvidas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(duvidas);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Read
app.get('/items', async (req, res) => {
  try {
    const snapshot = await db.collection('items').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update
app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection('items').doc(id).update(data);
    res.status(200).send({ id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('items').doc(id).delete();
    res.status(200).send({ id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});