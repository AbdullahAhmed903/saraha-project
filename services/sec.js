// import schedule from "node-schedule";
// import userModel from "../DB/models/user.model.js";

// const job = schedule.scheduleJob("45 * * * * *", async function () {
//   const users = await userModel.find().select("userName");
//   users.forEach(async (ele) => {
//     const message = `plz enter user ${ele.userName}`;
//     console.log(ele.userName);
//     await userModel.updateOne({userName:ele.userName}, { message: message });
//   });
//   console.log(users);
// });

// export default job;
