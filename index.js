require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripeRouter = require("./payment");

const app = express();

const initializeRouter = () => {
  app.use("/stripe", stripeRouter);
};

function bootstrap() {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  initializeRouter();

  app.listen(process.env.PORT, () => {
    console.log("server listening on port: ", process.env.PORT);
  });
}

bootstrap();
