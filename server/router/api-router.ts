import { PrismaClient } from "@prisma/client";
import express from "express";
var apiRouter = express.Router();

const prisma = new PrismaClient();

//const prisma = new PrismaClient();

apiRouter.post("/add", async (req, res) => {
  const add = await prisma.pomodoro.create({
    data: req.body.pomodoro,
  });
  res.status(200).send(add);
});

export default apiRouter;
