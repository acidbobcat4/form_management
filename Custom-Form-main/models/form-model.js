const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  metadata: { type: Object, default: {} }
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
