const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()

router.post(
    '/register',
    [
        check('username', 'Incorrect username'),
        check('password', 'Minimum required length is 6 symbols').isLength({ min: 6 })
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data'
            })
        }

        const {username, password} = req.body
        const userExists = await User.findOne({ username })
        if (userExists){
            return res.status(400).json({ message: 'This username is already taken' })
        }
        const hashPass = await bcrypt.hash(password, 12)
        const user = new User({ username, password: hashPass })

        await user.save()
        res.status(201).json({ message: 'User created. Welcome!' })

    } catch(e){
        res.status(500).json({ message: 'Oops! Something went wrong. Please, try again later' })
    }
})

router.post(
    '/login',
    [
        check('username', 'Please, enter correct username'),
        check('password', 'Please, enter your password').exists()
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data in system entry'
            })
    }

    const {username, password} = req.body
    const userExists = await User.findOne({ username })
    if (!userExists){
        return res.status(400).json({ message: 'User not found' })
    }
        
    const match = await bcrypt.compare(password, userExists.password)
    if (!match){
        return res.status(400).json({ message: 'Wrong password. Please, try again.' })
    }

    const token = jwt.sign(
        { userId: userExists.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
    )

    res.json({ token, userId: userExists.id })

    } catch(e){
        res.status(500).json({ message: 'Oops! Something went wrong. Please, try again later' })
    }
})

module.exports = router