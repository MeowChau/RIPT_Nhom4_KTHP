const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const gymRoutes = require('./routes/gym');
const memberRoutes = require('./routes/member');
const personalTrainerRoutes = require('./routes/personalTrainer');

const reportRoutes = require('./routes/report');
const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercise');  
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/aiRoutes');
const app = express();

// Bổ sung đoạn này để tăng giới hạn payload JSON và URL encoded lên 20MB
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Middleware
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://nminhchaudev:nminhchaudev@cluster0.dohl7d1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/gyms', gymRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/personalTrainers', personalTrainerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes); // Giữ lại dòng này
app.use('/api/exercises', exerciseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);



 
module.exports = app;