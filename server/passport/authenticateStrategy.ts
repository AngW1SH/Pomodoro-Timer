import { Strategy as JWTStrategy } from "passport-jwt";
import prisma from "../client";

const opts: any = {};
opts.jwtFromRequest = function (req) {
  let token = "";
  if (req && req.signedCookies) {
    token = req.signedCookies["pomonotes-access"];
  }
  return token;
};
opts.secretOrKey = process.env.TOKEN_SECRET;

const authenticateStrategy = new JWTStrategy(opts, function (
  jwt_payload,
  done
) {
  prisma.user
    .findFirst({
      where: {
        id: jwt_payload.id,
      },
    })
    .then((user) => {
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    });
});

export default authenticateStrategy;
