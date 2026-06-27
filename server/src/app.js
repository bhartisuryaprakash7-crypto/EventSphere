require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes        = require('./modules/auth/auth.routes');
const userRoutes        = require('./modules/users/user.routes');
const eventRoutes       = require('./modules/events/event.routes');
const registrationRoutes = require('./modules/registrations/registration.routes');
const attendanceRoutes  = require('./modules/attendance/attendance.routes');
const certificateRoutes = require('./modules/certificates/certificate.routes');
const feedbackRoutes    = require('./modules/feedback/feedback.routes');
const analyticsRoutes   = require('./modules/analytics/analytics.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const aiRoutes          = require('./modules/ai/ai.routes');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
// app.use(cors({
//   origin: [
//     process.env.CLIENT_URL,
//     'http://localhost:5173'
//   ],
//   credentials: true
// }));

app.use(cors({
  origin: [
    /\.vercel\.app$/,
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance',    attendanceRoutes);
app.use('/api/certificates',  certificateRoutes);
app.use('/api/feedback',      feedbackRoutes);
app.use('/api/analytics',     analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai',            aiRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ── Error Handling ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;