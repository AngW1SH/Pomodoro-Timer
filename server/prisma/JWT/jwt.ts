import jwt from "jsonwebtoken";
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

export function getUsername(req: Express.Request, res: Express.Response) {
  const username = jwt.verify(
    req.signedCookies["pomonotes-access"],
    process.env.TOKEN_SECRET!,
    (err, decoded) => {
      if (err !== null) {
        console.log(err);
        if (err.name == "TokenExpiredError") {
          jwt.verify(
            req.signedCookies["pomonotes-refresh"],
            process.env.TOKEN_SECRET!,
            (err, decoded) => {
              if (err) {
                if (err.name == "TokenExpiredError") {
                  return "";
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
                return decoded.username;
              }
            }
          );
        } else {
          return "";
        }
      } else {
        return decoded.username;
      }
    }
  );

  return username;
}
