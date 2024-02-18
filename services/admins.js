import userModel from "../DB/models/user.model.js";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
export const Admin = async () => {
  const userName = "abdullahAhmed";
  const email = `abdallahbruclee${nanoid()}@gmail.com`;
  const Role = "admin";
  const password = "abdullah@123456";
  const hashedPass = bcrypt.hashSync(password, 9);
  const confirmemail = true;
  const Admins = await userModel.find({ Role: "admin" });
  if (Admins.length > 0) {
    console.log("there is an admin");
  } else {
    const newAdmin = new userModel({
      email,
      Role,
      password: hashedPass,
      confirmemail,
      userName,
    });
    await newAdmin.save();
    console.log("Admin Added Done");
  }
};
