const router = require("express").Router();

const { findAll } = require("../controllers/auditLogs");

router.get("/", (req, res, next) => {
  res.json({
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers,
  });
});

module.exports = router;
