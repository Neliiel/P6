const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://Neliiel:Tonic0690@cluster0.uiohzjr.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    console.log('Requête reçue');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !'});
    next();
});

app.use((req, res, next) => {
    console.log('Réponse envoyé avec succès !');
    next();
});



module.exports = app;

