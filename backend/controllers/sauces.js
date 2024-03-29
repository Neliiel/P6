const Sauce = require('../models/Sauce');
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
    .then(() => {res.status(201).json({ message: 'Sauce enregistré !'})})
    .catch(error => {res.status(400).json({ error })})
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
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
    .then(sauce => {
        if(sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non-autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
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
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Appel de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Mise en place du like/dislike
exports.likeSauce = (req, res, next) => {
    
    // L'utilisateur change d'avis
    if(req.body.like === 0) {
        Sauce.findOne({ _id: req.params.id })
            .then ((sauce) => {
                // L'utilisateur annule son like
                if(sauce.usersLiked.includes(req.body.userId)) {
                    const incKey = req.body.like === 1? "likes" : "dislikes"
                    const usersKey= req.body.like === 1? "usersLiked" : "usersDisliked"

                    Sauce.updateOne (
                        {_id: req.params.id},
                        {
                            $pull: {[usersKey]: req.body.userId},
                            $inc: {[incKey]: -1}
                        }
                    )
                    .then(() => res.status(200).json({message: `Sauce ${req.body.like === 1?"LIKE":"DISLIKE"}`}))
                    .catch(error => res.status(500).json({ error }));
                }   
            })        
    } else {
        const incKey = req.body.like === 1?"likes":"dislikes"
        const usersKey = req.body.like === 1?"usersLiked":"usersDisliked"

        Sauce.updateOne(
            {_id: req.params.id},
            {
                $inc: {[incKey]: 1},
                $push: {[usersKey]: req.body.userId},
            }
        )

        .then(() => res.status(200).json({message: `Sauce ${req.body.like === 1?"LIKE":"DISLIKE"}`}))
        .catch(error => res.status(500).json({ error }));
    }
};