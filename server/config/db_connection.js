const mg = require('mongoose');
const url = 'mongodb://localhost:27017/CRM_DB';

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