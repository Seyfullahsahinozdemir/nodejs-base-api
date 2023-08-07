const express = require("express");
const router = express.Router();

const {
  findAll,
  addRole,
  updateRole,
  deleteRole,
  rolePrivileges,
} = require("../controllers/roles");

router.get("/", findAll);
router.post("/add", addRole);
router.put("/update/:_id", updateRole);
router.delete("/delete/:_id", deleteRole);
router.get("/rolePrivileges", rolePrivileges);

module.exports = router;
