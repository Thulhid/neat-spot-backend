const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Service must have a name"],
    unique: true,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
