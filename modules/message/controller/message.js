import userModel from "../../../DB/models/user.model.js";
import messageModel from "../../../DB/models/message.model.js";

export const sendmessage = async (req, res) => {
  const { reciverId } = req.params;
  const { message } = req.body;
  const user = await userModel.findById({ _id: reciverId });
  if (!user) {
    res.status(400).json({ message: "in-valid reciver" });
  }
  const newmessage = new messageModel({ text: message, reciverId: reciverId });
  const savedmessage = newmessage.save();
  res.status(200).json({ message: "done" });
};

export const allmessage = async (req, res) => {
  const allmessage = await messageModel.find({ isdeleted: false }).populate([
    {
      path: "reciverId",
      select: "userName email profilePic",
    },
  ]);
  res.status(200).json({ message: "done", allmessage });
};

export const deletemessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await messageModel.updateOne(
      {
        _id: id,
        reciverId: req.user._id,
      },
      { isdeleted: true }
    );

    message.modifiedCount
      ? res.status(200).json({ message: "done" })
      : res.status(401).json({ message: "message ID wrong or you not auth" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
