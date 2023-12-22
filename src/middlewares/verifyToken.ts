const jwt = require("jsonwebtoken");

const verifyToken = async (req: any, res: any, next: any) => {
  // remove when need auth
  req.user = { user_id: "1" };
  next();

  // const token =
  //   req.headers.authorization && req.headers.authorization.split(" ")[1];

  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized: No token provided" });
  // }

  // try {
  //   const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  //   console.log("Decoded Token:", decoded);

  //   const currentTimestamp = Math.floor(Date.now() / 1000);
  //   if (decoded.exp < currentTimestamp) {
  //     return res
  //       .status(401)
  //       .json({ message: "Unauthorized: Token has expired" });
  //   }

  //   if (req.params.user_id !== decoded.userId.toString()) {
  //     return res.status(401).json({ message: "Unauthorized: Invalid user id" });
  //   }

  //   req.user = { ...decoded, user_id: decoded.userId.toString() };
  //   next();
  // } catch (err) {
  //   return res.status(401).json({ message: "Unauthorized: Invalid token" });
  // }
};

export default verifyToken;
