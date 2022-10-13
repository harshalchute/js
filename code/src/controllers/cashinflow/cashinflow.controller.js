/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authService, userService, tokenService, emailService } = require('../../services');
const moment = require('moment');
const config = require('../../config/config');
const admin = require('../../models/user.model');
const Contra = require('../../models/Transactional/contra.model');
const Creditnote = require('../../models/Transactional/creditnote.model');
const Debitnote = require('../../models/Transactional/debitnote.model');
const Journal = require('../../models/Transactional/journal.model');
const Payments = require('../../models/Transactional/payment.model');
const Purchase = require('../../models/Transactional/purchase.model');
const Receipt = require('../../models/Transactional/receipt.model');
const Sales = require('../../models/Transactional/sales.model');
const Purchaseorder = require('../../models/Transactional/purchaseorder.model');
const Salesorder = require('../../models/Transactional/salesorder.model');
const Memorandum = require('../../models/Transactional/memorandum.model');
const Reversingjournal = require('../../models/Transactional/reversingjournal.model');
const Deliverynote = require('../../models/Transactional/deliverynote.model');
const Physicalstock = require('../../models/Transactional/physicalstock.model');
const Receiptnote = require('../../models/Transactional/receiptnote.model');
const Rejectionin = require('../../models/Transactional/rejectionin.model');
const Rejectionout = require('../../models/Transactional/rejectionout.model');
const Stockjournal = require('../../models/Transactional/stockjournal.model');
const Jobworkissue = require('../../models/Transactional/jobworkissue.model');
const Jobworkreceive = require('../../models/Transactional/jobworkreceive.model');
const Materialin = require('../../models/Transactional/materialin.model');
const Materialsout = require('../../models/Transactional/materialsout.model');
const Stockitem = require('../../models/Transactional/stockitem.model');
const ledger = require('../../models/ledger.model');

const getaccount = catchAsync(async (req, res) => {
  const id = req.userData._id;
  // const userId = req.userData.userId;
  admin.findById(id, async (err, user) => {
    const userId = user._id;
    console.log(userId);

    const receiptData = await Receipt.find({ userId: userId }).exec();
    const ledgerData = await ledger.find({ userId: userId }).exec();
    const cashDetails = req.body.accountType;
    const cashinflow = [];
    const m = 0;
    let check;
    let check1;
    let check2;
    for (let i = 0; i < receiptData.length; i++) {
      const receipt_check = [];
      const ledger_check = [];

      for (let j = 0; j < receiptData[i].ledgerdetail.length; j++) {
console.log("receiptData[i].ledgerdetail.amount", receiptData[i].ledgerdetail[j].amount);
        if (receiptData[i].ledgerdetail[j].amount > 0) {
          console.log('receiptData[i].ledgerdetail.length', receiptData[i].ledgerdetail.length);
          check = {
            vouchertype: receiptData[i].vouchertype || '',
            voucherdate: receiptData[i].voucherdate || '',
            ledgername: receiptData[i].ledgerdetail[j].ledgername || '',
            amount: receiptData[i].ledgerdetail[j].amount || '',
          };
          receipt_check.push(check);
          for (let m = 0; m < ledgerData.length; m++) {
            if (receiptData[i].ledgerdetail[j].ledgername === ledgerData[m].name) {
              if (ledgerData[m].grandparent === 'Sundry Debtors') {
                check2 = {
                  cashinflow_type: 'Sales',
                };
              } else if (ledgerData[m].grandparent === 'Capital Account') {
                check2 = {
                  cashinflow_type: 'Capital',
                };
              } else if (ledgerData[m].grandparent === 'Loans (Liability)') {
                check2 = {
                  cashinflow_type: 'Loans',
                };
              } else {
                check2 = {
                  cashinflow_type: 'Others',
                };
              }
              check1 = {
                name: ledgerData[m].name || '',
                parent: ledgerData[m].parent || '',
                grandparent: ledgerData[m].grandparent || '',
                billbybill: ledgerData[m].billbybill || '',
                type: check2.cashinflow_type,
              };

              ledger_check.push(check1);
            }
          }
        }

      }

      cashinflow.push({ cashinflow_receipt: receipt_check, cashinflow_ledger: ledger_check });
    }
    return res.status(200).json({ success: true, cashinflow: cashinflow });
  });
});

module.exports = {
  getaccount,
};
