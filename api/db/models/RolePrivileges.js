const Sequelize = require("sequelize");
const sequelize = require("../Database");
const Roles = require("./Roles");

const RolePrivileges = sequelize.define("role-privileges", {
  permission: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.STRING,
  },
});

Roles.hasOne(RolePrivileges, { foreignKey: "roleId" });

module.exports = RolePrivileges;
