const contactsRouter = require('./contacts');

function route(app){
    app.use('/contacts', contactsRouter);
}

module.exports = route;