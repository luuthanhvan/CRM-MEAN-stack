const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/ContactsController');

router.post('/store', contactsController.store);
router.post('/delete', contactsController.destroy);
router.get('/', contactsController.index);

module.exports = router;