// Black-box API tests for the PXL Travel backend.
// The unchanged Backend/server.js is started as a separate process against an
// in-memory MongoDB; every test talks to it over HTTP only (plus direct database
// reads where a stored value has to be checked, e.g. password hashing).
//
// Run:  cd tests/api && npm install && npm test   (requires Backend dependencies installed)

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient, ObjectId } = require("mongodb");

const SERVER_FILE = path.resolve(__dirname, "../../Backend/server.js");
const PORT = 39000 + Math.floor(Math.random() * 900);
const BASE = `http://127.0.0.1:${PORT}/api`;
const ADMIN_EMAIL = "admin@test.local";
const PASSWORD = "Test-Password-123";

let mongo;
let client;
let db;
let server;

function startServer(env) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [SERVER_FILE], { env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    const timer = setTimeout(() => reject(new Error(`server did not start:\n${output}`)), 30000);
    const onData = (chunk) => {
      output += chunk.toString();
      if (output.includes("Server running") && output.includes("MongoDB Connected")) {
        clearTimeout(timer);
        resolve(proc);
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.on("exit", (code) => reject(new Error(`server exited (${code}):\n${output}`)));
  });
}

async function api(method, route, { token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + route, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, body: json };
}

const signup = (email, full_name = "Test User") =>
  api("POST", "/auth/signup", { body: { email, password: PASSWORD, full_name } });

const validBooking = (overrides = {}) => ({
  flight_origin: "Budapest",
  flight_destination: "Debrecen",
  flight_date: "2026-12-15",
  passenger_first_name: "Anna",
  passenger_last_name: "Kovacs",
  phone_number: "+36301234567",
  transaction_number: "TX-0001",
  ...overrides,
});

before(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri("pxl_test");
  client = new MongoClient(uri);
  await client.connect();
  db = client.db("pxl_test");

  const env = {
    ...process.env,
    MONGODB_URI: uri,
    JWT_SECRET: "test-secret",
    ADMIN_EMAILS: ADMIN_EMAIL,
    PORT: String(PORT),
  };
  // External services are deliberately not configured in the test environment.
  delete env.GROQ_API_KEY;
  delete env.AVIATIONSTACK_API_KEY;
  server = await startServer(env);
});

after(async () => {
  if (server) {
    server.removeAllListeners("exit");
    server.kill();
  }
  if (client) await client.close();
  if (mongo) await mongo.stop();
});

// Shared state across the ordered test groups below.
const state = {};

describe("Authentication (task 6)", () => {
  test("T01 sign-up returns the user and a token, never the password", async () => {
    const res = await signup("alice@test.local", "Alice");
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, "alice@test.local");
    assert.equal(res.body.user.password, undefined);
    state.alice = res.body;
  });

  test("T02 the password is stored as a bcrypt hash, not in plain text", async () => {
    const user = await db.collection("users").findOne({ email: "alice@test.local" });
    assert.notEqual(user.password, PASSWORD);
    assert.match(user.password, /^\$2[aby]\$10\$/);
  });

  test("T03 a second sign-up with the same email is rejected", async () => {
    const res = await signup("alice@test.local");
    assert.equal(res.status, 400);
  });

  test("T04 sign-in with correct credentials returns a token", async () => {
    const res = await api("POST", "/auth/signin", { body: { email: "alice@test.local", password: PASSWORD } });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  test("T05 sign-in with a wrong password or unknown email is rejected with 401", async () => {
    const wrong = await api("POST", "/auth/signin", { body: { email: "alice@test.local", password: "nope" } });
    const unknown = await api("POST", "/auth/signin", { body: { email: "ghost@test.local", password: PASSWORD } });
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
  });

  test("T06 protected routes reject missing and invalid tokens", async () => {
    const missing = await api("GET", "/bookings");
    const invalid = await api("GET", "/bookings", { token: "not-a-jwt" });
    assert.equal(missing.status, 401);
    assert.equal(missing.body.error, "No token provided");
    assert.equal(invalid.status, 401);
    assert.equal(invalid.body.error, "Invalid token");
  });
});

describe("Bookings (task 8)", () => {
  test("T07 an authenticated user can create a booking; it starts as pending", async () => {
    const res = await api("POST", "/bookings", { token: state.alice.token, body: validBooking() });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "pending");
    assert.equal(res.body.user_id, state.alice.user.id);
    state.aliceBooking = res.body;
  });

  test("T08 a booking without a required field is rejected", async () => {
    const body = validBooking();
    delete body.passenger_last_name;
    const res = await api("POST", "/bookings", { token: state.alice.token, body });
    assert.equal(res.status, 400);
  });

  test("T09 users only see their own bookings", async () => {
    state.bob = (await signup("bob@test.local", "Bob")).body;
    await api("POST", "/bookings", { token: state.bob.token, body: validBooking({ transaction_number: "TX-BOB" }) });
    const alice = await api("GET", "/bookings", { token: state.alice.token });
    const bob = await api("GET", "/bookings", { token: state.bob.token });
    assert.equal(alice.body.length, 1);
    assert.equal(bob.body.length, 1);
    assert.equal(bob.body[0].transaction_number, "TX-BOB");
  });
});

describe("Administration (task 9)", () => {
  test("T10 regular users are refused admin endpoints with 403", async () => {
    const bookings = await api("GET", "/admin/bookings", { token: state.alice.token });
    const users = await api("GET", "/users", { token: state.alice.token });
    assert.equal(bookings.status, 403);
    assert.equal(users.status, 403);
  });

  test("T11 an administrator sees all bookings with the booking user's name and email", async () => {
    state.admin = (await signup(ADMIN_EMAIL, "Admin")).body;
    const res = await api("GET", "/admin/bookings", { token: state.admin.token });
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    for (const b of res.body) {
      assert.ok(b.user_id.email);
      assert.ok(b.user_id.full_name);
    }
  });

  test("T12 status changes accept only pending, booked or cancelled", async () => {
    const id = state.aliceBooking._id;
    const bad = await api("PATCH", `/admin/bookings/${id}/status`, { token: state.admin.token, body: { status: "paid" } });
    const good = await api("PATCH", `/admin/bookings/${id}/status`, { token: state.admin.token, body: { status: "booked" } });
    assert.equal(bad.status, 400);
    assert.equal(good.status, 200);
    assert.equal(good.body.status, "booked");
  });

  test("T13 an administrator can edit booking details", async () => {
    const id = state.aliceBooking._id;
    const res = await api("PUT", `/admin/bookings/${id}`, { token: state.admin.token, body: { flight_destination: "Pecs" } });
    assert.equal(res.status, 200);
    assert.equal(res.body.flight_destination, "Pecs");
  });

  test("T14 an administrator can create a booking for an existing user only", async () => {
    const ok = await api("POST", "/admin/bookings", {
      token: state.admin.token,
      body: validBooking({ user_id: state.bob.user.id, transaction_number: "TX-ADMIN" }),
    });
    const missingUser = await api("POST", "/admin/bookings", {
      token: state.admin.token,
      body: validBooking({ user_id: new ObjectId().toString() }),
    });
    assert.equal(ok.status, 200);
    assert.equal(missingUser.status, 404);
    state.adminBooking = ok.body;
  });

  test("T15 an administrator can delete a booking; deleting it again gives 404", async () => {
    const id = state.adminBooking._id;
    const first = await api("DELETE", `/admin/bookings/${id}`, { token: state.admin.token });
    const second = await api("DELETE", `/admin/bookings/${id}`, { token: state.admin.token });
    assert.equal(first.status, 200);
    assert.equal(second.status, 404);
  });

  test("T16 the user list for administrators does not expose password hashes", async () => {
    const res = await api("GET", "/users", { token: state.admin.token });
    assert.equal(res.status, 200);
    assert.ok(res.body.length >= 3);
    for (const u of res.body) assert.equal(u.password, undefined);
  });

  test("T17 only a super administrator can grant admin rights", async () => {
    const target = `/users/${state.bob.user.id}/admin`;
    const denied = await api("PUT", target, { token: state.admin.token, body: { is_admin: true } });
    assert.equal(denied.status, 403);

    await db.collection("users").updateOne({ email: ADMIN_EMAIL }, { $set: { is_super_admin: true } });
    const allowed = await api("PUT", target, { token: state.admin.token, body: { is_admin: true } });
    assert.equal(allowed.status, 200);
    assert.equal(allowed.body.is_admin, true);
    assert.equal(allowed.body.password, undefined);
  });
});

describe("Local flights and urban transportation (task 7)", () => {
  const flight = (date, time) => ({
    origin: "Budapest",
    destination: "Debrecen",
    airline: "Test Air",
    departure_time: time,
    arrival_time: "23:00",
    flight_date: date,
    price: 19990,
    duration: "50m",
    available_seats: 40,
  });

  test("T18 only administrators can add local flights", async () => {
    const denied = await api("POST", "/local-flights", { token: state.alice.token, body: flight("2026-12-20", "08:00") });
    const later = await api("POST", "/local-flights", { token: state.admin.token, body: flight("2026-12-20", "08:00") });
    const earlier = await api("POST", "/local-flights", { token: state.admin.token, body: flight("2026-12-10", "09:30") });
    assert.equal(denied.status, 403);
    assert.equal(later.status, 200);
    assert.equal(earlier.status, 200);
  });

  test("T19 local flights are public and sorted by date", async () => {
    const res = await api("GET", "/local-flights");
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.ok(new Date(res.body[0].flight_date) <= new Date(res.body[1].flight_date));
  });

  test("T20 urban transport: admin can add, incomplete data is rejected, listing is public", async () => {
    const trip = {
      route_name: "Line 1",
      origin: "Pecs Center",
      destination: "Pecs University",
      transport_type: "bus",
      departure_time: "07:15",
      arrival_time: "07:35",
      trip_date: "2026-12-01",
      price: 450,
      duration: "20m",
    };
    const ok = await api("POST", "/urban-transportation", { token: state.admin.token, body: trip });
    const incomplete = await api("POST", "/urban-transportation", {
      token: state.admin.token,
      body: { ...trip, transport_type: undefined },
    });
    const list = await api("GET", "/urban-transportation");
    assert.equal(ok.status, 200);
    assert.equal(incomplete.status, 400);
    assert.equal(list.status, 200);
    assert.equal(list.body.length, 1);
  });
});

describe("External integrations without credentials (tasks 7, 10)", () => {
  test("T21 the chat endpoint reports a missing Groq API key", async () => {
    const res = await api("POST", "/chat", { body: { messages: [{ role: "user", content: "Hi" }] } });
    assert.equal(res.status, 500);
    assert.match(res.body.error, /GROQ_API_KEY/);
  });

  test("T22 flight search validates its parameters and reports a missing API key", async () => {
    const missingParams = await api("GET", "/aviationstack/search-flights");
    const noKey = await api("GET", "/aviationstack/search-flights?dep_iata=BUD&arr_iata=DEB");
    assert.equal(missingParams.status, 400);
    assert.equal(noKey.status, 500);
    assert.match(noKey.body.error, /AVIATIONSTACK_API_KEY/);
  });
});
