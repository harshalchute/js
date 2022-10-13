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

const accountJson = catchAsync(async (req, res) => {
  const user1 = await admin.find({ apiKey: req.headers.apikey }).exec();
 console.log(user1)
  // console.log(user1[0]._id);
  // console.log(user1.length == 0);
  if (user1.length == 0) {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Api key invalid!' });
  }
  if (req.body.contra) {
    const objectAccount = req.body.contra;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Contra.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Contra({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          trantype: objectAccount[i].trantype || '',
          instrument: objectAccount[i].instrument || '',
          date: objectAccount[i].date || '',
          favouring: objectAccount[i].favouring || '',
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
      message: 'contra successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.creditnote) {
    const objectAccount = req.body.creditnote;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Creditnote.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Creditnote({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          referenceno: objectAccount[i].referenceno || '',
          referencedate: objectAccount[i].referencedate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerphone: objectAccount[i].ledgerphone || '',
          ledgerfax: objectAccount[i].ledgerfax || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgertin: objectAccount[i].ledgertin || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          placeofreciept: objectAccount[i].placeofreciept || '',
          vesselflieghtno: objectAccount[i].vesselflie || '',
          portoflanding: objectAccount[i].portoflanding || '',
          portofdischarge: objectAccount[i].portofdischarge || '',
          countryto: objectAccount[i].countryto || '',
          narration: objectAccount[i].narration || '',
          costcentre: objectAccount[i].costcentre || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          taxrate: objectAccount[i].taxrate || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          currencyrate: objectAccount[i].currencyrate || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          hsncode: objectAccount[i].hsncode || '',
          igstrate: objectAccount[i].igstrate || '',
          cgstrate: objectAccount[i].cgstrate || '',
          sgstrate: objectAccount[i].sgstrate || '',
          cessrate: objectAccount[i].cessrate || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
          accountingalocation: objectAccount[i].accountingalocation,
          ledgername: objectAccount[i].ledgername || '',
          parent: objectAccount[i].parent || '',
          amount: objectAccount[i].amount || '',
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
      message: 'creditnote successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.debitnote) {
    const objectAccount = req.body.debitnote;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Debitnote.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Debitnote({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          referenceno: objectAccount[i].referenceno || '',
          referencedate: objectAccount[i].referencedate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerphone: objectAccount[i].ledgerphone || '',
          ledgerfax: objectAccount[i].ledgerfax || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgertin: objectAccount[i].ledgertin || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          placeofreciept: objectAccount[i].placeofreciept || '',
          vesselflieghtno: objectAccount[i].vesselflie || '',
          portoflanding: objectAccount[i].portoflanding || '',
          portofdischarge: objectAccount[i].portofdischarge || '',
          countryto: objectAccount[i].countryto || '',
          narration: objectAccount[i].narration || '',
          costcentre: objectAccount[i].costcentre || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          taxrate: objectAccount[i].taxrate || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          currencyrate: objectAccount[i].currencyrate || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          hsncode: objectAccount[i].hsncode || '',
          igstrate: objectAccount[i].igstrate || '',
          cgstrate: objectAccount[i].cgstrate || '',
          sgstrate: objectAccount[i].sgstrate || '',
          cessrate: objectAccount[i].cessrate || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
          accountingalocation: objectAccount[i].accountingalocation,
          ledgername: objectAccount[i].ledgername || '',
          parent: objectAccount[i].parent || '',
          amount: objectAccount[i].amount || '',
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
      message: 'debitnote successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.journal) {
    const objectAccount = req.body.journal;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Journal.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Journal({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          billdetail: objectAccount[i].billdetail,
          billguid: objectAccount[i].billguid || '',
          billref: objectAccount[i].bill || '',
          billtype: objectAccount[i].billtype || '',
          billamount: objectAccount[i].billamount || '',
          inventorydetail: objectAccount[i].inventorydetail,
          stockitemname: objectAccount[i].stockitemname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          batchdetail: objectAccount[i].batchdetail,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'journal successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.payment) {
    const objectAccount = req.body.payment;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Payments.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Payments({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          billdetail: objectAccount[i].billdetail,
          billguid: objectAccount[i].billguid || '',
          billref: objectAccount[i].billref || '',
          billtype: objectAccount[i].billtype || '',
          billamount: objectAccount[i].billamount || '',
          trantype: objectAccount[i].trantype || '',
          date: objectAccount[i].date || '',
          favouring: objectAccount[i].favouring || '',
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
      message: 'payment successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.purchase) {
    const objectAccount = req.body.purchase;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Purchase.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Purchase({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          referenceno: objectAccount[i].referenceno || '',
          referencedate: objectAccount[i].referencedate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerphone: objectAccount[i].ledgerphone || '',
          ledgerfax: objectAccount[i].ledgerfax || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgertin: objectAccount[i].ledgertin || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          placeofreciept: objectAccount[i].placeofreciept || '',
          vesselflieghtno: objectAccount[i].vesselflie || '',
          portoflanding: objectAccount[i].portoflanding || '',
          portofdischarge: objectAccount[i].portofdischarge || '',
          countryto: objectAccount[i].countryto || '',
          narration: objectAccount[i].narration || '',
          costcentre: objectAccount[i].costcentre || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          taxrate: objectAccount[i].taxrate || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          currencyrate: objectAccount[i].currencyrate || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          hsncode: objectAccount[i].hsncode || '',
          igstrate: objectAccount[i].igstrate || '',
          cgstrate: objectAccount[i].cgstrate || '',
          sgstrate: objectAccount[i].sgstrate || '',
          cessrate: objectAccount[i].cessrate || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
          accountingalocation: objectAccount[i].accountingalocation,
          ledgername: objectAccount[i].ledgername || '',
          parent: objectAccount[i].parent || '',
          amount: objectAccount[i].amount || '',
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
      message: 'purchase successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.receipt) {
    const objectAccount = req.body.receipt;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Receipt.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      console.log(check);
      if (check.length == 0) {
        const user = new Receipt({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          instrument: objectAccount[i].instrument || '',
          billdetail: objectAccount[i].billdetail,
          billguid: objectAccount[i].billguid || '',
          billref: objectAccount[i].billref || '',
          billtype: objectAccount[i].billtype || '',
          billamount: objectAccount[i].billamount || '',
          trantype: objectAccount[i].trantype || '',
          date: objectAccount[i].date || '',
          favouring: objectAccount[i].favouring || '',
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
      message: 'receipt successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.sales) {
    const objectAccount = req.body.sales;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Sales.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Sales({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          taxrate: objectAccount[i].taxrate || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
          accountingalocation: objectAccount[i].accountingalocation,
          ledgername: objectAccount[i].ledgername || '',
          parent: objectAccount[i].parent || '',
          amount: objectAccount[i].amount || '',
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
      message: 'sales successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.purchaseorder) {
    const objectAccount = req.body.purchaseorder;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Purchaseorder.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Purchaseorder({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          referenceno: objectAccount[i].referenceno || '',
          referencedate: objectAccount[i].referencedate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerphone: objectAccount[i].ledgerphone || '',
          ledgerfax: objectAccount[i].ledgerfax || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgertin: objectAccount[i].ledgertin || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          costcentre: objectAccount[i].costcentre || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].taxrate || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          currencyrate: objectAccount[i].currencyrate || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          hsncode: objectAccount[i].hsncode || '',
          igstrate: objectAccount[i].igstrate || '',
          cgstrate: objectAccount[i].cgstrate || '',
          sgstrate: objectAccount[i].sgstrate || '',
          cessrate: objectAccount[i].cessrate || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'purchaseorder successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.salesorder) {
    const objectAccount = req.body.salesorder;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Salesorder.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Salesorder({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          referenceno: objectAccount[i].referenceno || '',
          referencedate: objectAccount[i].referencedate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerphone: objectAccount[i].ledgerphone || '',
          ledgerfax: objectAccount[i].ledgerfax || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgertin: objectAccount[i].ledgertin || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          costcentre: objectAccount[i].costcentre || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].taxrate || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          currencyrate: objectAccount[i].currencyrate || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          hsncode: objectAccount[i].hsncode || '',
          igstrate: objectAccount[i].igstrate || '',
          cgstrate: objectAccount[i].cgstrate || '',
          sgstrate: objectAccount[i].sgstrate || '',
          cessrate: objectAccount[i].cessrate || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'salesorder successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.memorandum) {
    const objectAccount = req.body.memorandum;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Memorandum.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Memorandum({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          billdetail: objectAccount[i].billdetail,
          billguid: objectAccount[i].billguid || '',
          billref: objectAccount[i].billref || '',
          billtype: objectAccount[i].billtype || '',
          billamount: objectAccount[i].billamount || '',
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
      message: 'memorandum successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.reversingjournal) {
    const objectAccount = req.body.reversingjournal;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Reversingjournal.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Reversingjournal({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          billdetail: objectAccount[i].billdetail,
          billguid: objectAccount[i].billguid || '',
          billref: objectAccount[i].billref || '',
          billtype: objectAccount[i].billtype || '',
          billamount: objectAccount[i].billamount || '',
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
      message: 'reversingjournal successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.deliverynote) {
    const objectAccount = req.body.deliverynote;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Deliverynote.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Deliverynote({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].taxrate || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdisc: objectAccount[i].stockdisc || '',
          stockamount: objectAccount[i].stockamount || '',
          batchs: objectAccount[i].batchs,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'deliverynote successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.physicalstock) {
    const objectAccount = req.body.physicalstock;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Physicalstock.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Physicalstock({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          inventorydetail: objectAccount[i].inventorydetail,
          stockitemname: objectAccount[i].stockitemname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          batchdetail: objectAccount[i].batchdetail,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'physicalstock successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.receiptnote) {
    const objectAccount = req.body.receiptnote;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Receiptnote.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      console.log(check);
      if (check.length == 0) {
        const user = new Receiptnote({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].dutytype || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdisc: objectAccount[i].stockdisc || '',
          stockamount: objectAccount[i].stockamount || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'receiptnote successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.rejectionin) {
    const objectAccount = req.body.rejectionin;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Rejectionin.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      console.log(check);
      if (check.length == 0) {
        const user = new Rejectionin({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          partyname: objectAccount[i].partyname || '',
          narration: objectAccount[i].narration || '',
          inventorydetail: objectAccount[i].inventorydetail,
          stockitemname: objectAccount[i].stockitemname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          batchdetail: objectAccount[i].batchdetail,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          orderno: objectAccount[i].orderno || '',
          trackingno: objectAccount[i].trackingno || '',
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
      message: 'rejectionin successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.rejectionout) {
    const objectAccount = req.body.rejectionout;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Rejectionout.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      console.log(check);
      if (check.length == 0) {
        const user = new Rejectionout({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          partyname: objectAccount[i].partyname || '',
          narration: objectAccount[i].narration || '',
          inventorydetail: objectAccount[i].inventorydetail,
          stockitemname: objectAccount[i].stockitemname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          batchdetail: objectAccount[i].batchdetail,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          orderno: objectAccount[i].orderno || '',
          trackingno: objectAccount[i].trackingno || '',
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
      message: 'rejectionout successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.stockjournal) {
    const objectAccount = req.body.stockjournal;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Stockjournal.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      console.log(check);
      if (check.length == 0) {
        const user = new Stockjournal({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          narration: objectAccount[i].narration || '',
          inventoryin: objectAccount[i].inventoryin,
          stockitemname: objectAccount[i].stockitemname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          batchdetail: objectAccount[i].batchdetail,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          quantity: objectAccount[i].quantity || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
          inventoryout: objectAccount[i].inventoryout,
          stockitemname: objectAccount[i].stockitemname || '',
          quantity: objectAccount[i].quantity || '',
          rate: objectAccount[i].rate || '',
          billamount: objectAccount[i].billamount || '',
          batchdetail: objectAccount[i].batchdetail,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          quantity: objectAccount[i].quantity || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'stockjournal successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.jobworkissue) {
    const objectAccount = req.body.jobworkissue;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Jobworkissue.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Jobworkissue({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          costcentre: objectAccount[i].costcentre || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].dutytype || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          currencyrate: objectAccount[i].currencyrate || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          hsncode: objectAccount[i].hsncode || '',
          igstrate: objectAccount[i].igstrate || '',
          cgstrate: objectAccount[i].cgstrate || '',
          sgstrate: objectAccount[i].sgstrate || '',
          cessrate: objectAccount[i].cessrate || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'jobworkissue successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.jobworkreceive) {
    const objectAccount = req.body.jobworkreceive;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Jobworkreceive.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      // console.log(check[0].guid);
      if (check.length == 0) {
        const user = new Jobworkreceive({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          costcentre: objectAccount[i].costcentre || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].dutytype || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          actualqty: objectAccount[i].actualqty || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          currencysymbol: objectAccount[i].currencysymbol || '',
          currencyname: objectAccount[i].currencyname || '',
          currencyrate: objectAccount[i].currencyrate || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdiscount: objectAccount[i].stockdiscount || '',
          amount: objectAccount[i].amount || '',
          ordernumber: objectAccount[i].ordernumber || '',
          deliverynotenumber: objectAccount[i].deliverynotenumber || '',
          hsncode: objectAccount[i].hsncode || '',
          igstrate: objectAccount[i].igstrate || '',
          cgstrate: objectAccount[i].cgstrate || '',
          sgstrate: objectAccount[i].sgstrate || '',
          cessrate: objectAccount[i].cessrate || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'jobworkreceive successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.materialin) {
    const objectAccount = req.body.materialin;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Materialin.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      if (check.length == 0) {
        const user = new Materialin({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          godown: objectAccount[i].godown || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].dutytype || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdisc: objectAccount[i].stockdisc || '',
          amount: objectAccount[i].amount || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          destinationgodownname: objectAccount[i].destinationgodownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'materialin successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.materialsout) {
    const objectAccount = req.body.materialsout;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Materialsout.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      if (check.length == 0) {
        const user = new Materialsout({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          IsOptional: objectAccount[i].IsOptional || '',
          vouchertype: objectAccount[i].vouchertype || '',
          vouchertypename: objectAccount[i].vouchertypename || '',
          voucherno: objectAccount[i].voucherno || '',
          voucherdate: objectAccount[i].voucherdate || '',
          ledgername: objectAccount[i].ledgername || '',
          ledgeraddress: objectAccount[i].ledgeraddress || '',
          ledgerpincode: objectAccount[i].ledgerpincode || '',
          ledgerstate: objectAccount[i].ledgerstate || '',
          ledgergst: objectAccount[i].ledgergst || '',
          buyername: objectAccount[i].buyername || '',
          buyeraddress: objectAccount[i].buyeraddress || '',
          consigneename: objectAccount[i].consigneename || '',
          consigneeaddress: objectAccount[i].consigneeaddress || '',
          narration: objectAccount[i].narration || '',
          godown: objectAccount[i].godown || '',
          ledgerdetail: objectAccount[i].ledgerdetail,
          ledgername: objectAccount[i].ledgername || '',
          ispartyledger: objectAccount[i].ispartyledger || '',
          amount: objectAccount[i].amount || '',
          taxtype: objectAccount[i].taxtype || '',
          dutytype: objectAccount[i].dutytype || '',
          invdetail: objectAccount[i].invdetail,
          stockname: objectAccount[i].stockname || '',
          stockbilledqty: objectAccount[i].stockbilledqty || '',
          stockrate: objectAccount[i].stockrate || '',
          stockdisc: objectAccount[i].stockdisc || '',
          amount: objectAccount[i].amount || '',
          batch: objectAccount[i].batch,
          godownname: objectAccount[i].godownname || '',
          destinationgodownname: objectAccount[i].destinationgodownname || '',
          batchname: objectAccount[i].batchname || '',
          batchqty: objectAccount[i].batchqty || '',
          batchrate: objectAccount[i].batchrate || '',
          batchamount: objectAccount[i].batchamount || '',
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
      message: 'materialsout successfully synced',
      details: { total_inserted: n, total_duplicated: p },
    });
  }

  if (req.body.stockitem) {
    const objectAccount = req.body.stockitem;
    const counting = Object.keys(objectAccount).length;
    let p = 0;
    let n = 0;
    for (let i = 0; i < counting; i++) {
      const check = await Stockitem.find({ guid: objectAccount[i].guid, userId: user1[0]._id }).exec();
      if (check.length == 0) {
        const user = new Stockitem({
          guid: objectAccount[i].guid || '',
          masterid: objectAccount[i].masterid || '',
          alterid: objectAccount[i].alterid || '',
          name: objectAccount[i].name || '',
          partnumber: objectAccount[i].partnumber || '',
          parent: objectAccount[i].parent || '',
          category: objectAccount[i].category || '',
          baseuom: objectAccount[i].baseuom || '',
          altuom: objectAccount[i].altuom || '',
          altconv: objectAccount[i].altconv || '',
          isbatchable: objectAccount[i].isbatchable || '',
          mgfdate: objectAccount[i].mgfdate || '',
          useexpirydate: objectAccount[i].useexpirydate || '',
          enablecosttracking: objectAccount[i].enablecosttracking || '',
          gstapplicable: objectAccount[i].gstapplicable || '',
          typeofgoods: objectAccount[i].typeofgoods || '',
          valuemethod: objectAccount[i].valuemethod || '',
          ignorephysdiff: objectAccount[i].ignorephysdiff || '',
          ignorenegative: objectAccount[i].ignorenegative || '',
          salesasmfd: objectAccount[i].salesasmfd || '',
          purcasconsumed: objectAccount[i].purcasconsumed || '',
          rejectasscrap: objectAccount[i].rejectassc || '',
          allowuseexpireditems: objectAccount[i].allowuseexpireditems || '',
          rateofduty: objectAccount[i].rateofduty || '',
          calcmrp: objectAccount[i].calcmrp || '',
          batchallocation: objectAccount[i].batchallocation,
          godownname: objectAccount[i].godownname || '',
          batchname: objectAccount[i].batchname || '',
          openingbal: objectAccount[i].openingbal || '',
          openingrate: objectAccount[i].openingrate || '',
          openingvalue: objectAccount[i].openingvalue || '',
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
      message: 'stockitem successfully synced',
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
    if (masterDetails === 'contra') {
      Contra.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_contra: account.length, contra: account } });
      });
    } else if (masterDetails === 'creditnote') {
      Creditnote.find({ userId: adminApiKey }, function (_err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_creditnote: account.length, creditnote: account } });
      });
    } else if (masterDetails === 'debitnote') {
      Debitnote.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_debitnote: account.length, debitnote: account } });
      });
    } else if (masterDetails === 'journal') {
      Journal.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_journal: account.length, journal: account } });
      });
    } else if (masterDetails === 'payments') {
      Payments.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_payments: account.length, payments: account } });
      });
    } else if (masterDetails === 'purchase') {
      Purchase.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_purchase: account.length, purchase: account } });
      });
    } else if (masterDetails === 'receipt') {
      Receipt.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_receipt: account.length, receipt: account } });
      });
    } else if (masterDetails === 'sales') {
      Sales.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_sales: account.length, sales: account } });
      });
    } else if (masterDetails === 'purchaseorder') {
      Purchaseorder.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_purchaseorder: account.length, purchaseorder: account } });
      });
    } else if (masterDetails === 'salesorder') {
      Salesorder.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_salesorder: account.length, salesorder: account } });
      });
    } else if (masterDetails === 'memorandum') {
      Memorandum.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_memorandum: account.length, memorandum: account } });
      });
    } else if (masterDetails === 'reversingjournal') {
      Reversingjournal.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_reversingjournal: account.length, reversingjournal: account } });
      });
    } else if (masterDetails === 'deliverynote') {
      Deliverynote.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_deliverynote: account.length, deliverynote: account } });
      });
    } else if (masterDetails === 'physicalstock') {
      Physicalstock.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_physicalstock: account.length, physicalstock: account } });
      });
    } else if (masterDetails === 'receiptnote') {
      Receiptnote.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_receiptnote: account.length, receiptnote: account } });
      });
    } else if (masterDetails === 'rejectionin') {
      Rejectionin.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_rejectionin: account.length, rejectionin: account } });
      });
    } else if (masterDetails === 'rejectionout') {
      Rejectionout.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_rejectionout: account.length, rejectionout: account } });
      });
    } else if (masterDetails === 'stockjournal') {
      Stockjournal.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_stockjournal: account.length, stockjournal: account } });
      });
    } else if (masterDetails === 'jobworkissue') {
      Jobworkissue.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_jobworkissue: account.length, jobworkissue: account } });
      });
    } else if (masterDetails === 'jobworkreceive') {
      Jobworkreceive.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_jobworkreceive: account.length, jobworkreceive: account } });
      });
    } else if (masterDetails === 'materialin') {
      Materialin.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_materialin: account.length, materialin: account } });
      });
    } else if (masterDetails === 'materialsout') {
      Materialsout.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_materialsout: account.length, materialsout: account } });
      });
    }
    else if (masterDetails === 'stockitem') {
      Stockitem.find({ userId: adminApiKey }, function (err, account) {
        return res
          .status(httpStatus.OK)
          .send({ success: true, accountType: { total_stockitem: account.length, stockitem: account } });
      });
    }
    else {
      return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'Wrong Account Type' });
    }
  });
});

module.exports = {
  accountJson,
  getaccount,
};
