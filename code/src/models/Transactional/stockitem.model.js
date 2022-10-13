const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');

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
    },
    partnumber: {
      type: String,
    },
    parent: {
      type: String,
    },
    category: {
      type: String,
    },
    baseuom: {
      type: String,
    },
    altuom: {
      type: String,
    },
    altconv: {
      type: String,
    },
    isbatchable: {
      type: String,
    },
    mgfdate: {
      type: String,
    },
    useexpirydate: {
      type: String,
    },
    enablecosttracking: {
      type: String,
    },
    gstapplicable: {
      type: String,
    },
    typeofgoods: {
      type: String,
    },
    valuemethod: {
      type: String,
    },
    ignorephysdiff: {
      type: String,
    },
    ignorenegative: {
      type: String,
    },
    salesasmfd: {
      type: String,
    },
    purcasconsumed: {
      type: String,
    },
    rejectasscrap: {
      type: String,
    },
    allowuseexpireditems: {
      type: String,
    },
    rateofduty: {
      type: String,
    },
    calcmrp: {
      type: String,
    },
    batchallocation: [
      {
        godownname: {
          type: String,
        },
        batchname: {
          type: String,
        },
        openingbal: {
          type: String,
        },
        openingrate: {
          type: String,
        },
        openingvalue: {
          type: String,
        },
      },
    ],
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
const transactionalStockitem = mongoose.model('transactional_stockitem', userSchema);

module.exports = transactionalStockitem;
