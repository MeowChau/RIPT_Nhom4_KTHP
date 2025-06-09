const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const gymRoutes = require('./routes/gym');
const memberRoutes = require('./routes/member');
const personalTrainerRoutes = require('./routes/personalTrainer');
const reportRoutes = require('./routes/report');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/aiRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const calorieRoutes = require('./routes/calorieRoutes');
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

// Cấu hình Multer cho việc upload ảnh (nếu cần)
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware xử lý ảnh (tùy chọn)
app.use('/api/exercises', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    upload.single('image')(req, res, function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: 'Lỗi khi upload ảnh'
        });
      }
      next();
    });
  } else {
    next();
  }
});

// Routes
app.use('/api/gyms', gymRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/personalTrainers', personalTrainerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes); // Giữ lại dòng này
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/calories', calorieRoutes);

module.exports = app;