const router = require("express").Router();
const auth = require("../lib/auth")();
const { findAll } = require("../controllers/auditLogs");

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});
router.post("/", auth.checkRoles("auditlogs_view"), findAll);

module.exports = router;
