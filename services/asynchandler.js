import dotenv from "dotenv";
dotenv.config();
export const asynchandler = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => {
      //   res
      //     .status(500)
      //     .json({
      //       message: "catch error",
      //       errMsg: err.message,
      //       stack: err.stack,
      //     });
      next(new Error(err, { cause: 500 }));
    });
  };
};
export const globalerr = (err, req, res, next) => {
  if (err) {
    if (process.env.Mood === "DEV") {
      res
        .status(err["cause"] || 500)
        .json({ message: err.message, stack: err.stack });
    } else {
      res.status(err["cause"] || 500).json({ message: err.message });
    }
  }
};
