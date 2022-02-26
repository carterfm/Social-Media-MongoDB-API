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
        { 
            username: req.body.username, 
            email: req.body.email
        }, 
        //Setting new to false because we're going to go through thoughts and updated all the thoughts associated with the old username so they have the new username instead
        {new: false}
    )
        .then(updatedUser => {
            if(!updatedUser) {
                res.status(404).json({ message: 'No user with that ID' })
            }
            else {
                Thought.updateMany(
                    { username: updatedUser.username},
                    { username: req.body.username }
                )
                    .then(updatedThoughts => res.json(updatedThoughts))
                    .catch((err) => res.status(500).json(err));
            }
        })
        .catch((err) => res.status(500).json(err));
});

router.delete('/:userId', (req, res) => {
    User.findByIdAndDelete(req.params.userId)
        .then(deletedUser => {
            //Deleting thoughts associated with the user as well if the user exists -- using username field in Thought model to achieve this
            if (!deletedUser) {
                res.status(404).json({ message: 'No user with that ID' });
            } else {
                Thought.deleteMany({username: deletedUser.username})
                    .then(deletedThoughts => res.json(deletedThoughts))
                    .catch((err) => res.status(500).json(err));
            }
        })
        .catch((err) => res.status(500).json(err));
});

//Routes for adding and deleting friends
// TODO: ask: should this be a two-way thing (i.e., if a adds b as a friend, b gets a as a friend as well?)
router.post('/:userId/friends/:friendId', (req, res) => {
    //Only adding a friend if the friend is actually a user that exists in our database
    User.findOne({ _id: req.params.friendId })
        .then(friendtoAdd => {
            if (!friendtoAdd) {
                res.status(404).json({ message: 'No user with the given friend ID' });
            } else {
                User.findByIdAndUpdate(
                    req.params.userId,
                    { $addToSet: { friends: req.params.friendId }}, 
                    { runValidators: true, new: true}
                )
                .then(updatedUser => {
                    !updatedUser
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(updatedUser);  
                })
                .catch((err) => res.status(500).json(err));
            }
        })
        .catch((err) => res.status(500).json(err));
});

router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId }}, 
        { runValidators: true, new: true}
    )
    .then(updatedUser => {
        !updatedUser
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(updatedUser);  
    })
    .catch((err) => res.status(500).json(err));
});


module.exports = router;