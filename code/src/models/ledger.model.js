const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');


const userSchema = mongoose.Schema(
  {

    guid: {
      type: String,
      required: true,
    },
    masterid: {
      type: Number,
      required: true,
    },
    alterid: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parent: {
      type: String,
      required: true,
    },
    grandparent: {
      type: String,
    },
    natureofgroup: {
      type: String,
    },
    currency: {
      type: String,
    },
    billbybill: {
      type: String,
    },
    inventoryeffected: {
      type: String,
    },
    costcentre: {
      type: String,
    },
    interestcalc: {
      type: String,
    },
    mailingname: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    mobilenumber: {
      type: Number,
    },
    gsttype: {
      type: String,
    },
    isecommerce: {
      type: String,
    },
    gstpartytype: {
      type: String,
    },
    gstnumber: {
      type: String,
    },
    openingbalance: {
      type: Number,
    },
    closingbalance: {
      type: Number,
    },
    creditperiod: {
      type: String,
    },
    creditdays: {
      type: String,
    },
    creditlimit: {
      type: Number,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
// userSchema.statics.isEmailTaken = async function (guid, excludeUserId) {
//   const user = await this.findOne({ guid, _id: { $ne: excludeUserId } });
//   return !!user;
// };

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef Member
 */
const ledger = mongoose.model('master_ledger', userSchema);

module.exports = ledger;
