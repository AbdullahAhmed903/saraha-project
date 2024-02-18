import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";
import { asynchandler } from "../services/asynchandler.js";
export const roles = {
  Admin: "admin",
  User: "user",
  HR: "HR",
};
export const auth = (accessRoles = []) => {
  return asynchandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BearerKey)) {
      next(Error("In-valid Bearer key", { cause: 400 }));
    } else {
      const token = authorization.split(process.env.BearerKey)[1];
      const decoded = jwt.verify(token, process.env.AUTHTOKEN);
      if (!decoded?._id || !decoded.isLoggedIn == true) {
        next(Error("In-valid token payload", { cause: 400 }));
      } else {
        const user = await userModel
          .findOne({ _id: decoded._id || isdeleted == false })
          .select("email userName Role isdeleted");
        if (!user) {
          next(Error("in-valid user", { cause: 404 }));
        } else {
          if (!accessRoles.includes(user.Role)) {
            next(new Error("Not Auth user", { cause: 403 }));
          } else {
            req.user = user;
            next();
          }
        }
      }
    }
  });
};
