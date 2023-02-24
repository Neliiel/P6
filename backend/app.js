const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://Neliiel:Tonic0690@cluster0.uiohzjr.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/api/sauces', (req, res, next) => {
  const sauces = [
    {
      userId: {String},
      name: {String},
      manufacturer: {String},
      description: {String},
      mainPepper: {String},
      imageUrl: {String},
      heat: {Number},
      likes: {Number},
      dislikes: {Number},
      //usersLiked: {String},
      //usersDisliked: {String}
    },
  ];
  res.status(200).json(sauces);
})

app.use('/api/auth', userRoutes);



module.exports = app;

