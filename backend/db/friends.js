const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  password:{
    type:String,
    required:true,
    trim:true
  },
  friends: {
    type: [String], // Array of strings for dynamic friends names
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0; // Ensure at least one friend is added
      },
      message: "At least one friend must be added"
    }
  },
  place: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Group', groupSchema);
