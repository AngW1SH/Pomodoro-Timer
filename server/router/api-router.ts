import { PrismaClient } from "@prisma/client";
import express from "express";
var apiRouter = express.Router();

//const prisma = new PrismaClient();

apiRouter.get("/test", async (req, res) => {
  res.status(200).send({ test: 1 });
});

export default apiRouter;
