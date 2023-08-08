const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require("../db/models/Users");
const UserRoles = require("../db/models/UserRoles");
const RolePrivileges = require("../db/models/RolePrivileges");

const config = require("../config");

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
          let userRoles = await UserRoles.findAll({
            where: { id: payload.id },
          });
          let rolePrivileges = await RolePrivileges.findAll({
            where: { roleId: userRoles.map((ur) => ur.roleId) },
          });

          done(null, {
            id: user.id,
            roles: rolePrivileges,
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
  };
};
