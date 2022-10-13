const express = require('express');
const validate = require('../../../middlewares/validate');
const masterValidation = require('../../../validations/master.validation');
const cashinflow = require('../../../controllers/cashinflow/cashinflow.controller');
const auth = require('../../../controllers/auth.controller');
// const { accessAuthRead, accessAuthWrite, accessAuthOwner } = require('../../controllers/access.controller');
const router = express.Router();

router.get('/cash', auth.auth, cashinflow.getaccount);
// router.get('/getaccountTransactional', auth.auth, transactionalController.getaccount);


module.exports = router;
