const router = require('express').Router();
const Thought = require("../../models/Thought");
const Reaction = require("../../models/Reaction");
const User = require("../../models/User");

router.get('/', async (req, res) => {
    await Thought.find({})
        .then(thoughts => {
            if (!thoughts) {
                res.status(404).json({ message: 'No thoughts found' });
                return;
            }
            res.json(thoughts);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/:id', async (req, res) => {
    Thought.findById(req.params.id)
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found' });
                return;
            }
            res.json(thought);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/', async (req, res) => {
    Thought.create(req.body)
        .then(async thought => {
            await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } }, { new: true });
            res.json(thought);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.put('/:id', async (req, res) => {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found' });
                return;
            }
            res.json(thought);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


router.delete('/:id', async (req, res) => {
    Thought.findByIdAndDelete(req.params.id)
        .then(async thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found' });
                return;
            }
            await User.findOneAndUpdate({ username: thought.username }, { $pull: { thoughts: thought._id } }, { new: true });
            res.json({message: "Thought deleted."});
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/:thoughtId/reactions/', async (req, res) => {
    //Thought.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: req.body.json } }, { new: true })
    Reaction.create(req.body)
        .then(({ _id }) => {
            Thought.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: _id } }, { new: true })
                .then(thought => {
                    if (!thought) {
                        res.status(404).json({ message: 'Thought not found' });
                        return;
                    }
                    res.json(thought);
                });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    const reaction = await Reaction.findOne({ reactionId: req.params.reactionId }).exec();

    Thought.findByIdAndUpdate(
        req.params.thoughtId, 
        { $pull: { reactions: reaction._id } },
        { runValidators: true, new: true, remove: true },
        (err, doc) => {
            if (err) {
                res.json(err);
                return;
            }
            res.json(doc);
            return;
        } );
});

module.exports = router;