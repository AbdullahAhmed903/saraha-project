import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import { myEmail } from "../../../services/email.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import cloudinary from "../../../services/cloudinary.js";
import { asynchandler } from "../../../services/asynchandler.js";

export const signup = asynchandler(async (req, res, next) => {
  const { email, userName, password } = req.body;
  const user = await userModel.findOne({ email }).select("email");
  if (user) {
    res.status(400).json({ message: "email exist" });
  } else {
    const hashpassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SaltRound)
    );
    const newuser = await userModel({
      email,
      password: hashpassword,
      userName: userName,
    });
    const saveduser = await newuser.save();
    const token = jwt.sign({ id: saveduser._id }, process.env.emailsignture, {
      expiresIn: 60 * 60,
    });
    const link = `${req.protocol}://${req.headers.host}${process.env.baseurl}/auth/confirmEmail/${token}`;
    const link2 = `${req.protocol}://${req.headers.host}${process.env.baseurl}/auth/refreshtoken/${token}`;
    myEmail(
      email,
      "confirmationEmail",
      `<a href='${link}'>follow me to confirm your email</a><br>
        <a href=${link2}>Click here to refresh your token if its expired </a>`
    );
    saveduser
      ? res.status(200).json({ message: "done", saveduser })
      : res.status(400).json({ message: "fail to signup" });
  }
});

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      res.status(401).json({ message: "in-valid token" });
    } else {
      const decoded = jwt.verify(token, process.env.emailsignture);
      if (!decoded?.id) {
        res.status(401).json({ message: "in-valid token payload" });
      } else {
        const user = await userModel.updateOne(
          { _id: decoded.id, confirmemail: false },
          { confirmemail: true }
        );
        user.modifiedCount
          ? // ? res.status(200).json({ message: "plz go to login page" })
            res.redirect("http://127.0.0.1:5500/login.html")
          : res.status(401).json({ message: "email already confirmed" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const refreshtoken = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailsignture);
  console.log(decoded.id);
  if (!decoded?.id) {
    res.status(400).json({ message: "in-valid payload" });
  } else {
    const user = await userModel.findById({ _id: decoded.id });
    if (!user || user.confirmemail) {
      res
        .status(400)
        .json({ message: "in-valid user or email already confirmed" });
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.emailsignture, {
        expiresIn: 60 * 60 * 24,
      });
      const link = `${req.protocol}://${req.headers.host}${process.env.baseurl}/auth/confirmEmail/${token}`;
      myEmail(user.email, "refresh emailconfirmation", `<a href='${link}></a>`);
      res.status(200).json({ message: "Done" });
    }
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "in-valid user" });
    } else {
      if (!user.confirmemail) {
        res.status(400).json({ message: "please confirnm your email first" });
      } else {
        if (user.blocked) {
          res.status(400).json({ message: "your account is blocked" });
        } else {
          const match = bcrypt.compareSync(password, user.password);
          if (!match) {
            res.status(400).json({ message: "in-valid account password" });
          } else {
            const token = jwt.sign(
              { id: user._id, isLoggedIn: true },
              process.env.logintoken,
              { expiresIn: 60 * 60 * 24 }
            );
            await userModel.updateOne({ _id: user._id }, { online: true });
            res.status(201).json({ message: "done", token });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne(
      {
        email,
        isdeleted: false,
        blocked: false,
      },
      { Resetlink: false }
    );
    if (!user) {
      res.status(400).json({ message: "in-valid email" });
    } else {
      const code = nanoid();
      const token = jwt.sign({ _id: user._id }, process.env.emailsignture, {
        expiresIn: 60 * 60,
      });
      const msg = `<div>
      <h1> your code is</h1>
      <p>${code}</p>
      <a href='${req.protocol}://${req.headers.host}${process.env.baseurl}/auth/resetpassword/${token}'>Follow me to continue</a></div>
      `;
      myEmail(user.email, "Verfication Email", msg);
      await userModel.updateOne({ email }, { code: code });
      res.status(200).json({
        message: "please check your email to get your code",
        code,
        link: `${req.protocol}://${req.headers.host}${process.env.baseurl}/auth/reset-password/${token}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const resetpassword = async (req, res) => {
  try {
    const { newcode, newpassword } = req.body;
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.emailsignture);
    if (!decoded?._id) {
      res.status(400).json({ message: "in-valid token payload" });
    } else {
      const user = await userModel.findOne({ _id: decoded._id });
      if (user.link) {
        res.status(400).json({ message: "this link used before" });
      } else {
        const match = bcrypt.compareSync(newpassword, user.password);
        if (match) {
          res
            .status(400)
            .json({ message: "sorry password match old password" });
        } else {
          if (newcode == null) {
            res.status(400).json({ message: "in-valid code" });
          } else {
            if (newcode == user.code) {
              const hashpassword = bcrypt.hashSync(
                newpassword,
                parseInt(process.env.SaltRound)
              );
              const user = await userModel.updateOne(
                { _id: decoded._id },
                { password: hashpassword, code: "", Resetlink: true }
              );
              user.modifiedCount
                ? res.status(200).json({ message: "done" })
                : res.status({ message: "some thing wrong" });
            }
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const callback = asynchandler(async (req, res, next) => {
  const { provider, displayName } = req.user;
  const { picture, email, email_verified } = req.user._json;
  if (!email_verified) {
    return res.status(400).json({ message: "in-valid email" });
  } else {
    const user = await userModel.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.emailsignture, {
        expiresIn: 60 * 60,
      });
      return res.status(200).json({ message: "done", token });
    } else {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        picture,
        { folder: "sarahproject22" }
      );
      const newuser = await userModel.create({
        userName: displayName,
        email,
        confirmemail: email_verified,
        accountType: provider,
        profilePic: secure_url,
        imagepublicId: public_id,
      });
      const token = jwt.sign({ id: newuser._id }, process.env.emailsignture, {
        expiresIn: 60 * 60,
      });
      return res.status(200).json({ message: "done", token });
    }
  }
});
