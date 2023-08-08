const express = require("express");
const router = express.Router();
const auth = require("../lib/auth")();

const {
  findAll,
  addRole,
  updateRole,
  deleteRole,
  rolePrivileges,
} = require("../controllers/roles");

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});
router.get("/", /*auth.checkRoles("role_view"),*/ findAll);
router.post("/add", /*auth.checkRoles("role_add"),*/ addRole);
router.put("/update/:_id", /*auth.checkRoles("role_update"),*/ updateRole);
router.delete("/delete/:_id", /*auth.checkRoles("role_delete"),*/ deleteRole);
router.get("/rolePrivileges", rolePrivileges);

module.exports = router;
