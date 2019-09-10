let mongoose = require ('mongoose');

let developersSchema = mongoose.Schema({
    name: {
        firstName: {type: String, required: true},
        lastName: String
    }, 
    level: {type: String, required: true, validate: {
        validator: function (levelValue) {
            return levelValue === 'BEGINNER' || levelValue === 'EXPERT';
        },
        message: 'level should be either BEGINNER or EXPERT'
    }
},
    address: { 
        state: String,
        suburb: String,
        street: String,
        unit: Number
    },
});

let developersModel = mongoose.model('Developers', developersSchema)
module.exports = developersModel;
