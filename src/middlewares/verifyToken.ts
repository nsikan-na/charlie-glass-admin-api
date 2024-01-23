import logger from "../util/logger";

const jwt = require("jsonwebtoken");

const verifyToken = async (req: any, res: any, next: any) => {
  // turn off auth
  // req.user = { user_id: req.params.user_id };
  // next();

  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    logger.log(decoded);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired" });
    }

    req.user = { ...decoded, user_id: decoded.userId.toString() };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
