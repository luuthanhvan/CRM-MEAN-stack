const contactsRouter = require('./contacts');
const salesOrderRouter = require('./sales_order');
const userRouter = require('./user');

function route(app){
    app.use('/contacts', contactsRouter);
    app.use('/sales_order', salesOrderRouter);
    app.use('/user_management', userRouter);
}

module.exports = route;