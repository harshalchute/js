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
    partyname: {
      type: String,
    },
    narration: {
      type: String,
    },
    inventorydetail: [
      {
        stockitemname: {
          type: String,
        },
        quantity: {
          type: String,
        },
        rate: {
          type: String,
        },
        billamount: {
          type: Number,
        },
        batchdetail: [
          {
            godownname: {
              type: String,
            },
            batchname: {
              type: String,
            },
            quantity: {
              type: Number,
            },
            rate: {
              type: String,
            },
            billamount: {
              type: Number,
            },
            orderno: {
              type: String,
            },
            trackingno: {
              type: String,
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
const transactionalRejectionout = mongoose.model('transactional_rejectionout', userSchema);

module.exports = transactionalRejectionout;
