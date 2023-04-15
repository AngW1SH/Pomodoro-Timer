import jwt, { JwtPayload } from "jsonwebtoken";
import Express from "express";

export function generateAccessToken(username: string) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET!, {
    expiresIn: 60 * 60,
  });
}

export function generateRefreshToken(username: string) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET!, {
    expiresIn: 60 * 60 * 24,
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
            (err, decoded) => {
              if (err) {
                if (err.name == "TokenExpiredError") {
                  res.status(401).send();
                }
              } else {
                res.cookie(
                  "pomonotes-access",
                  generateAccessToken(decoded.username),
                  {
                    maxAge: 1000 * 60 * 60 * 24, // would expire after 15 minutes
                    httpOnly: true,
                    signed: true,
                  }
                );
                next();
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
