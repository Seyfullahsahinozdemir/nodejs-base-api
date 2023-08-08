const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require("../db/models/Users");
const UserRoles = require("../db/models/UserRoles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");
const config = require("../config");
const CustomError = require("./Error");
const { HTTP_CODES } = require("../config/Enum");
const privs = require("../config/rolePrivileges");

module.exports = function () {
  let strategy = new Strategy(
    {
      secretOrKey: config.JWT.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        let user = await Users.findOne({ where: { id: payload.id } });

        if (user) {
          let userRoles = await UserRoles.findAll({ userId: payload.id });

          let rolePrivileges = await RolePrivileges.findAll({
            where: { roleId: userRoles.map((ur) => ur.roleId) },
          });

          let privileges = rolePrivileges.map((rp) =>
            privs.Privileges.find((x) => x.Key == rp.permission)
          );

          done(null, {
            id: user.id,
            roles: privileges,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            exp: parseInt(Date.now() / 1000) * config.JWT,
          });
        } else {
          done(new Error("User Not Found", null));
        }
      } catch (error) {
        done(error, null);
      }
    }
  );

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", { session: false });
    },
    checkRoles: (...expectedRoles) => {
      return (req, res, next) => {
        let i = 0;
        let privileges = req.user.roles.map((x) => x.Key);
        while (
          i < expectedRoles.length &&
          !privileges.includes(expectedRoles[i])
        )
          i++;

        if (i >= expectedRoles.length) {
          // error
          let response = Response.errorResponse(
            new CustomError(
              HTTP_CODES.UNAUTHORIZED,
              "Need Permission",
              "Need Permission"
            )
          );
          return res.status(response.code).json(response);
        }
        return next(); // authorized
      };
    },
  };
};
