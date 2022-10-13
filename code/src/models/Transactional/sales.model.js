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
      type: String,
    },
    voucherdate: {
      type: String,
    },
    referenceno: {
      type: Number,
    },
    referencedate: {
      type: String,
    },
    ledgername: {
      type: String,
    },
    ledgeraddress: {
      type: String,
    },
    ledgerphone: {
      type: Number,
    },
    ledgerfax: {
      type: String,
    },
    ledgerpincode: {
      type: String,
    },
    ledgerstate: {
      type: String,
    },
    ledgertin: {
      type: String,
    },
    ledgergst: {
      type: String,
    },
    buyername: {
      type: String,
    },
    buyeraddress: {
      type: String,
    },
    consigneename: {
      type: String,
    },
    consigneeaddress: {
      type: String,
    },
    placeofreciept: {
      type: String,
    },
    vesselflieghtno: {
      type: String,
    },
    portoflanding: {
      type: String,
    },
    portofdischarge: {
      type: String,
    },
    countryto: {
      type: String,
    },
    narration: {
      type: String,
    },
    costcentre: {
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
        taxtype: {
          type: String,
        },
        taxrate: {
          type: String,
        },
        dutytype: {
          type: String,
        },
      },
    ],
    invdetail: [
      {
        stockname: {
          type: String,
        },
        actualqty: {
          type: String,
        },
        stockbilledqty: {
          type: String,
        },
        currencysymbol: {
          type: String,
        },
        currencyname: {
          type: String,
        },
        currencyrate: {
          type: String,
        },
        stockrate: {
          type: String,
        },
        stockdiscount: {
          type: String,
        },
        amount: {
          type: Number,
        },
        ordernumber: {
          type: String,
        },
        deliverynotenumber: {
          type: String,
        },
        hsncode: {
          type: String,
        },
        igstrate: {
          type: Number,
        },
        cgstrate: {
          type: Number,
        },
        sgstrate: {
          type: Number,
        },
        cessrate: {
          type: Number,
        },
        batch: [
          {
            godownname: {
              type: String,
            },
            batchname: {
              type: String,
            },
            batchqty: {
              type: Number,
            },
            batchrate: {
              type: Number,
            },
            batchamount: {
              type: Number,
            },
          },
        ],
        accountingalocation: [
          {
            ledgername: {
              type: String,
            },
            parent: {
              type: String,
            },
            amount: {
              type: Number,
            },
          },
        ],
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
const transactionalSales = mongoose.model('transactional_sales', userSchema);

module.exports = transactionalSales;
