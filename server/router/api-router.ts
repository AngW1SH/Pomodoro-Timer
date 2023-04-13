import { PrismaClient } from "@prisma/client";
import express from "express";
import prisma from "../client";
import bcrypt, { hash } from "bcryptjs";
var apiRouter = express.Router();

//const prisma = new PrismaClient();

apiRouter.post("/updateorder", async (req, res) => {
  if (!req.body.info) {
    res.status(400).send("Info not recieved");
  }
  try {
    const result = await Promise.all(
      req.body.info.map(({ id, order }) =>
        prisma.pomodoro.update({
          where: {
            id: id,
          },
          data: {
            order: order,
          },
        })
      )
    );
    res.status(200);
  } catch (error) {
    res.status(500);
  }
});

apiRouter.post("/add", async (req, res) => {
  if (!req.body.pomodoro) {
    res.status(400).send("Pomodoro not recieved");
  }
  try {
    const max = await prisma.pomodoro.aggregate({
      _max: {
        order: true,
      },
    });
    const add = await prisma.pomodoro.create({
      data: {
        ...req.body.pomodoro,
        order: max._max.order ? max._max.order + 1 : 0,
      },
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
    const pomodoros = await prisma.pomodoro.findMany({
      orderBy: {
        order: "asc",
      },
    });
    res.status(200).send(pomodoros);
  } catch (error) {
    res.status(500);
  }
});

apiRouter.post("/register", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({ status: 400 });
    }

    const doesUserExist = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (doesUserExist === null) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
          const result = await prisma.user.create({
            data: {
              email: req.body.email,
              password: hashedPassword,
            },
          });
          res.status(200).send({ status: 200 });
        });
      });
    } else {
      res.status(403).send({ status: 403 });
    }
  } catch (error) {
    res.status(500).send({ status: 500 });
  }
});

apiRouter.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({ status: 400 });
      return;
    }

    const doesUserExist = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (doesUserExist === null) {
      res.status(403).send({ status: 403 });
      return;
    }

    bcrypt.compare(
      req.body.password,
      doesUserExist!.password,
      function (err, result) {
        if (result) {
          res.status(200).send({ status: 200 });
        } else {
          res.status(403).send({ status: 403 });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ status: 500 });
  }
});

export default apiRouter;
