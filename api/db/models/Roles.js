const Sequelize = require("sequelize");
const sequelize = require("../Database");

const Roles = sequelize.define("role", {
  role_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Roles;
