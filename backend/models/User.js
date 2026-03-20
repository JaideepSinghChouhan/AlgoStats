const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },

    // Codeforces
    cfHandle: { type: String, default: '' },
    cfRating: { type: Number, default: 0 },
    cfMaxRating: { type: Number, default: 0 },
    cfSolved: { type: Number, default: 0 },

    // LeetCode
    lcHandle: { type: String, default: '' },
    lcContestRating: { type: Number, default: 0 },
    lcSolved: { type: Number, default: 0 },

    // CodeChef
    ccHandle: { type: String, default: '' },
    ccRating: { type: Number, default: 0 },
    ccSolved: { type: Number, default: 0 },

    // AtCoder
    acHandle: { type: String, default: '' },
    acRating: { type: Number, default: 0 },
    acSolved: { type: Number, default: 0 },

    // Computed score
    score: { type: Number, default: 0 },

    // Last stats update
    lastUpdated: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
