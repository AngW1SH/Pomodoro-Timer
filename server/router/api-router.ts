import { PrismaClient } from "@prisma/client";
import express from "express";
var apiRouter = express.Router();

const prisma = new PrismaClient();

//const prisma = new PrismaClient();

apiRouter.post("/add", async (req, res) => {
  if (!req.body.pomodoro) {
    res.status(400).send("Pomodoro not recieved");
  }
  try {
    const add = await prisma.pomodoro.create({
      data: req.body.pomodoro,
    });
    res.status(200).send(add);
  } catch (error) {
    res.status(500);
  }
});

apiRouter.post("/save", async (req, res) => {
  if (!req.body.pomodoro) {
    res.status(400).send("Pomodoro not recieved");
  }
  try {
    const add = await prisma.pomodoro.update({
      where: {
        id: req.body.pomodoro.id,
      },
      data: req.body.pomodoro,
    });
    res.status(200).send(add);
  } catch (error) {
    res.status(500);
  }
});

apiRouter.post("/delete", async (req, res) => {
  if (!req.body.id) {
    res.status(400).send("Id not recieved");
  }
  try {
    const deleted = await prisma.pomodoro.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).send(deleted);
  } catch (error) {
    res.status(500);
  }
});

apiRouter.get("/get", async (req, res) => {
  try {
    const pomodoros = await prisma.pomodoro.findMany();
    res.status(200).send(pomodoros);
  } catch (error) {
    res.status(500);
  }
});

export default apiRouter;
