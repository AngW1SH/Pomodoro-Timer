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

apiRouter.post("/save", async (req, res) => {
  const add = await prisma.pomodoro.update({
    where: {
      id: req.body.pomodoro.id,
    },
    data: req.body.pomodoro,
  });
  res.status(200).send(add);
});

apiRouter.post("/delete", async (req, res) => {
  const deleted = await prisma.pomodoro.delete({
    where: {
      id: req.body.id,
    },
  });
  res.status(200).send(deleted);
});

apiRouter.get("/get", async (req, res) => {
  const pomodoros = await prisma.pomodoro.findMany();
  res.status(200).send(pomodoros);
});

export default apiRouter;
