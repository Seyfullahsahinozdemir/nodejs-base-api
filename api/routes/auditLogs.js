const router = require("express").Router();

const { findAll } = require("../controllers/auditLogs");

router.post("/", findAll);

module.exports = router;
