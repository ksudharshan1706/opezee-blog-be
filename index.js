const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const commentRoute = require("./routes/comments");
dotenv.config();
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `(config\/db.js) connected to MongoDB database & host is : ${mongoose.connection.host}`
    );
  } catch (error) {
    console.log(`Error in db.js file: ${error}`);
  }
};

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/comments", commentRoute);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  connectDB();
  console.log(`server running on ${PORT}`);
});
