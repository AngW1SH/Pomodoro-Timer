import express from "express";
import prisma from "../client";
var apiRouter = express.Router();

import passport from "../passport/";

apiRouter.post(
  "/updateorder",
  passport.authenticate("jwt-authenticate", { session: false }),
  async (req, res) => {
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
  }
);

apiRouter.post(
  "/add",
  passport.authenticate("jwt-authenticate", { session: false }),
  async (req, res) => {
    if (!req.body.pomodoro) {
      res.status(400).send("Pomodoro not recieved");
    }
    try {
      if (req.user && req.user.id.length) {
        const max = await prisma.pomodoro.aggregate({
          _max: {
            order: true,
          },
        });
        const add = await prisma.pomodoro.create({
          data: {
            ...req.body.pomodoro,
            id: undefined,
            userid: req.user.id,
            order: max._max.order ? max._max.order + 1 : 0,
          },
        });
        res.status(200).send(add);
      } else {
        res.status(201).send();
      }
    } catch (error) {
      res.status(500);
    }
  }
);

apiRouter.post(
  "/save",
  passport.authenticate("jwt-authenticate", { session: false }),
  async (req, res) => {
    if (!req.body.pomodoro) {
      res.status(400).send("Pomodoro not recieved");
    }
    try {
      if (req.user && req.user.id.length) {
        const add = await prisma.pomodoro.updateMany({
          where: {
            id: req.body.pomodoro.id,
            userid: req.user.id,
          },
          data: req.body.pomodoro,
        });
        res.status(200).send(add);
      } else {
        res.status(401).send();
      }
    } catch (error) {
      res.status(500);
    }
  }
);

apiRouter.post(
  "/delete",
  passport.authenticate("jwt-authenticate", {
    session: false,
    failureMessage: true,
  }),
  async (req, res) => {
    if (!req.body.id) {
      res.status(400).send("Id not recieved");
    }
    try {
      if (req.user && req.user.id.length) {
        const deleted = await prisma.pomodoro.deleteMany({
          where: {
            id: req.body.id,
            userid: req.user.id,
          },
        });
        res.status(200).send(deleted);
      }
    } catch (error) {
      res.status(500);
    }
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
  }
);

apiRouter.get(
  "/get",
  passport.authenticate("jwt-authenticate", {
    session: false,
    failureMessage: true,
  }),
  async (req, res) => {
    try {
      if (req.user && req.user.id.length) {
        const pomodoros = await prisma.pomodoro.findMany({
          where: {
            userid: req.user.id,
          },
          orderBy: {
            order: "asc",
          },
        });
        res.status(200).send(pomodoros);
      } else {
        res.status(201).send();
      }
    } catch (error) {
      res.status(500);
    }
  }
);

export default apiRouter;
