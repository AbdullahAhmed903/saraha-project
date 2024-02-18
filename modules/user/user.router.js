import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import {
  HME,
  mulltervalidation,
  myMulter,
} from "../../services/multerCloud.js";
const userRouter = Router();
import * as users from "./controller/user.js";
import * as validators from "./user.validation.js";
userRouter.patch(
  "/profile/pic",
  auth(),
  myMulter(mulltervalidation.image).single("image"),
  HME,
  users.picture
);
userRouter.patch(
  "/profile/cov",
  auth(),
  myMulter(mulltervalidation.image).array("image"),
  HME,
  users.covpicture
);
userRouter.get("/profile", auth(), validation(validators.token), users.profile);
userRouter.get("/message", auth(), users.getmessage);
userRouter.get("/profile/share/:id", users.getprofile);
userRouter.patch("/signout", auth(), users.signout);
userRouter.put("/update", auth(), users.updateprofile);
userRouter.patch("/softdeleteprofile", auth(), users.softdeleteprofile);
userRouter.get("/allusers", users.allusers);
userRouter.patch("/updatepassword", auth(), users.updatepassword);
userRouter.patch(
  "/profile/video",
  auth(),
  myMulter(mulltervalidation.video).single("video"),
  users.uploadvideo
);

export default userRouter;

// import { HME, mulltervalidation, myMulter } from "../../services/multer.js";

// userRouter.patch(
//   "/profile/pic",
//   auth(),
//   myMulter("user/profile", mulltervalidation.image).single("image"),
//   HME,
//   users.picture
// );
// userRouter.patch(
//   "/profile/cov",
//   auth(),
//   myMulter("user/profilecov", mulltervalidation.image).array("image"),
//   HME,
//   users.covpicture
// );
