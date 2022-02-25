const router = require('express').Router();
const { User, Thought } = require('../../models');


router.get('/', (req, res) => {
    Thought.find()
        .select('-__v')
        .then(thoughts => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
});

router.get('/:thoughtId', (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) => {
            !thought
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(thought);        
        })
        .catch((err) => res.status(500).json(err));
})

// router.post('/', (req, res) => {
//     Thought.create()        
//         .then(newThought => res.json(newUser))
//         .catch((err) => res.status(500).json(err));
// })

module.exports = router;