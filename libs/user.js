
const mongoose = require('mongoose');

// uniqueValidator validation is not atomic! unsafe!
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: "Такой -id- существует"

      },
  name: {
    type: String,
    unique: "Такой -name- существует"
  },
  email: {
    type: String,
    required: "E-mail пользователя не должен быть пустым.",
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        msg:       'Некорректный email.'
      }
    ],
    unique: "Такой EMAIL уже существует"
  },
  phone: {
    type: String
  },

}, {
  timestamps: false,
  /* @see mongoose
  toObject: {
    transform(doc, ret) {
      // remove the __v of every document before returning the result
      delete ret.__v;
      return ret;
    }
  }*/
});

userSchema.statics.publicFields1 = ['id', 'name', 'email', 'phone' ];


module.exports = mongoose.model('User', userSchema);
