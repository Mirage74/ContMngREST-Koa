const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: "this id already exist !"

      },
  name: {
    type: String,
    unique: "this name already exist !"
  },
  email: {
    type: String,
    required: "E-mail can't be empty",
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        msg:       'incorrect email.'
      }
    ],
    unique: "this EMAIL already exist"
  },
  phone: {
    type: String
  },

}, {
  timestamps: false,
  /* @see mongoose
  toObject: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }*/
});

userSchema.statics.publicFields1 = ['id', 'name', 'email', 'phone' ];


module.exports = mongoose.model('User', userSchema);
