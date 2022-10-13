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
    IsOptional: {
      type: String,
    },
    vouchertype: {
      type: String,
      trim: true,
    },
    vouchertypename: {
      type: String,
    },
    voucherno: {
      type: Number,
    },
    voucherdate: {
      type: String,
    },
    narration: {
      type: String,
    },
    ledgerdetail: [
      {
        ledgername: {
          type: String,
        },
        ispartyledger: {
          type: String,
        },
        amount: {
          type: Number,
        },
        instrument: {
          type: String,
        },
        billdetail: [
          {
            billguid: {
              type: String,
            },
            billref: {
              type: String,
            },
            billtype: {
              type: String,
            },
            billamount: {
              type: Number,
            },
          },
        ],
        trantype: {
          type: String,
        },
        date: {
          type: String,
        },
        favouring: {
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
const transactionalReceipt = mongoose.model('transactional_receipt', userSchema);

module.exports = transactionalReceipt;
