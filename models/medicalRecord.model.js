const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientName: { type: String, required: true, index: true },
  age: { type: Number, required: true },
  condition: { type: String, required: true },
  prescription: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
