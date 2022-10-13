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
    vouchername: {
      type: String,
      trim: true,
    },
    parent: {
      type: String,
    },
    abbreviation: {
      type: String,
    },
    numberingmethod: {
      type: String,
    },
    effectivedate: {
      type: String,
    },
    IsOptionalByDefault: {
      type: String,
    },
    allownarration: {
      type: String,
    },
    providemultinarration: {
      type: String,
    },
    defaultallocation: {
      type: String,
    },
    printaftersave: {
      type: String,
    },
    useforpos: {
      type: String,
    },
    defaultbank: {
      type: String,
    },
    defaultjurisdiction: {
      type: String,
    },
    restartlist: [
      {
        restartdate: {
          type: String,
          required: true,
        },
        beginingnumber: {
          type: Number,
          required: true,
        },
        particulers: {
          type: String,
          required: true,
        },
      },
    ],
    prefixlist: [
      {
        prefixname: {
          type: String,
        },
        prefixdate: {
          type: String,
        },
      },
    ],
    suffixlist: [
      {
        suffixname: {
          type: String,
        },
        suffixdate: {
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
const voucherType = mongoose.model('master_vouchertype', userSchema);

module.exports = voucherType;
