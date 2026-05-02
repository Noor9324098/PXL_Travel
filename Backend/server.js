// Example Backend Server (Node.js/Express)
// This is a template - you'll need to implement the full backend

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const { getAirports } = require("./services/aviationstack");
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Missing MONGODB_URI environment variable. Please set it in backend-example/.env",
  );
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

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
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight_origin: { type: String, required: true },
  flight_destination: { type: String, required: true },
  flight_date: { type: Date, required: true },
  passenger_first_name: { type: String, required: true },
  passenger_last_name:{type: String, required: true},
  phone_number: { type: String, required: true },
  passport_image_url: String,
  transaction_number: { type: String, required: true },
  status: { type: String, default: "pending" },
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

const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const LocalFlight = mongoose.model("LocalFlight", localFlightSchema);
const UrbanTransport = mongoose.model("UrbanTransport", urbanTransportSchema);

const configuredAdminEmails = (process.env.ADMIN_EMAILS || "admin@pxltravel.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const hasAdminAccess = (user) => {
  if (!user) return false;

  const email = typeof user.email === "string" ? user.email.toLowerCase() : "";

  return Boolean(
    user.is_admin ||
      user.is_super_admin ||
      (email && configuredAdminEmails.includes(email)),
  );
};

const requireAdmin = (req, res, next) => {
  if (!hasAdminAccess(req.user)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ error: "User not found" });
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, full_name });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "my-secret-key",
    );
    res.json({
      user: { id: user._id, email: user.email, full_name: user.full_name },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "my-secret-key",
    );
    res.json({
      user: { id: user._id, email: user.email, full_name: user.full_name },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bookings Routes
app.get("/api/bookings", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user._id }).sort({
      created_at: -1,
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/bookings", authenticate, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, user_id: req.user._id });
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Bookings Routes
app.get("/api/admin/bookings", authenticate, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user_id", "full_name email")
      .sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/bookings", authenticate, requireAdmin, async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const booking = new Booking(req.body);
    await booking.save();
    await booking.populate("user_id", "full_name email");

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/admin/bookings/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const allowedFields = [
      "user_id",
      "flight_origin",
      "flight_destination",
      "flight_date",
      "passenger_first_name",
      "passenger_last_name",
      "phone_number",
      "transaction_number",
      "status",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    updates.updated_at = new Date();

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("user_id", "full_name email");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch(
  "/api/admin/bookings/:id/status",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = ["pending", "booked", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        });
      }

      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status, updated_at: new Date() },
        { new: true, runValidators: true },
      ).populate("user_id", "full_name email");

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

app.delete(
  "/api/admin/bookings/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const booking = await Booking.findByIdAndDelete(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json({ success: true, id: req.params.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Local Flights Routes
app.get("/api/local-flights", async (req, res) => {
  try {
    const flights = await LocalFlight.find().sort({
      flight_date: 1,
      departure_time: 1,
    });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/local-flights", authenticate, async (req, res) => {
  try {
    if (!hasAdminAccess(req.user)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const flight = new LocalFlight(req.body);
    await flight.save();
    res.json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Urban Transportation Routes
app.get("/api/urban-transportation", async (req, res) => {
  try {
    const transports = await UrbanTransport.find().sort({
      trip_date: 1,
      departure_time: 1,
    });
    res.json(transports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/urban-transportation", authenticate, async (req, res) => {
  try {
    if (!hasAdminAccess(req.user)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const transport = new UrbanTransport(req.body);
    await transport.save();
    res.json(transport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Users Routes (Admin only)
app.get("/api/users", authenticate, async (req, res) => {
  try {
    if (!hasAdminAccess(req.user)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const users = await User.find()
      .select("full_name email is_admin is_super_admin created_at")
      .sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/users/:id/admin", authenticate, async (req, res) => {
  try {
    if (!req.user.is_super_admin) {
      return res.status(403).json({ error: "Super admin access required" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_admin: req.body.is_admin },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// AI Chat endpoint (Groq proxy, OpenAI-compatible)
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server' });
    }

    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: groqModel,
        messages: [
          {
            role: 'system',
            content:
              "You are PXL Travel's helpful AI assistant. Give short, clear answers about flights, local and urban transportation, and how to use the PXL website. If the question is unrelated, briefly steer back to travel help.",
          },
          ...messages,
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a reply. Please try again.";

    res.json({ reply });
  } catch (error) {
    console.error('OpenAI /api/chat error:', error.response?.data || error.message || error);
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'Unexpected error while talking to the AI.';
    res.status(500).json({ error: message });
  }
});

//FlightSearch

app.get("/api/aviationstack/search-flights", async (req, res) => {
  try {
    const { dep_iata, arr_iata,/* date*/ } = req.query;

    if (!dep_iata || !arr_iata /*|| !date*/) {
      return res.status(400).json({
        error: "dep_iata, arr_iata, and date are required",
      });
    }

    const apiKey = process.env.AVIATIONSTACK_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "AVIATIONSTACK_API_KEY is not configured on the server",
      });
    }

   const response = await axios.get("https://api.aviationstack.com/v1/flights", {
  params: {
    access_key: apiKey,
    dep_iata,
    arr_iata,
    limit: 20,
  },
});

    const rawFlights = response.data?.data || [];

    const mappedFlights = rawFlights.map((item) => ({
      id: item.flight?.iata || `${item.flight_date}-${item.flight?.number || Math.random()}`,
      origin: item.departure?.airport || item.departure?.iata || "Unknown",
      destination: item.arrival?.airport || item.arrival?.iata || "Unknown",
      date: item.flight_date || "",
      airline: item.airline?.name || "Unknown Airline",
      duration: "N/A",
      price: "Contact agency",
      departureTime: item.departure?.scheduled || "",
      arrivalTime: item.arrival?.scheduled || "",
      status: item.flight_status || "unknown",
    }));

    res.json(mappedFlights);
  } catch (error) {
    console.error(
      "aviationstack /search-flights error:",
      error.response?.data || error.message || error
    );

    const apiError = error.response?.data?.error;

    res.status(error.response?.status || 500).json({
      error:
        apiError?.message ||
        "Unable to fetch flights from aviationstack",
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
