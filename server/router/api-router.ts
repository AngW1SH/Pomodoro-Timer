import { PrismaClient } from "@prisma/client";
import express from "express";
import prisma from "../client";
import bcrypt, { hash } from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  getUsername,
} from "../prisma/JWT/jwt";
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
    if (getUsername(req, res).length) {
      const pomodoros = await prisma.pomodoro.findMany({
        orderBy: {
          order: "asc",
        },
      });
      res.status(200).send(pomodoros);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    res.status(500);
  }
});

apiRouter.post("/register", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send();
      return;
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
          res.status(200).send();
          return;
        });
      });
    } else {
      res.status(401).send();
      return;
    }
  } catch (error) {
    res.status(500).send();
    return;
  }
});

apiRouter.get("/test", async (req, res) => {
  try {
    res.status(200).send({
      access: req.signedCookies["pomonotes-access"],
      refresh: req.signedCookies["pomonotes-refresh"],
    });
  } catch {
    return res.status(400).send();
  }
});

apiRouter.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send();
      return;
    }

    const doesUserExist = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (doesUserExist === null) {
      res.status(401).send();
      return;
    }

    bcrypt.compare(
      req.body.password,
      doesUserExist!.password,
      function (err, result) {
        if (result) {
          res.cookie("pomonotes-access", generateAccessToken(req.body.email), {
            maxAge: 1000 * 60 * 60 * 24, // would expire after 15 minutes
            httpOnly: true,
            signed: true,
          });

          res.cookie(
            "pomonotes-refresh",
            generateRefreshToken(req.body.email),
            {
              maxAge: 1000 * 60 * 60 * 24, // would expire after 15 minutes
              httpOnly: true,
              signed: true,
            }
          );
          res.status(200).send();
        } else {
          res.status(401).send();
        }
      }
    );
  } catch (error) {
    res.status(500).send();
  }
});

export default apiRouter;
