import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import path from "path";
import apiRouter from "./router/api-router";

const app = express();
app.listen(3000, () => console.log("listening port 3000"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
app.use("/api", apiRouter);

app.use("/public", express.static(path.resolve(__dirname + "/../public")));

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname + "/../client/dist/index.html"));
});

app.use(
  "/assets",
  express.static(path.resolve(__dirname + "/../client/dist/assets"))
);
