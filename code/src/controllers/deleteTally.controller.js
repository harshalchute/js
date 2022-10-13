const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const moment = require('moment');
const config = require('../config/config');
const admin = require('../models/user.model');
const Contra = require('../models/Transactional/contra.model');
const Creditnote = require('../models/Transactional/creditnote.model');
const Debitnote = require('../models/Transactional/debitnote.model');
const Journal = require('../models/Transactional/journal.model');
const Payments = require('../models/Transactional/payment.model');
const Purchase = require('../models/Transactional/purchase.model');
const Receipt = require('../models/Transactional/receipt.model');
const Sales = require('../models/Transactional/sales.model');
const Purchaseorder = require('../models/Transactional/purchaseorder.model');
const Salesorder = require('../models/Transactional/salesorder.model');
const Memorandum = require('../models/Transactional/memorandum.model');
const Reversingjournal = require('../models/Transactional/reversingjournal.model');
const Deliverynote = require('../models/Transactional/deliverynote.model');
const Physicalstock = require('../models/Transactional/physicalstock.model');
const Receiptnote = require('../models/Transactional/receiptnote.model');
const Rejectionin = require('../models/Transactional/rejectionin.model');
const Rejectionout = require('../models/Transactional/rejectionout.model');
const Stockjournal = require('../models/Transactional/stockjournal.model');
const Jobworkissue = require('../models/Transactional/jobworkissue.model');
const Jobworkreceive = require('../models/Transactional/jobworkreceive.model');
const Materialin = require('../models/Transactional/materialin.model');
const Materialsout = require('../models/Transactional/materialsout.model');
const Stockitem = require('../models/Transactional/stockitem.model');

const deleteTally = async (req, res) => {
  const user1 = await admin.find({ apiKey: req.headers.apikey }).exec();
  if (user1.length == 0) {
   return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Api key invalid!' });
 }
  if (req.body.DeleteTallyInvoice) {


    const objectAccount = req.body.DeleteTallyInvoice;
    const counting = Object.keys(objectAccount).length;
let p = 0;

    let n = 0;
    const result = []
// try{
    for (let i = 0; i < counting; i++) {
// console.log("req.body.DeleteTallyInvoice[i]",req.body.DeleteTallyInvoice[i], i)
// await Sales.findOneAndDelete({ guid: req.body.DeleteTallyInvoice[i].TallyGUID, vouchertype: req.body.DeleteTallyInvoice[i].TallyVchType, masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID) });
// await Salesorder.findOneAndDelete({ guid: req.body.DeleteTallyInvoice[i].TallyGUID, vouchertype: req.body.DeleteTallyInvoice[i].TallyVchType, masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID) });
// await Purchase.findOneAndDelete({ guid: req.body.DeleteTallyInvoice[i].TallyGUID, vouchertype: req.body.DeleteTallyInvoice[i].TallyVchType, masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID) });


      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'contra') {
        const check = await Contra.find({ userId: user1[0]._id }).exec();
if(check[0]){
console.log("check", check);

    const contraCount =  await Contra.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if (contraCount){
          result.push("1")
        }
}


        // const finalToken = await Sales.find({ guid: req.body.DeleteTallyInvoice[i].TallyGUID }).exec();
        // // console.log('finalToken[0].masterid', finalToken[0].masterid);


        // if (finalToken[0]){
        //   if (
        //     Number(req.body.DeleteTallyInvoice[i].TallyMasterID) === finalToken[0].masterid &&
        //     req.body.DeleteTallyInvoice[i].TallyVchType === finalToken[0].vouchertype
        //   ) {
        //     console.log('sales', finalToken);
        //     await Sales.findOneAndDelete({ guid: req.body.DeleteTallyInvoice[i].TallyGUID });
        //     console.log(await Sales.countDocuments({ guid: req.body.DeleteTallyInvoice[i].TallyGUID }));
        //     result1.sales = "sales Deleted"

        //   }
        //     // if (req.body.DeleteTallyInvoice[i].TallyGUID === finalToken.[i])


        // }else{
        //   result.sales = "sales not found"
        // }


        }
         if (req.body.DeleteTallyInvoice[i].TallyVchType === 'creditnote') {
          const check = await Creditnote.find({ userId: user1[0]._id }).exec();
          if(check[0]){
        const creditCount = await Creditnote.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(creditCount){
          result.push("1")
        }
      }
      }
      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'debitnote') {
        const check = await Debitnote.find({ userId: user1[0]._id }).exec();
          if(check[0]){
        const debitCount = await Debitnote.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(debitCount){
          result.push("1")
        }
      }
      }
      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'deliverynote') {
        const check = await Deliverynote.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const deliverynoteCount =  await Deliverynote.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(deliverynoteCount){
          result.push("1")
        }
      }
      }
      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'jobworkissue') {
        const check = await Jobworkissue.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const jobworkissueCount =  await Jobworkissue.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(jobworkissueCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'jobworkreceive') {
        const check = await Jobworkreceive.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const jobworkreceiveCount = await Jobworkreceive.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(jobworkreceiveCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'journal') {
        const check = await Journal.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const journalCount = await Journal.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(journalCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'materialin') {
        const check = await Materialin.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const materialinCount = await Materialin.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(materialinCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'materialsout') {
        const check = await Materialsout.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const materialsoutCount =  await Materialsout.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(materialsoutCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'memorandum') {
        const check = await Memorandum.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const memorandumCount = await Memorandum.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(memorandumCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'payments') {
        const check = await Payments.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const paymentCount = await Payments.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(paymentCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'physicalstock') {
        const check = await Physicalstock.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const physicalstockCount = await Physicalstock.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(physicalstockCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'purchase') {
        const check = await Purchase.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const purchaseCount = await Purchase.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(purchaseCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'purchaseorder') {
        const check = await Purchaseorder.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const purchaseorderCount = await Purchaseorder.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(purchaseorderCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'receipt') {
        const check = await Receipt.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const receiptCount = await Receipt.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(receiptCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'receiptnote') {
        const check = await Receiptnote.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const receiptnoteCount = await Receiptnote.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(receiptnoteCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'rejectionin') {
        const check = await Rejectionin.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const RejectioninCount = await Rejectionin.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(RejectioninCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'rejectionout') {
        const check = await Rejectionout.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const rejectionoutCount = await Rejectionout.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(rejectionoutCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'reversingjournal') {
        const check = await Reversingjournal.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const reversingCount = await Reversingjournal.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(reversingCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'sales') {
        const check = await Sales.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const salesCount = await Sales.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(salesCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'salesorder') {
        const check = await Salesorder.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const salesorderCount = await Salesorder.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(salesorderCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'stockitem') {
        const check = await Stockitem.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const stockitemCount = await Stockitem.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(stockitemCount){
          result.push("1")
        }
      }
      }

      if (req.body.DeleteTallyInvoice[i].TallyVchType === 'stockjournal') {
        const check = await Stockjournal.find({ userId: user1[0]._id }).exec();
        if(check[0]){
        const stockjournalCount = await Stockjournal.findOneAndDelete({
          guid: req.body.DeleteTallyInvoice[i].TallyGUID,
          masterid: Number(req.body.DeleteTallyInvoice[i].TallyMasterID),
        });
        if(stockjournalCount){
          result.push("1")
        }
      }
      }

    }
    return res.status(httpStatus.OK).send({ success: true, message: 'deleted successfully', Total_deleted: result.length });

  } else {
    return res.json({ success: false, message: 'Wrong Json Data Enter' });
  }
};

module.exports = {
  deleteTally,
};


