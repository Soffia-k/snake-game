const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    points: {type: Number, required: true, default: null},
    date: {type: Date, default: Date.now},
    player: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Score', schema)