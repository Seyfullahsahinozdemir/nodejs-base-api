const AuditLogs = require("../db/models/AuditLogs");
const Response = require("../lib/Response");
const { Op } = require("sequelize");
const moment = require("moment");

exports.findAll = async (req, res, next) => {
  try {
    let body = req.body;
    let query = {};

    let skip = body.skip;
    let limit = body.limit;

    if (typeof body.skip !== "number") {
      skip = 0;
    }

    if (typeof body.limit !== "number" || body.limit > 500) {
      limit = 500;
    }

    if (body.beginDate && body.endDate) {
      query.createdAt = {
        [Op.between]: [moment(body.beginDate), moment(body.endDate)],
      };
    } else {
      query.createdAt = {
        [Op.between]: [moment().subtract(1, "day").startOf("day"), moment()],
      };
    }

    let auditLogs = await AuditLogs.findAll({
      where: query,
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: skip,
    });
    res.json(Response.successResponse(auditLogs));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};
