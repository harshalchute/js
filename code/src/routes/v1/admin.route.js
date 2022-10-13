const express = require('express');
const authController = require('../../controllers/admin.controller');
const User = require('../../models/superadmin.model');
const customer = require('../../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const superToken = require('../../models/superToken.model')
const httpStatus = require('http-status');

const auth  = async (req, res, next) => {
  if(req.headers && req.headers.authorization){
    const token = req.headers.authorization.split(' ')[1];

  try {
    // let token1;
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decode.userId);
    const TokenCheck = await User.findById(decode.userId);
    console.log("TokenCheck.length",TokenCheck.tokens)
    if (!user) {
      return res.json({ success: false, message: 'unauthorized access!' });
    }if (user.tokens[0] === undefined){
      return res.json({ success: false, message: 'Please Login again' });
    }
    for (let i = 0; i < TokenCheck.tokens.length; i++){
      const token1 = TokenCheck.tokens[i].token
      if (token1 === token){
        req.userData = user
        next();
      }else {
        return res.json({ success: false, message: 'unauthorized access!. Please Login again' });
      }
    }




  }catch(error){
    if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: 'unauthorized access!' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.json({
        success: false,
        message: 'sesson expired try sign in!',
      });
    }

    res.json({ success: false, message: 'Internal server error!' });
  }
}
else {
  res.json({ success: false, message: 'unauthorized access!' });
}
  }

const router = express.Router();
router.get('/', function (req, res) {
  res.send('superadmin');
})


router.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({success: false, message:'hasing issue'})
    }else {
      console.log(hash)
      const user = new User({
        name: req.body.name,
        companyName: req.body.companyName,
        email: req.body.email,
        password: req.body.password,
      });
       user.save()
      .then((_) =>{
        res.json({success: true, message: 'Registration successful'})
      })
      .catch((err) => {
        if (err.code === 11000){
          return res.status(httpStatus.BAD_REQUEST).send({success: false, message:"email already exists!"})
        }else {
        res.status(httpStatus.BAD_REQUEST).send({success: false, message:err})
        }
        });

      console.log(req.body.name);
    }
  })



})

router.post('/login', (req, res) =>{
  User.find({email: req.body.email}).exec()
  .then((result) =>{
if (result.length < 1){
  return res.status(httpStatus.BAD_REQUEST).send({success: false, message: 'User not found'})

}
const user = result[0];
console.log(user);
bcrypt.compare(req.body.password, user.password, async(err, result) =>{
  console.log(result);
  if(result) {
    const payload = {
      userId : user._id,
      auth: user.auth,
      verify: user.isverify
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES})

let oldTokens = user.tokens || []

if (oldTokens.length){
  oldTokens = oldTokens.filter(t => {
    const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000
    if(timeDiff < 86400){
      return t
    }
  })
}

var user_id = user._id
if(oldTokens[0]){

 await User.updateOne({_id: user_id}, {$set: {"tokens.0.token": token}})
 const finalToken = await User.find({_id: user_id}).exec()
 const updateToken = finalToken[0].tokens[0]
 // Member.findByIdAndUpdate(user_id, {tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]})
 const refresh = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS})
 const refreshToken = new superToken({
   user : user._id,
   refresh: refresh
 });
 refreshToken.save()
    return res.status(httpStatus.OK).send({success: true,  message:'Login Successfull', detail: {member: {user, token: {updateToken, refreshToken}}}})

}else{
  console.log("eklse")
  await User.findByIdAndUpdate(user_id, {tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]})
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS})
      const refreshToken = new superToken({
        user : user._id,
        refresh: refresh
      });
      refreshToken.save()
  return res.status(httpStatus.OK).send({success: true,  message:'Login Successfull', detail: {member: {user, token: {token, refreshToken}}}})
}
  }else {
    return res.status(httpStatus.BAD_REQUEST).send({success: false, message:'Password do not match'})
  }
})
  }).catch(err => {
    res.status(httpStatus.BAD_REQUEST).send({success: false, message: 'authentication failed'})
  })

})

router.post('/refreshToken', authController.tokenRefresh)
router.post('/logout', auth, authController.logout)



router.get('/view/:id', (req, res) => {
  let id = req.params.id;
  // const userId = req.userData.userId;

  customer.findById(id, function (err, viewid) {
  res.json(viewid);
  });
})


router.post('/update/:id',auth, (req, res, next) => {

  try {
User.findById(req.userData._id, (err, result) => {
  console.log("result", req.userData)
  if(!result) {
    res.status(httpStatus.BAD_REQUEST).send({success: false, message: 'you are not allowed here'})
  }else{
    if(result.role === "superadmin"){

      customer.findById(req.params.id,  (err, updateid) => {
        if (!updateid)
        return next(new Error('Unable To Find admin With This Id'));
        else {
          if(updateid.isAdminApproved === false){
            updateid.isAdminApproved = req.body.isAdminApproved;

            updateid.save().then(emp => {
            return res.json({success: true, message: 'Admin successfully approved', admin: updateid});
            })
            .catch(err => {
            return res.status(httpStatus.BAD_REQUEST).send("Unable To Update admin");
            });
          }
          else {
            return res.json({success: true, message: "admin already Approved"})
          }

        }

        });

    }
    else{
      res.status(httpStatus.BAD_REQUEST).send({success: false, message:"you are not allowed "})
    }
  }

})
  }catch (err) {
res.status(httpStatus.BAD_REQUEST).send({success: false, message: "somemthing went wrong"})
  }




})





// router.post('/logins', authController.logins);
// router.post('/signup', authController.signup);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: verify email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 */
