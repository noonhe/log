const mongoose = require('mongoose');
let Schema = mongoose.Schema;
//let user = require('./user');
//let userSchema = mongoose.model('User').schema;
let articleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type : String,
        required: true,
        unique: false
    },
    articleBody:{
        type: String,
        required: true
    },
    publishDate:{
        type: Date,
        required: true
    },
    time:{
        type: Number,
        required:true
    }
});

module.exports = mongoose.model('Articles', articleSchema);