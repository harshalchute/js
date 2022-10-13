const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');
const User = require('../models/superadmin.model')
const superToken = require('../models/superToken.model')
const jwt = require('jsonwebtoken');

// const register = catchAsync(async (req, res) => {
//   bcrypt.hash(req.body.password, 10 ,(err, hash) => {
//     if (err) {
//       return res.json({success: false, message:'hasing issue'})
//     }else {

//        User.save()
//       .then((_) =>{
//         res.json({success: true, message: 'Registration successful'})
//       })
//       .catch((err) => {
//         if (err.code === 11000){
//           return res.json({success: false, message:"email already exists!"})
//         }else {
//         res.json({success: false, message:err})
//         }
//       })

//       console.log(req.body.name)
//     }
// });
// })



const tokenRefresh = (req, res) => {
  superToken.findOne({refresh: req.body.refresh},  (err, refreshtoken) => {
    if (!refreshtoken)
    return res.status(httpStatus.BAD_REQUEST).send({success: false, message: "Invalid refresh token"})
    else{
      if(req.body.refresh === refreshtoken.refresh){
        const payload = {
          userId : refreshtoken.user,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS})
        // const user2 = new memberToken({
        //   user : refreshtoken.user,
        //   refresh: re
        // });
        //  user2.save()
        return res.json({success: true,  message:'refresh successfully', Member: {token}})

      }
     return res.status(httpStatus.BAD_REQUEST).send({success: false, message:"didnt match"})
    }
  return res.status(httpStatus.BAD_REQUEST).send({success: false, message: "false error"})

  })
}


const logout = async (req, res) => {
  if (req.headers && req.headers.authorization){
   const token = req.headers.authorization.split(' ')[1];
   if(!token){
     return res.status(401).json({success: false, message: 'Authorization fails!'})
   }

   const tokens = req.userData.tokens;
   console.log("req.userData.tokens", req.userData.tokens)
   const newTokens = tokens.filter(t => t.token !== token)
   await User.findByIdAndUpdate(req.userData._id, {tokens: newTokens})
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
  const user1 = await User.findOne({ apiKey }).exec();
  console.log(user1)
  if (!user1) {
    return res.status(httpStatus.BAD_REQUEST).send({success: false, message: "not a Valid Api"});
}

// Step 2 - Ensure the account has been verified
if(user1.apiKey === apiKey){
    return res.status(httpStatus.OK).send({success: true, message: user1})
}



});





module.exports = {
  // register,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyApi,
  tokenRefresh,
  logout,
};
