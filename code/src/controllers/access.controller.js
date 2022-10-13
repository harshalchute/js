const member = require('../models/member.model')
const httpStatus = require('http-status');
const accessAuthRead = (req, res, next) => {



if (req.userData.role === "user"){
  member.findById(req.userData.userId,  (err, authread) => {
    if(authread.access === "read" || authread.access === "owner"){
      next();
    }else {
      res.status(httpStatus.BAD_REQUEST).send({success: false, message: "Unauthorized"})
    }
  })
}else {
  next();
}

}




const accessAuthWrite = (req, res, next) => {
  if (req.userData.role === "user"){
    member.findById(req.userData.userId,  (err, authwrite) => {
      if(authwrite.access === "write" || authwrite.access === "owner"){
        next();
      }else {
        res.status(httpStatus.BAD_REQUEST).send({success: false, message: "Unauthorized"})
      }
    })
  }else {
    next();
  }
}

// const accessAuthOwner = (req, res, next) => {
//   if (req.userData.role === "user"){
//     member.findById(req.userData.userId,  (err, employee) => {
//       if(employee.access === "owner" || employee.access === "write" || employee.access === "read"){
//         next();
//       }else {
//         res.json({success: false, message: err})
//       }
//     })
//   }else {
//     next();
//   }
// }

module.exports = {
  accessAuthRead,
  accessAuthWrite,
  // accessAuthOwner,
}
