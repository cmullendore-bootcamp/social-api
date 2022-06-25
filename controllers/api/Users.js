const router = require('express').Router();
const User = require("../../models/User");
const Thought = require("../../models/Thought");
const { response } = require('express');

router.get('/', async (req, res) => {
  await User.find({})
    .then(users => {
      if (!users) {
        res.status(404).json({ message: 'No users found' });
        return;
      }
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get('/:id', async (req, res) => {
  User.findById(req.params.id)
  .populate({
    path: 'thoughts',
    populate: {
      path: "reactions"
    }
  })
  .populate({
    path: 'friends'
  })
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'No users found' });
        return;
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  User.create(req.body)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      if (err.code === 11000) {
        res.status(400).json({message: "Duplicate email address"});
        return;
      }
      res.status(500).json(err);
    });
});

router.put('/:id', async (req, res) => {
  await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'No user found' });
        return;
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


router.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).exec();

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  Thought.deleteMany({
    _id: {
      $in: user.thoughts
    }
  }, (err, result) => {
    if (err) {
      res.json(err);
      return;
    }
  });

  User.findByIdAndDelete(user._id, (err, result) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json({message: "User deleted"});
  });
});

router.post('/:userId/friends/', async (req, res) => {

  await User.findByIdAndUpdate(req.params.userId, { $push: { friends: req.body.userId } }, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;