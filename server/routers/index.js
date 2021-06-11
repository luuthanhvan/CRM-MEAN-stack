const contactsRouter = require('./contacts');
const salesOrderRouter = require('./sales_order');

function route(app){
    app.use('/contacts', contactsRouter);
    app.use('/sales_order', salesOrderRouter);
}

module.exports = route;