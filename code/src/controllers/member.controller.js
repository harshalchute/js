const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');
const Member = require('../models/member.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authService, userService, tokenService, emailService } = require('../services');
const moment = require('moment');
const config = require('../config/config');
const { Token } = require('../models');
const { tokenTypes } = require('../config/tokens');
const tokenList = {}
const memberToken = require('../models/Mtoken.model')
const admin = require('../models/user.model')

const auth  = async (req, res, next) => {
  if(req.headers && req.headers.authorization){
    const token = req.headers.authorization.split(' ')[1];

  try {
    // let token1;
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await Member.findById(decode.userId);
    const TokenCheck = await Member.findById(decode.userId);
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





const adminAll = (req, res, next) => {
admin.find({}, (err, alladmin) =>{
  if(!alladmin){
    res.status(httpStatus.BAD_REQUEST).send(err)
  }else{
    res.status(httpStatus.OK).send({success: true, message: "All Admin Details", admindetails: alladmin})
  }
}
)
}



const verifyEmail = (req, res, next) => {
  const token = req.query.token;


  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).send("unable to get Token. Please try again");
  }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      Member.findById(decoded.userId,  (err, emailverify) => {
        if (!emailverify)
        return next(new Error('customer doesnt exist. Please try again'));

          // emailverify.password = req.body.password;
          emailverify.isEmailVerified = true;
          emailverify.save().then(emp => {
        return res.status(httpStatus.OK).send({success: true, message: "Email Verified", member: emailverify});
        })
        .catch(err => {
        return res.status(httpStatus.BAD_REQUEST).send("Unable To Update Member");
        });


        });
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).send(err);
    }




};



const setPassword = (req, res, next) => {
  // Member.find({email: req.body.email}).exec()
  bcrypt.hash(req.body.password, 10 ,(err, hash) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({success: false, message:'hasing issue'})
    }
  Member.findOne({email: req.body.email},  (err, passwordset) => {
    // console.log(req.body.email, passwordset.password, passwordset.name, passwordset)
    if (!passwordset)
    return next(new Error('customer doesnt exist. Please try again'));

      if (!passwordset.isEmailVerified){
        return res.status(httpStatus.BAD_REQUEST).send({success: false, message: "Your Email is Not Verified"});
      }
      passwordset.password = hash;
      passwordset.save().then(emp => {
    return res.status(httpStatus.OK).send({sucess: true, message: "Password set successfully", detail: {member: passwordset}});
    })
    .catch(err => {
    return res.status(httpStatus.BAD_REQUEST).send(err);
    });


    });


});

}
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};



const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};


const login = (req, res, next) => {
  Member.find({email: req.body.email}).exec()
  .then((result) =>{
if (result.length < 1){
  return res.status(httpStatus.BAD_REQUEST).send({success: false, message: 'User not found'})

}
const user = result[0];
// console.log(user);
// const tokens = generateAuthTokens(user);
if (user.isEmailVerified === true){
  bcrypt.compare(req.body.password, user.password, async(err, result) =>{
    // console.log(result);
    if(result) {
      const payload = {
        userId : user._id,
        auth: user.auth,
        verify: user.isverify,
        name: user.name,
        email: user.email,
        role : user.role,
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
// console.log("new token",token)
// console.log("old tokens", oldTokens[0])

var user_id = user._id
if(oldTokens[0]){

 await Member.updateOne({_id: user_id}, {$set: {"tokens.0.token": token}})
 const finalToken = await Member.find({_id: user_id}).exec()
 const updateToken = finalToken[0].tokens[0]
 // Member.findByIdAndUpdate(user_id, {tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]})
    const refresh = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS})
    const refreshToken = new memberToken({
      user : user._id,
      refresh: refresh
    });
    refreshToken.save()
    return res.status(httpStatus.OK).send({success: true,  message:'Login Successfull', detail: {member: {user, token: {updateToken, refreshToken}}}})

}else{
  console.log("eklse")
  await Member.findByIdAndUpdate(user_id, {tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]})
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS})
  console.log(refresh)
  const refreshToken = new memberToken({
    user : user._id,
    refresh: refresh
  });
  refreshToken.save()
  return res.status(httpStatus.OK).send({success: true,  message:'Login Successfull', detail: {member: {user, token: {token, refreshToken}}}})
}


    //   res
    // .cookie("jwt", token, {
    //   maxAge: 3600000, httpOnly:true,
    // })



    }
      return res.status(httpStatus.BAD_REQUEST).send({success: false, message:'Password do not match'})

  })
}
else{
  res.status(httpStatus.BAD_REQUEST).send({success: false, message: "Your Email is not verified.Please Check Your Email !"})
}
  }).catch(err => {
    res.status(httpStatus.BAD_REQUEST).send({success: false, message: 'authentication failed'})
  })
}


const tokenRefresh = (req, res) => {
  memberToken.findOne({refresh: req.body.refresh},  (err, refrehtoken) => {
    if (!refrehtoken)
    return res.status(httpStatus.BAD_REQUEST).send({success: false, message: "Invalid refresh token"})

      if(req.body.refresh === refrehtoken.refresh){
        const payload = {
          userId : refrehtoken.user,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES})
        // const user2 = new memberToken({
        //   user : refrehtoken.user,
        //   refresh: re
        // });
        //  user2.save()
        return res.status(httpStatus.OK).send({success: true,  message:'refresh successfully', Member: {token}})

      }
     return res.status(httpStatus.BAD_REQUEST).send({success: false, message:"didnt match"})

  return res.status(httpStatus.BAD_REQUEST).send({success: false, message: "false error"})

  })
}

// const test = catchAsync(async (req, res) => {
//   const nameUser = req.userData.userId
//   console.log(nameUser)
//   Member.findById(nameUser,  (err, employee) => {
//     if (!employee)
//     return next(new Error('Unable To Find Employee With This Id'));
//     else {
//     employee.isEmailVerified = true;
//     employee.save().then(emp => {
//     return res.json({success: true, message: "Email Verified", employee});
//     })
//     .catch(err => {
//     return res.status(httpStatus.BAD_REQUEST).send("Unable To Update Employee");
//     });
//     }

//     });
// });



const test = async(req, res) => {
//  const cookies =  req.headers.cookie;
//   console.log("cookie", cookies);
console.log("req.userData.exp", req.userData.exp)
req.userData.exp = 1
console.log("req.userData.exp1", req.userData.exp)

  res.send("toekn check")
}

// const logout = catchAsync(async (req, res) => {
//   const refreshtoken = req.body.refreshToken;
//   const refreshTokenDoc = await memberToken.findOne({ refresh: refreshtoken, blacklisted: false });

//   if (!refreshTokenDoc) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Not found');
//   }
//   await refreshTokenDoc.remove();
//   res.status(httpStatus.NO_CONTENT).send();
// });




const logout = async (req, res) => {
 if (req.headers && req.headers.authorization){
  const token = req.headers.authorization.split(' ')[1];
  if(!token){
    return res.status(401).json({success: false, message: 'Authorization fails!'})
  }

  const tokens = req.userData.tokens;
  console.log("req.userData.tokens", req.userData.tokens)
  const newTokens = tokens.filter(t => t.token !== token)
  await Member.findByIdAndUpdate(req.userData._id, {tokens: newTokens})
  res.json({success: true, message: 'Sign out successfully'})
 }
}

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await adminService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await adminService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await adminService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyApi = catchAsync(async (req, res) => {
  const { apiKey } = req.body
  const user1 = await user1.findOne({ apiKey }).exec();
  console.log(user1)
  if (!user1) {
    return res.status(httpStatus.BAD_REQUEST).send({
          message: "not a Valid Api"
    });
}

// Step 2 - Ensure the account has been verified
if(user1.apiKey === apiKey){
    return res.status(httpStatus.OK).send({success: true, message: user1})
}



});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyApi,
  verifyEmail,
  login,
  auth,
  setPassword,
  tokenRefresh,
  adminAll,
  logout,
  test,
  // logoutTest,
};
