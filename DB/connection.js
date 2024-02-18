import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DBURI)
    .then((result) => {
      console.log(`DB connection done`);
    })
    .catch((err) => {
      console.log(`some thing wrong in connection DB`, err);
    });
};
export default connectionDB;
