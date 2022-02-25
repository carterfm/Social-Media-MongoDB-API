const router = require('express').Router();
const { User, Thought } = require('../../models');

//Routes for viewing, creating, updating, and deleting users
router.get('/', (req, res) => {
    User.find()
        .select('-__v')
        .then(users => res.json(users))
        .catch((err) => res.status(500).json(err));
});

router.get('/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .then((user) => {
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(user);        
        })
        .catch((err) => res.status(500).json(err));
});

router.post('/', (req, res) => {
    User.create(req.body)
        .then(newUser => res.json(newUser))
        .catch((err) => res.status(500).json(err));
});

router.put('/:userId', (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId, 
        { username: req.body.username, email: req.body.email}, 
        {new: true}
    )
        .then(updatedUser => {
            !updatedUser
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(updatedUser);  
        })
        .catch((err) => res.status(500).json(err));
});

router.delete('/:userId', (req, res) => {
    User.findByIdAndDelete(req.params.userId)
        .then(deletedUser => {
            !deletedUser
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(deletedUser);  
        })
        .catch((err) => res.status(500).json(err));
});

//Routes for adding and deleting friends
// TODO: ask: should this be a two-way thing (i.e., if a adds b as a friend, b gets a as a friend as well?)
router.post('/:userId/friends/:friendId', (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId,
        { $push: { friends: req.params.friendId }}, 
        {new: true}
    )
    .then(updatedUser => {
        !updatedUser
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(updatedUser);  
    })
    .catch((err) => res.status(500).json(err));
});

router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId }}, 
        {new: true}
    )
    .then(updatedUser => {
        !updatedUser
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(updatedUser);  
    })
    .catch((err) => res.status(500).json(err));
});


module.exports = router;