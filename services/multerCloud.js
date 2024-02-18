import multer from "multer";
import { nanoid } from "nanoid";
export const mulltervalidation = {
  image: ["image/png", "image/jpeg", "image/jif"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};
export const HME = (err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: "Multer error", err });
  } else {
    next();
  }
};
export function myMulter(customvalidation) {
  if (!customvalidation) {
    customvalidation = mulltervalidation.image;
  }
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (customvalidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("in-valid format", false);
    }
  }
  const upload = multer({ dest: "upload", fileFilter, storage: storage });
  return upload;
}
