const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/ContactsController');

router.post('/store', contactsController.store);
router.post('/delete', contactsController.destroy);
router.post('/edit', contactsController.edit);
router.post('/update', contactsController.update);
router.get('/', contactsController.index);

module.exports = router;