const express = require("express");
const router  = express.Router();

const {
  createEvent,
  getEvents,
  getPendingEvents,
  approveEvent,
  rejectEvent,
} = require("./event.controller");

router.post("/",            createEvent);
router.get("/",             getEvents);
router.get("/approved",     getEvents);        // ← BrowseEvents ke liye
router.get("/pending",      getPendingEvents); // ← Faculty ke liye
router.put("/:id/approve",  approveEvent);
router.put("/:id/reject",   rejectEvent);

module.exports = router;