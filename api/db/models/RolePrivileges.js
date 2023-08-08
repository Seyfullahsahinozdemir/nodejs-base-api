const Sequelize = require("sequelize");
const sequelize = require("../Database");

const RolePrivileges = sequelize.define("role-privileges", {
  permission: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.STRING,
  },
});

module.exports = RolePrivileges;
