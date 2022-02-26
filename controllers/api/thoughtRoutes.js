const router = require('express').Router();
const { User, Thought } = require('../../models');

//Routes for getting, posting, editing, and deleting thoughts
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
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(thought);        
        })
        .catch((err) => res.status(500).json(err));
})

router.post('/', (req, res) => {
    Thought.create(
        {
            thoughtText: req.body.thoughtText,
            username: req.body.username
        }
    )        
        .then(newThought => { 
            return User.findByIdAndUpdate(
                req.body.userId,
                { $push: { thoughts: newThought._id}},
                {new: true}
            )
        })
        .then(updatedUser => {
            !updatedUser
            ? res
                .status(404)
                .json({ message: 'Thought created, but found no user with that ID' })
            : res.json('Created the thought 🎉');
        })
        .catch((err) => res.status(500).json(err));
})

router.put('/:thoughtId', (req, res) => {
    Thought.findByIdAndUpdate(        
        req.params.thoughtId, 
        { 
            thoughtText: req.body.thoughtText, 
            username: req.body.username
        }, 
        {new: true}
    )
        .then(updatedThought => {
            !updatedThought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(updatedThought);  
        })
        .catch((err) => res.status(500).json(err));
});

router.delete('/:thoughtId', (req, res) => {
    Thought.findByIdAndDelete(req.params.thoughtId)
        .then(deletedThought => { 
            if (!deletedThought) {
                res.status(404).json({message: 'No thought with that ID'})
            } 
            else {
                User.findOneAndUpdate(
                    { username: deletedThought.username},
                    { $pull: { thoughts: deletedThought._id}},
                    {new: true}
                )
                .then(updatedUser => {
                    !updatedUser
                    ? res.status(404).json({ message: 'Thought was deleted, but no user was associated with the deleted thought' })
                    : res.json(updatedUser);  
                })
            }

        })
        .catch((err) => res.status(500).json(err));
})

//Routes for posting and deleting rections
router.post('/:thoughtId/reactions', (req, res) => {
    Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body }},
        { runValidators: true, new: true}
    )
        .then((thought) => {
            !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
        })
        .catch((err) => res.status(500).json(err));
});

router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
    Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId}}},
        { runValidators: true, new: true }
    )
        .then((thought) => {
            !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
        })
        .catch((err) => res.status(500).json(err));
})

module.exports = router;