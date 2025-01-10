// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());

// // Test Route
// app.get('/', (req, res) => {
//   res.send('Hello, Healthcare App!');
// });

// // Debugging: Log the MongoDB URI
// console.log('Mongo URI:', process.env.MONGO_URI);

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.log('Connection failed', err));



// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());

// // Routes
// const medicalRecordsRoutes = require('./routes/medicalRecords.routes');
// const notificationsRoutes = require('./routes/notifications.routes');

// app.use('/api/medical-records', medicalRecordsRoutes);
// app.use('/api/notifications', notificationsRoutes);

// // MongoDB Connection
// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//         console.log('Connected to MongoDB Atlas');
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     })
//     .catch((err) => console.log('Database connection failed:', err));


// Required Modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import Models and Middleware
const MedicnodealRecord = require('./models/medicalRecord.model');
const authRoutes = require('./routes/auth.routes'); // Authentication routes
const { verifyToken, checkRole } = require('./middleware/auth.middleware'); // Auth middleware

// Set up the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON data
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('Connection failed', err));

// Routes for Medical Records

// GET /api/medical-records
app.get('/api/medical-records', async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching records.', details: err.message });
  }
});

// POST /api/medical-records
app.post('/api/medical-records', async (req, res) => {
  try {
    const newRecord = new MedicalRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(400).json({ error: 'Error creating record.', details: err.message });
  }
});

// PATCH /api/medical-records/:id
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

// DELETE /api/medical-records/:id
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

// Authentication Routes
console.log('Auth Routes:', authRoutes);
app.use('/api/auth', authRoutes);

// Example Protected Routes
app.get('/api/admin', verifyToken, checkRole(['Admin']), (req, res) => {
  res.send('Welcome, Admin!');
});

app.get('/api/doctor', verifyToken, checkRole(['Doctor']), (req, res) => {
  res.send('Welcome, Doctor!');
});

app.get('/api/patient', verifyToken, checkRole(['Patient']), (req, res) => {
  res.send('Welcome, Patient!');
});

// Test Route
app.get('/', (req, res) => {
  res.send('Hello, Healthcare App!');
});


const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');

// Admin Routes
app.use('/api/admin', adminRoutes);

// Doctor and Patient Routes
app.use('/api/user', userRoutes);


const appointmentRoutes = require('./routes/appointment.routes');

// Appointment Routes
app.use('/api/appointments', appointmentRoutes);

const path = require('path');

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const fileRoutes = require('./routes/file.routes');
app.use('/api/files', fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.', details: err.message });
});


