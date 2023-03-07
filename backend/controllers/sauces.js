const Sauce = require('../models/Sauce');
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/$(req.file.filename)`
    });

    sauce.save()
    .then(() => {res.status(201).json({ message: 'Objet enregistré !'})})
    .catch(error => {res.status(400).json({ error })})
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/$(req.file.filename)`
    } : {...req.body};

    Sauce.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non-autorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message : 'Objet modifié!'}))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => {res.status(400).json({ error });
    });
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(thing => {
        if(thing.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non-autorisé'});
        } else {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé!'}))
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

// Appel d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

// Appel de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};

// Mise en place du like/dislike
exports.likeSauce = (req, res, next) => {
    // L'utilisateur like la sauce
    if(like===1) {
        Sauce.updateOne(
            {_id: req.params.id},
            {
                $inc: {likes: req.body.like},
                $push: {usersLiked: req.body.userId},
            }
        )

        .then(thing => res.status(200).json({ massage : 'Sauce LIKE'}))
        .catch(error => res.status(500).json({ error }));
    }

    // L'utilisateur dislike la sauce
    else if(like===-1){
        Sauce.updateOne(
            {_id: req.params.id},
            {
                $inc: { dislikes: -1},
                $push: {usersDisliked: req.body.userId},
            }
        )
        .then(thing => res.status(200).json({ massage : 'Sauce DISLIKE'}))
        .catch(error => res.status(500).json({ error }));
    }
};