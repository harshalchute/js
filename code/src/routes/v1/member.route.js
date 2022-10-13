const express = require('express');

const memberController = require('../../controllers/member.controller');
// const auth = require('../../middlewares/auth');
const { accessAuthRead, accessAuthWrite, accessAuthOwner } = require('../../controllers/access.controller');
const router = express.Router();

router.get('/verifyEmail', memberController.verifyEmail);
router.post('/setPassword', memberController.setPassword);
router.post('/login', memberController.login);
// router.get('/test', memberController.auth, memberController.test);
router.get('/getUser', memberController.auth, memberController.getUser);
router.post('/token', memberController.auth, memberController.tokenRefresh);
router.get('/getAll1', memberController.auth, accessAuthRead,  memberController.adminAll);
router.post('/getAll2', memberController.auth, accessAuthWrite, memberController.adminAll);
router.post('/logout', memberController.auth, memberController.logout)
router.get('/test', memberController.auth, memberController.test)
// router.post('/logout-test', memberController.auth, memberController.logoutTest)

// router.post('/refreshMeaccessAuthRead,mber', auth(), memberController.refreshMember);

// router.post('/logins', authController.logins);
// router.post('/signup', authController.signup);

module.exports = router;

