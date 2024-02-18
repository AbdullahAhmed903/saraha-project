import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const mulltervalidation = {
  image: ["image/png", "image/jpeg", "image/jif"],
  pdf: ["application/pdf"],
};
export const HME = (err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: "Multer error", err });
  } else {
    next();
  }
};
export function myMulter(custompath, mulltervalidation) {
  if (!mulltervalidation) {
    mulltervalidation = mulltervalidation.image;
  }
  if (!custompath) {
    custompath = "general";
  } else {
    const fullpath = path.join(__dirname, `../upload/${custompath}`);
    if (!fs.existsSync(fullpath)) {
      fs.mkdirSync(fullpath, { recursive: true });
    }
    // fs.mkdirSync(`upload/user/${custompath}`)
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `upload/${custompath}`);
    },
    filename: function (req, file, cb) {
      cb(null, nanoid() + "-" + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (mulltervalidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("in-valid format", false);
    }
  }
  const upload = multer({ dest: "upload", fileFilter, storage: storage });
  return upload;
}

//.....................................................................//
// const __dirname=path.dirname(fileURLToPath(import.meta.url))

// export const HME = (err, req, res, next) => {
//   if (err) {
//     res.status(400).json({ message: "multer error", err });
//   } else {
//     next();
//   }
// };

// export function myMulter(custompath,mulltervalidation) {
//   if(!mulltervalidation)
//   {
//     mulltervalidation=mulltervalidation.image
//   }
//   if(!custompath)
//   {
//     custompath="general"
//   }
//   else
//   {
//     const fullpath=path.join(__dirname,`../upload/${custompath}`)
//     if(!fs.existsSync(fullpath)){
//     fs.mkdirSync(fullpath,{recursive:true})

//     }
//   }
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, `upload/${custompath}`);
//     },
//     filename: function (req, file, cb) {
//       cb(null, nanoid() + "_" + file.originalname);
//     },
//   });
//   function fileFilter(req, file, cb) {
//     if (mulltervalidation.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb("in-valid format", false);
//     }
//   }
//   const upload = multer({ dest: "upload", fileFilter,storage });
//   return upload;
// }
