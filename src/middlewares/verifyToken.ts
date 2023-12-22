const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
export const EXPIRATION_TIME =  3_600_000;

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

export default verifyToken;
