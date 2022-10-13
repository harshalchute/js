const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, memberService } = require('../services');
const Member = require('../models/member.model');
const transporter = require('../utils/email');
const account = require('../models/account.model');
const Token = require('../models/token.model');


const auth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      // let token1;
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decode.userId);
      const TokenCheck = await User.findById(decode.userId);
      console.log("TokenCheck.length", TokenCheck.tokens)
      if (!user) {
        return res.json({ success: false, message: 'unauthorized access!' });
      } if (user.tokens[0] === undefined) {
        return res.json({ success: false, message: 'Please Login again' });
      }
      for (let i = 0; i < TokenCheck.tokens.length; i++) {
        const token1 = TokenCheck.tokens[i].token
        if (token1 === token) {
          req.userData = user
          next();
        } else {
          return res.json({ success: false, message: 'unauthorized access!. Please Login again' });
        }
      }




    } catch (error) {
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


const register = catchAsync(async (req, res) => {
  const user1 = await User.findOne({ email: req.body.email }).exec();

  if (user1) {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Email is already registered' });
  }

  const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  const payload = {
    userId: user._id,
    role: user.role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES });
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS })
  const refreshToken = new Token({
    user: user._id,
    refresh: refresh
  });
  refreshToken.save()
  const resetPasswordUrl = `${process.env.host}/v1/admin/verifyEmail?token=${token}`;
  const info = transporter.transporter
    .sendMail({
      from: process.env.SENDGRID_EMAIL, // sender address
      to: req.body.email, // list of receivers
      subject: 'Verify Email ✔', // Subject line
      text: `Dear user,
      To Verify Email, click on this link: ${resetPasswordUrl}`,
    })
    .then((data) => {
      console.log('Mail sent', data);
    })
    .catch((err) => {
      console.error('Failure', err);
    });
  // res.status(httpStatus.CREATED).send({ user, tokens });
  res.status(httpStatus.OK).send({ success: true, message: 'register successfully', detail: { member: { user, token: { token, refreshToken } } } });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user1 = await User.findOne({ email }).exec();
  if (!user1) return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'User does not exists' });
  // Step 2 - Ensure the account has been verified
  if (!user1.isEmailVerified) return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Please Verify Your Email' });
  if (!user1.isAdminApproved) return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Please wait for Approved from Admin' });

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  // const tokens = await tokenService.generateAuthTokens(user);
  const payload = {
    userId: user._id,
    auth: user.auth,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES })

  let oldTokens = user.tokens || []
  if (oldTokens.length) {
    oldTokens = oldTokens.filter(t => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000
      if (timeDiff < 86400) {
        return t
      }
    })
  }


  var user_id = user._id
  if (oldTokens[0]) {

    await User.updateOne({ _id: user_id }, { $set: { "tokens.0.token": token } })
    const finalToken = await User.find({ _id: user_id }).exec()
    const updateToken = finalToken[0].tokens[0]
    // Member.findByIdAndUpdate(user_id, {tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]})
    const refresh = jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS })
    const refreshToken = new Token({
      user: user._id,
      refresh: refresh
    });
    refreshToken.save()
    return res.status(httpStatus.OK).send({ success: true, message: 'Login Successfull', detail: { member: { user, token: { updateToken, refreshToken } } } })

  } else {
    console.log("else")
    await User.findByIdAndUpdate(user_id, { tokens: [...oldTokens, { token, signedAt: Date.now().toString() }] })
    const refresh = jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS })
    const refreshToken = new Token({
      user: user._id,
      refresh: refresh
    });
    refreshToken.save()
    return res.status(httpStatus.OK).send({ success: true, message: 'Login Successfull', detail: { member: { user, token: { token, refreshToken } } } })
  }

  // res.send({ user, tokens });
  // res.status(httpStatus.OK).send({ success: true, message: 'Login successfully', detail: {Admin: {user, token: {token, refreshToken}}}});
});

const addNew = catchAsync(async (req, res) => {
  const user1 = await Member.findOne({ email: req.body.email }).exec();
  if (!user1) {
    const user = new Member({
      adminId: req.user._id,
      name: req.body.name,
      email: req.body.email,
      password: '',
      access: req.body.access,
    });
    user.save();
    const tokens = await tokenService.generateAuthTokens(user);
    const payload = {
      userId: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES });
    const resetPasswordUrl = `${process.env.host}/v1/member/verifyEmail?token=${token}`;
    const info = transporter.transporter
      .sendMail({
        from: process.env.SENDGRID_EMAIL, // sender address
        to: req.body.email, // list of receivers
        subject: 'Verify Email ✔', // Subject line
        text: `Dear user,
    To Verify Email, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email.`,
      })
      .then((data) => {
        console.log('Mail sent', data);
      })
      .catch((err) => {
        console.error('Failure', err);
      });
    // res.status(httpStatus.CREATED).send({ user, tokens });
    res.status(httpStatus.OK).send({ success: true, message: 'member add successfully', detail: { user, tokens } });
  } else {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Email Already Exists' });
  }
});

/*
const addMember = catchAsync(async (req, res) => {
      const user = new Member({
        adminId: req.user._id,
        name: req.body.name,
        email: req.body.email,
        password: "",
      });
       user.save()
      .then((_) =>{
        res.json({success: true, message: 'Registration successful', Member: user})
      })
      .catch((err) => {
        if (err.code === 11000){
          return res.json({success: false, message:"email already exists!"})
        }else {
        res.json({success: false, message:err})
        }
        });
        const payload = {
          userId : user._id,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3000s'})
      const resetPasswordUrl = `${process.env.host}/v1/member/verifyEmail?token=`+token;
        let info = transporter.transporter.sendMail({
          from: process.env.SENDGRID_EMAIL, // sender address
          to: user.email, // list of receivers
          subject: "Reset Password ✔", // Subject line
          text : `Dear user,
        To reset your password, click on this link: ${resetPasswordUrl}
        If you did not request any password resets, then ignore this email.`
        }).then((data)=>{console.log('Mail sent', data)})
        .catch(err => {console.error('Failure',err)})
})
*/

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(req.params.token);

  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'A token is required for authentication' });
  }
  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId, (err, tokenverify) => {
      if (!tokenverify)
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ success: false, message: 'Unable To Find tokenverify With This Id' });

      tokenverify.isEmailVerified = true;
      tokenverify
        .save()
        .then((emp) => {
          return res.status(httpStatus.OK).send({ success: true, message: 'email verified', admin: tokenverify });
        })
        .catch((err) => {
          return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Unable To Verify Email!' });
        });
    });
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).send(err);
  }
};

const memberCheck = async (req, res, next) => {
  // const userId = req.userData.userId;
  console.log("req.user", req.userData)
  const adminCheck = req.userData._id;
  console.log('adminCheck', adminCheck);
  if (!adminCheck) {

  }
  try {
    const Membercheck = await Member.find({ adminId: adminCheck }).exec();
    // return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Check the id again or admin not found' });
    console.log('checkmember', Membercheck[0]);
    if (Membercheck[0]) {
      const memberDetails = []
      Membercheck.map((e) => {
        memberDetails.push(e)
      })
      return res.status(httpStatus.OK).send({ success: true, message: 'Member Details', memberDetails: memberDetails })
    }
    else {
      return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'No Member Found!!' });
    }
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).send(err);
  }
};

const verifyApi = catchAsync(async (req, res) => {
  const apiKey = req.headers.apikey;
  const user1 = await User.findOne({ apiKey }).exec();
  console.log(user1);
  if (!user1) {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Api is Not Found' });
  }
  // Step 2 - Ensure the account has been verified
  if (user1.apiKey === apiKey) {
    return res.status(httpStatus.OK).send({ success: true, message: 'Successfully api verified' });
  }
});

const getAllDetails = catchAsync(async (req, res) => {
  const id = req.userData._id;
  // const userId = req.userData.userId;

  User.findById(id, function (err, alldetail) {
    res.json(alldetail);
  });
});

const logoutCheck = catchAsync(async (req, res) => {
  const user2 = req;
  console.log(user2);

  const check1 = req.headers.authorization.split(' ')[1];
  const check3 = req.headers.authorization.split(' ')[1];
  const replace = check1.replace(check3, undefined);
  console.log('replace', replace);
  console.log(req.headers.authorization);
  const user1 = await Token.findOne({ user: req.user._id }).exec();
  if (replace) {
    console.log('expire', check1);

    res.send('logout');
  } else {
    res.send('none');
  }
});

const logout = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    console.log("token", token)
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization fails!' })
    }
    console.log("req.userData", req.userData)
    const tokens = req.userData.tokens;
    console.log("req.userData.tokens", req.userData.tokens)
    const newTokens = tokens.filter(t => t.token !== token)
    await User.findByIdAndUpdate(req.userData._id, { tokens: newTokens })
    res.json({ success: true, message: 'Sign out successfully' })
  }
};

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyToken,
  // addMember,
  memberCheck,
  verifyApi,
  addNew,
  getAllDetails,
  logoutCheck,
  auth,
};
