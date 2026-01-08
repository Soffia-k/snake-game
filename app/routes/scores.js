const {Router} = require('express')
const Score = require('../models/score')
const User = require('../models/user')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const { points } = req.body;
        
        const score = new Score({
            points: points,
            player: req.user.userId
        })
        
        await score.save();
        
        const user = await User.findById(req.user.userId)
        if (user) {
            user.scores.push(score._id)
            await user.save()
        }
        

        res.status(201).json({
            message: 'Score saved successfully',
            score: {
                _id: score._id,
                points: score.points,
                date: score.date,
                player: score.player
            }
        })
        
    } catch (e) {
        console.error('Save score error:', e)
        res.status(500).json({ 
            message: 'Oops! Something went wrong. Please, try again later' 
        })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const scores = await Score.find({ player: req.user.userId })
            .sort({ date: -1 })
        
        res.json(scores)
    } catch (e) {
        console.error('Get scores error:', e)
        res.status(500).json({ 
            message: 'Oops! Something went wrong. Please, try again later' 
        });
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const score = await Score.findById(req.params.id);
        
        if (!score) {
            return res.status(404).json({ message: 'Score not found' })
        }
        
        if (score.player.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' })
        }
        
        res.json(score)
    } catch (e) {
        console.error('Get score by ID error:', e)
        res.status(500).json({ 
            message: 'Oops! Something went wrong. Please, try again later' 
        })
    }
})

module.exports = router