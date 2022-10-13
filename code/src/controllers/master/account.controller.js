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
const accountGroup = require('../../models/account.model');
const currency = require('../../models/currency.model');
const costCategory = require('../../models/costCategory.model');
const costCenter = require('../../models/costCenter.model');
const ledger = require('../../models/ledger.model');
const voucherType = require('../../models/voucherType.model');

const accountJson = catchAsync(async (req, res) => {
  const user1 = await admin.find({ apiKey: req.headers.apikey }).exec();
  // console.log(user1[0]._id);
  // console.log(user1.length == 0);
  if (user1.length == 0) {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Api key invalid!' });
  }
  if (req.body.accountgroup) {
    const objectAccount = req.body.accountgroup;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await accountGroup.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new accountGroup({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          name: objectAccount[i].name || '',
          parent: objectAccount[i].parent || '',
          natureofgroup: objectAccount[i].natureofgroup || '',
          issubledger: objectAccount[i].issubledger || '',
          tracknegativebalance: objectAccount[i].tracknegativebalance || '',
          addalloctype: objectAccount[i].addalloctype || '',
          isgroupcalculable: objectAccount[i].isgroupcalculable || '',
          userId: user1[0]._id,
        });
        user.save();
        n++;
      } else {
        p++;
      }
    }
    console.log(p, n);
    // const user2 =  await accountGroup.insertMany(req.body.accountgroup,  {ordered: true})
    return res.json({
      success: true,
      message: 'account group successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }
  /**
   * cost category
   */
  if (req.body.costcategory) {
    const objectAccount = req.body.costcategory;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await costCategory.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new costCategory({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          name: objectAccount[i].name || '',
          parent: objectAccount[i].parent || '',
          allocaterevenue: objectAccount[i].allocaterevenue || '',
          allocatenonrevenue: objectAccount[i].allocatenonrevenue || '',
          userId: user1[0]._id,
        });
        user.save();
        n++;
      } else {
        p++;
      }
    }
    console.log(p, n);
    // const user2 =  await accountGroup.insertMany(req.body.accountgroup,  {ordered: true})
    return res.json({
      success: true,
      message: 'costcategory successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }
  if (req.body.costcentre) {
    const objectAccount = req.body.costcentre;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await costCenter.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new costCenter({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          costcategoryname: objectAccount[i].costcategoryname || '',
          name: objectAccount[i].name || '',
          parent: objectAccount[i].parent || '',
          openingbalancerevenue: objectAccount[i].openingbalancerevenue || '',
          forjobcasting: objectAccount[i].forjobcasting || '',
          forpayroll: objectAccount[i].forpayroll || '',
          emailid: objectAccount[i].emailid || '',
          userId: user1[0]._id,
        });
        user.save();
        n++;
      } else {
        p++;
      }
    }
    console.log(p, n);
    // const user2 =  await accountGroup.insertMany(req.body.accountgroup,  {ordered: true})
    return res.json({
      success: true,
      message: 'costcentre successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }
  if (req.body.currency) {
    const objectAccount = req.body.currency;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await currency.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new currency({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          symbol: objectAccount[i].symbol || '',
          name: objectAccount[i].name || '',
          decimalplaces: objectAccount[i].decimalplaces || '',
          showinmillions: objectAccount[i].showinmillions || '',
          decimalplacesinwords: objectAccount[i].decimalplacesinwords || '',
          issuffix: objectAccount[i].issuffix || '',
          userId: user1[0]._id,
        });
        user.save();
        n++;
      } else {
        p++;
      }
    }
    console.log(p, n);
    // const user2 =  await accountGroup.insertMany(req.body.accountgroup,  {ordered: true})
    return res.json({
      success: true,
      message: 'currency successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }
  if (req.body.ledger) {
    const objectAccount = req.body.ledger;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await ledger.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new ledger({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          name: objectAccount[i].name || '',
          parent: objectAccount[i].parent || '',
          grandparent: objectAccount[i].grandparent || '',
          natureofgroup: objectAccount[i].natureofgroup || '',
          currency: objectAccount[i].currency || '',
          billbybill: objectAccount[i].billbybill || '',
          inventoryeffected: objectAccount[i].inventoryeffected || '',
          costcentre: objectAccount[i].costcentre || '',
          interestcalc: objectAccount[i].interestcalc || '',
          mailingname: objectAccount[i].mailingname || '',
          address: objectAccount[i].address || '',
          country: objectAccount[i].country || '',
          state: objectAccount[i].state || '',
          mobilenumber: objectAccount[i].mobilenumber || '',
          gsttype: objectAccount[i].gsttype || '',
          isecommerce: objectAccount[i].isecommerce || '',
          gstpartytype: objectAccount[i].gstpartytype || '',
          gstnumber: objectAccount[i].gstnumber || '',
          openingbalance: objectAccount[i].openingbalance || '',
          closingbalance: objectAccount[i].closingbalance || '',
          creditperiod: objectAccount[i].creditperiod || '',
          creditdays: objectAccount[i].creditdays || '',
          creditlimit: objectAccount[i].creditlimit || '',
          userId: user1[0]._id,
        });
        user.save();
        n++;
      } else {
        p++;
      }
    }
    console.log(p, n);
    // const user2 =  await accountGroup.insertMany(req.body.accountgroup,  {ordered: true})
    return res.json({
      success: true,
      message: 'ledger successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }
  if (req.body.vouchertype) {
    const objectAccount = req.body.vouchertype;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await voucherType.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new voucherType({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          vouchername: objectAccount[i].vouchername || '',
          abbreviation: objectAccount[i].abbreviation || '',
          numberingmethod: objectAccount[i].numberingmethod || '',
          effectivedate: objectAccount[i].effectivedate || '',
          IsOptionalByDefault: objectAccount[i].IsOptionalByDefault || '',
          allownarration: objectAccount[i].allownarration || '',
          providemultinarration: objectAccount[i].providemultinarration || '',
          defaultallocation: objectAccount[i].defaultallocation || '',
          printaftersave: objectAccount[i].printaftersave || '',
          useforpos: objectAccount[i].useforpos || '',
          defaultbank: objectAccount[i].defaultbank || '',
          defaultjurisdiction: objectAccount[i].defaultjurisdiction || '',
          restartlist: objectAccount[i].restartlist,
          restartdate: objectAccount[i].restartdate || '',
          beginingnumber: objectAccount[i].beginingnumber || '',
          particulers: objectAccount[i].particulers || '',
          prefixlist: objectAccount[i].prefixlist,
          prefixname: objectAccount[i].prefixname || '',
          prefixdate: objectAccount[i].prefixdate || '',
          suffixlist: objectAccount[i].suffixlist,
          suffixname: objectAccount[i].suffixname || '',
          suffixdate: objectAccount[i].suffixdate || '',
          userId: user1[0]._id,
        });
        user.save();
        n++;
      } else {
        p++;
      }
    }
    console.log(p, n);
    // const user2 =  await accountGroup.insertMany(req.body.accountgroup,  {ordered: true})
    return res.json({
      success: true,
      message: 'vouchertype successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }
  return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'wrong json data' });
});

const getaccount = catchAsync(async (req, res) => {
  const id = req.userData._id;
  // const userId = req.userData.userId;
  admin.findById(id, function (err, employee) {
    const adminApiKey = employee._id;
    console.log(adminApiKey);
    const masterDetails = req.body.accountType;
    if (masterDetails === 'accountgroup') {
      accountGroup.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_accountgroup: account.length, accountGroup: account } });
      });
    } else if (masterDetails === 'costcategory') {
      costCategory.find({ userId: adminApiKey }, function (_err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_costcategory: account.length, costCategory: account } });
      });
    } else if (masterDetails === 'costcenter') {
      costCenter.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_costcenter: account.length, costCenter: account } });
      });
    } else if (masterDetails === 'currency') {
      currency.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_currency: account.length, currency: account } });
      });
    } else if (masterDetails === 'ledger') {
      ledger.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_ledger: account.length, ledger: account } });
      });
    } else if (masterDetails === 'vouchertype') {
      voucherType.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_vouchertype: account.length, vouchertype: account } });
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Wrong Account Type' });
    }
  });
});

module.exports = {
  accountJson,
  getaccount,
};
