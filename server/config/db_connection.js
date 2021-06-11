const mg = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: '../../.env'});

const url = process.env.MONGO_HOST + process.env.DB_NAME;

async function connect(){
    try {
        await mg.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Database sucessfully connected');
    } catch(err){
        console.log('Database failure connected');
    }
}

module.exports = { connect };