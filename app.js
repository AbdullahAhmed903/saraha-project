import dotenv from "dotenv";
import * as indexrouter from "./modules/index.js";
import cors from "cors";
import express from "express";
import { globalerr } from "./services/asynchandler.js";
import passport from "passport";
import cookieSession from "cookie-session";
const app = express();
dotenv.config();
app.use(cors());
app.use(
  cookieSession({
    name: "tuto-session",
    keys: ["key1", "key2"],
  })
);
const port = process.env.portnumber;
const Baseurl = process.env.baseurl;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalerr);
app.use(passport.initialize());
app.use(passport.session());

indexrouter.connectionDB();
app.use(`${Baseurl}/upload`, express.static("./upload"));
app.use(`${Baseurl}/user`, indexrouter.userRouter);
app.use(`${Baseurl}/auth`, indexrouter.authRouter);
app.use(`${Baseurl}/message`, indexrouter.messageRouter);
app.use("*", (req, res) => {
  res.json({ message: "in_valid routing" });
});

app.listen(port, () => {
  console.log(`server run on port ${port}..........`);
});
