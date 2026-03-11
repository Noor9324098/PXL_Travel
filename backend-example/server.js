// Example Backend Server (Node.js/Express)
// This is a template - you'll need to implement the full backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String, // Hashed
  full_name: String,
  phone: String,
  is_admin: { type: Boolean, default: false },
  is_super_admin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight_origin: { type: String, required: true },
  flight_destination: { type: String, required: true },
  flight_date: { type: Date, required: true },
  passenger_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  passport_image_url: String,
  transaction_number: { type: String, required: true },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const localFlightSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  airline: { type: String, required: true },
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  flight_date: { type: Date, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  available_seats: { type: Number, default: 0 },
  description: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const urbanTransportSchema = new mongoose.Schema({
  route_name: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  transport_type: { type: String, required: true },
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  trip_date: { type: Date, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  available_seats: { type: Number, default: 0 },
  description: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const LocalFlight = mongoose.model('LocalFlight', localFlightSchema);
const UrbanTransport = mongoose.model('UrbanTransport', urbanTransportSchema);

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, full_name });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ user: { id: user._id, email: user.email, full_name: user.full_name }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ user: { id: user._id, email: user.email, full_name: user.full_name }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bookings Routes
app.get('/api/bookings', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user._id }).sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', authenticate, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, user_id: req.user._id });
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Local Flights Routes
app.get('/api/local-flights', async (req, res) => {
  try {
    const flights = await LocalFlight.find().sort({ flight_date: 1, departure_time: 1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/local-flights', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.is_admin && !req.user.is_super_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const flight = new LocalFlight(req.body);
    await flight.save();
    res.json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Urban Transportation Routes
app.get('/api/urban-transportation', async (req, res) => {
  try {
    const transports = await UrbanTransport.find().sort({ trip_date: 1, departure_time: 1 });
    res.json(transports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/urban-transportation', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.is_admin && !req.user.is_super_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const transport = new UrbanTransport(req.body);
    await transport.save();
    res.json(transport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Users Routes (Admin only)
app.get('/api/users', authenticate, async (req, res) => {
  try {
    if (!req.user.is_super_admin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }
    const users = await User.find().select('-password').sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id/admin', authenticate, async (req, res) => {
  try {
    if (!req.user.is_super_admin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_admin: req.body.is_admin },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

