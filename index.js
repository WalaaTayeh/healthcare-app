require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mysqlConnection = require('./db/mysql');
const MedicalRecord = require('./models/medicalRecord.model');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const fileRoutes = require('./routes/file.routes');
const { verifyToken, checkRole } = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" })); 

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "user@example.com" && password === "password123") {
  
    const token = jwt.sign(
      { id: "someUserId", role: "Admin" }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token }); 
  } else {
    res.status(401).json({ message: "Invalid email or password" }); 
  }
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the Dashboard!" });
});

app.use(express.static(path.join(__dirname, "client/build")));


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

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.get('/api/medical-records', async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    console.log('Records retrieved:', records.length);
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching records:', err.message);
    res.status(500).json({ error: 'Error fetching records' });
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
