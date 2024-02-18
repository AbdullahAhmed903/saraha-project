import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";
const authRouter = Router();
import * as router from "./controller/auth.con.js";
import { mulltervalidation, myMulter } from "../../services/multerCloud.js";
import passport from "passport";
import * as passportsetup from "../../services/passportsetup.js";

authRouter.post(
  "/signup",
  myMulter(mulltervalidation.image).single("image"),
  validation(validators.signup),
  router.signup
);
authRouter.get(
  "/confirmEmail/:token",
  validation(validators.checktoken),
  router.confirmEmail
);
authRouter.post("/signin", validation(validators.signin), router.signin);
authRouter.patch(
  "/forgetpassword",
  validation(validators.forgetpassword),
  router.forgetpassword
);
authRouter.patch(
  "/resetpassword/:token",
  validation(validators.resetpassword),
  router.resetpassword
);
authRouter.get(
  "/refreshtoken/:token",
  validation(validators.checktoken),
  router.refreshtoken
);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/fail" }),
  router.callback
);
authRouter.get("/fail", (req, res) => {
  res.json({ message: "fail to login" });
});

export default authRouter;
