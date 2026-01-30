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

// Função para criar rotas CRUD para uma coleção
const createCrudRoutes = (collectionName) => {
  // Create
  app.post(`/${collectionName}`, async (req, res) => {
    try {
      const data = req.body;
      const docRef = await db.collection(collectionName).add(data);
      res.status(201).send({ id: docRef.id });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  // Read
  app.get(`/${collectionName}`, async (req, res) => {
    try {
      const snapshot = await db.collection(collectionName).get();
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).send(items);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  // Update
  app.put(`/${collectionName}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await db.collection(collectionName).doc(id).update(data);
      res.status(200).send({ id });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  // Delete
  app.delete(`/${collectionName}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection(collectionName).doc(id).delete();
      res.status(200).send({ id });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
};

// Criar rotas CRUD para cada coleção
createCrudRoutes('event_location');
createCrudRoutes('duvidas');
createCrudRoutes('eventos');
createCrudRoutes('lista_geral');
createCrudRoutes('users');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});