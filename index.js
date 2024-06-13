require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routes/user.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const PORT = process.env.PORT || 8000;
const test_variable = "";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use("/api", userRouter);

app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server listening ${PORT} port..`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
