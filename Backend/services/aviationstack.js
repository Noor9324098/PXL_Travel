const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const axios = require("axios");

const aviationstack = axios.create({
  baseURL: "https://api.aviationstack.com/v1",
  params: {
    access_key: process.env.AVIATIONSTACK_API_KEY,
  },
});

async function getAirports(params = {}) {
  const res = await aviationstack.get("/airports", { params });
  return res.data;
}

async function getFlights(params = {}) {
  const res = await aviationstack.get("/flights", { params });
  return res.data;
}

async function getRoutes(params = {}) {
  const res = await aviationstack.get("/routes", { params });
  return res.data;
}

async function getTimetable(params = {}) {
  const res = await aviationstack.get("/timetable", { params });
  return res.data;
}

module.exports = {
  getAirports,
  getFlights,
  getRoutes,
  getTimetable,
};
