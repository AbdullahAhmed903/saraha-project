import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      default: "Male",
      enum: ["Male", "Female"],
    },
    confirmemail: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    profilePic: String,
    imagepublicId: String,
    video: String,
    isdeleted: {
      type: Boolean,
      default: false,
    },
    message: String,
    lastSeen: Date,
    Role: { type: String, enum: ["user", "admin"], default: "user" },
    code: { type: String, default: "" },
    Resetlink: { type: Boolean, default: false },
    accountType: {
      type: String,
      default: "system",
      enum: ["system", "google", "facebook"],
    },
  },

  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
