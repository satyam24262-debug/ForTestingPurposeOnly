// ? These are external/third-party modules
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); //! Used to parse cookies from incoming requests
const path = require("path");

const app = express();

const corsObj = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

// ? Middlewares
app.use(cors(corsObj));
app.use(express.json()); //! Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); //!Parses URL-encoded data, commonly used with form submissions
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ? These are custom/local modules
const db = require("./config/db");
const UserRoute = require("./router/userRoute");
const CompanyRoute = require("./router/companyRoute");
const jobRoute = require("./router/jobRoute");
const applicationRoute = require("./router/applicationRoute");
const AuthRouter = require("./router/authRoute");
const Uploadrouter = require("./router/upload");

// ?Test route
app.get("/", (req, res, next) => {
  console.log("Test is successfull");
  res.status(200).json({
    message: "I am backend, Your are going in the right path",
  });
});

app.use("/api", UserRoute);
app.use("/api", CompanyRoute);
app.use("/api", jobRoute);
app.use("/api", applicationRoute);
app.use("/api", AuthRouter);

app.use("/api", Uploadrouter);

const startServer = async () => {
  await db();
  app.listen(process.env.PORT || 3000, () => {
    console.log(
      `Server is running at http://localhost:${process.env.PORT || 3000}`,
    );
  });
};

startServer().catch(() => {
  console.error("Server startup stopped because MongoDB is unavailable");
  process.exit(1);
});
