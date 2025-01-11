require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mysqlConnection = require('./db/mysql');
const MedicalRecord = require('./models/medicalRecord.model');
const authRoutes = require('./routes/auth.routes'); // Authentication routes
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const fileRoutes = require('./routes/file.routes');
const { verifyToken, checkRole } = require('./middleware/auth.middleware'); // Auth middleware

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

mysqlConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database.');
  }
});

app.get('/api/medical-records', async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching records.', details: err.message });
  }
});

app.post('/api/medical-records', async (req, res) => {
  try {
    const newRecord = new MedicalRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(400).json({ error: 'Error creating record.', details: err.message });
  }
});

app.patch('/api/medical-records/:id', async (req, res) => {
  try {
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: 'Error updating record.', details: err.message });
  }
});

app.delete('/api/medical-records/:id', async (req, res) => {
  try {
    const deletedRecord = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    res.status(200).json({ message: 'Record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting record.', details: err.message });
  }
});

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/user', userRoutes);

app.use('/api/appointments', appointmentRoutes);

app.use('/api/files', fileRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/admin', verifyToken, checkRole(['Admin']), (req, res) => {
  res.send('Welcome, Admin!');
});

app.get('/api/doctor', verifyToken, checkRole(['Doctor']), (req, res) => {
  res.send('Welcome, Doctor!');
});

app.get('/api/patient', verifyToken, checkRole(['Patient']), (req, res) => {
  res.send('Welcome, Patient!');
});

app.get('/', (req, res) => {
  res.send('Hello, Healthcare App!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
