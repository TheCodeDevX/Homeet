import crypto from 'crypto'

 export const genRefreshToken = async (res, user) => {
  const token = crypto.randomBytes(64).toString("hex");
      res.cookie("refreshToken",token, {
       httpOnly : true,
       sameSite : "lax",
       secure : process.env.NODE_ENV !== "development",
       maxAge : 1000 * 60 * 60 * 24 * 7
      });
 
      const refreshToken = crypto.createHash("sha256").update(token).digest("hex")
 
      user.refreshToken = refreshToken;
      await user.save();
 }