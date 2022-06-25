const router = require('express').Router();
const User = require("../../models/User");

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
  await User.findById(req.params.id)
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
  await User.findOneAndDelete({ _id: req.params.id })
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