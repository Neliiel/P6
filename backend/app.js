const express = require('express');
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces')

const userRoutes = require('./routes/user');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://Neliiel:Tonic0690@cluster0.uiohzjr.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/sauces', saucesRoutes);

app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app;

