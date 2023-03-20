import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../models/userModel.js";
import "dotenv/config";

export default (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new Strategy(opts, async function (jwt_payload, done) {
      try {
        let checkUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (checkUser) {
          return done(null, checkUser);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
