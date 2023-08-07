const Sequelize = require("sequelize");
const sequelize = require("../Database");

const AuditLogs = sequelize.define("audit_logs", {
  level: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.STRING,
  },
  procType: {
    type: Sequelize.STRING,
  },
  log: {
    type: Sequelize.JSON,
  },
});

module.exports = AuditLogs;
