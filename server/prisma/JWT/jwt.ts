import jwt, { JwtPayload } from "jsonwebtoken";
import Express from "express";
import prisma from "../../client";

export function generateAccessToken(username: string) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET!, {
    expiresIn: 60 * 60,
  });
}

export function generateRefreshToken(username: string) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET!, {
    expiresIn: 60 * 60 * 48,
  });
}

export function getUserId(token: string) {
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
  return decoded.username;
}

export function authorize(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  jwt.verify(
    req.signedCookies["pomonotes-access"],
    process.env.TOKEN_SECRET!,
    (err, decoded) => {
      if (err !== null) {
        if (err.name == "TokenExpiredError") {
          jwt.verify(
            req.signedCookies["pomonotes-refresh"],
            process.env.TOKEN_SECRET!,
            async (err, decoded) => {
              if (err) {
                if (err.name == "TokenExpiredError") {
                  res.status(401).send();
                }
              } else {
                const doesUserExist = await prisma.user.findFirst({
                  where: {
                    email: req.body.email,
                  },
                });
                if (doesUserExist) {
                  const newToken = generateAccessToken(doesUserExist.id);
                  res.clearCookie("pomonotes-access");
                  res.cookie("pomonotes-access", newToken, {
                    maxAge: 1000 * 60 * 60 * 24, // would expire after 15 minutes
                    httpOnly: true,
                    signed: true,
                  });
                  return res.status(205).send();
                } else {
                  return res.status(401).send();
                }
              }
            }
          );
        } else {
          res.status(400).send();
        }
      } else {
        next();
      }
    }
  );
}
