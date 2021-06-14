const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/ContactsController');

router.post('/', contactsController.contactsStore); // store a contact
router.get('/', contactsController.contactsList); // get list of contacts
router.get('/:id', contactsController.contactsDetail); // get a contact
router.put('/:id', contactsController.contactsUpdate); // update a contact
router.delete('/:id', contactsController.contactsDelete); // delete a contact

module.exports = router;