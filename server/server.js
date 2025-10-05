require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 4000;

// Choose DB based on environment
const isTestEnv = process.env.NODE_ENV === "test";
const MONGO_URI = isTestEnv
  ? process.env.MONGO_URI_TEST
  : process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected to ${isTestEnv ? "TEST" : "MAIN"} database`);
    if (!isTestEnv) {
      // Only start server in dev/prod mode
      app.listen(PORT, () =>
        console.log(`Server is running on port ${PORT}`)
      );
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
