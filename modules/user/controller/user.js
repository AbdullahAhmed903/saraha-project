import moment from "moment/moment.js";
import messageModel from "../../../DB/models/message.model.js";
import userModel from "../../../DB/models/user.model.js";
import { myEmail } from "../../../services/email.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import cloudinary from "../../../services/cloudinary.js";
import qrcode from "qrcode";

export const profile = async (req, res) => {
  const user = await userModel.findById({ _id: req.user._id });
  // const link = `${req.protocol}://${req.headers.host}${process.env.baseurl}/user/profile/${user._id}`;
  const link = `${user}`;
  qrcode.toDataURL(link, function (err, url) {
    console.log(url);
    res.json({ message: "done", url });
  });
};

export const getmessage = async (req, res) => {
  try {
    const message = await messageModel.find({
      reciverId: req.user._id,
      isdeleted: false,
    });
    res.status(200).json({ message: "done", message });
  } catch (error) {}
};

export const getprofile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findById({ _id: id })
      .select("email userName profilePic");
    user
      ? res.status(200).json({ message: "done", user })
      : res.status(401).json({ message: "user not exist" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const signout = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.user._id, online: true },
      { online: false, lastSeen: moment().format() }
    );
    console.log(moment().format());
    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { email, userName, phone, age, gender } = req.body;
    if (email) {
      const user = await userModel.findOneAndUpdate(
        { _id: req.user._id },
        { confirmemail: false, email }
      );
      console.log(req.user._id);
      const token = jwt.sign({ id: req.user._id }, process.env.emailsignture);
      const link = `${req.protocol}://${req.headers.host}${process.env.baseurl}/auth/confirmEmail/${token}`;
      myEmail(
        email,
        "confirmationEmail",
        `<a href='${link}'>follow me to confirm your email</a>`
      );
    }
    if (phone) {
      const encryptionphone = CryptoJS.AES.encrypt(
        phone,
        process.env.encryptionphone
      ).toString();
      const u = await userModel.findByIdAndUpdate(req.user._id, {
        phone: encryptionphone,
      });
      //.....decrypte phone...../////
      //   const bytes = CryptoJS.AES.decrypt(
      //     encryptionphone,
      //     process.env.encryptionphone
      //   );
      //   var decryptedData =(bytes.toString(CryptoJS.enc.Utf8));
      //   console.log(decryptedData);
    }
    if (age || gender || userName) {
      const all = await userModel.findByIdAndUpdate(req.user._id, {
        age,
        gender,
        userName,
      });
    }
    res.status(200).json({
      message:
        "Updated Done ,please check your email for confirmation if you update your email",
    });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const softdeleteprofile = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      { _id: req.user._id, isdeleted: false, blocked: false },
      { isdeleted: true }
    );
    if (!user) {
      res.status(400).json({
        message:
          " This account is already marked as deleted o blockecd from the admin side ",
      });
    } else {
      res
        .status(200)
        .json({ message: "your account is marked as deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const allusers = async (req, res) => {
  try {
    const userlist = await userModel
      .find({})
      .select("email userName age gender");
    userlist[0]
      ? res.status(200).json({ message: "done", userlist })
      : res.status(200).json({ message: "no user avalible" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const updatepassword = async (req, res) => {
  try {
    const { oldpass, newpass } = req.body;
    if (oldpass == newpass) {
      res
        .status(400)
        .json({ message: "oldpassword match new password please change it" });
    } else {
      const user = await userModel.findOne({ _id: req.user._id });
      const match = bcrypt.compareSync(oldpass, user.password);
      if (!match) {
        res.status(400).json({ message: "old password not matched" });
      } else {
        const hashpassword = bcrypt.hashSync(
          newpass,
          parseInt(process.env.SaltRound)
        );
        const user = await userModel.updateOne(
          { _id: req.user._id },
          { password: hashpassword }
        );
        user.modifiedCount
          ? res.status(200).json({ message: "password changed done" })
          : res.status(400).json({ message: "something wrong" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const picture = async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    res.status(400).json({ message: "please upload your file" });
  }
  // const imageurl = req.file.filename + "/" + req.file.destination;
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    folder: `user/profile${req.user._id}`,
  });
  await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { profilePic: secure_url }
  );
  res.status(201).json({ message: "done" });
};

export const covpicture = async (req, res) => {
  const imageurl = [];
  for (const file of req.files) {
    // imageurl.push(file.filename + "/" + file.destination);
    const { secure_url } = await cloudinary.uploader.upload(file.path, {
      folder: `user/profile${req.user._id}`,
    });
    imageurl.push(secure_url);
  }
  await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $push: { coverPic: imageurl },
    }
  );
  res.status(200).json({ message: "done" });
};

export const uploadvideo = async (req, res) => {
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
    public_id: `user/video/${req.user._id}`,
    overwrite: false,
  });
  console.log(secure_url);
  await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { video: secure_url }
  );
  res.json({ message: "done" });
};

//...............server multer.................//

// export const picture = async (req, res) => {
//   console.log(req);
//   if (!req.file) {
//     res.status(400).json({ message: "please upload your file" });
//   }
//   const imageurl = req.file.filename + "/" + req.file.destination;
//   await userModel.findByIdAndUpdate(
//     { _id: req.user._id },
//     { profilePic: imageurl }
//   );
//   res.status(201).json({ message: "done" });
// };

// export const covpicture = async (req, res) => {
//   const imageurl = [];
//   for (const file of req.files) {
//     imageurl.push(file.filename + "/" + file.destination);
//   }
//   await userModel.findByIdAndUpdate(
//     { _id: req.user._id },{
//     $push:{ coverPic: imageurl }}
//   );
//   res.status(200).json({ message: "done" });
// };
