const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  from_place_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  to_place_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  class_of_service: {
    type: String,
    default: 'Non-AC',
  },
  via_places: {
    type: String,
    default: '---',
  },
  departure_time: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
