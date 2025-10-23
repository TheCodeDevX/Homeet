import jwt from 'jsonwebtoken'
import 'dotenv/config'

const genToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"})
    res.cookie('jwt', token, {
        httpOnly : true,
        // prevent XSS (stands for cross-site Scripting) attacks where an attacker tries to run malicious 
        // JavaScript in the browser this often done through form inputs or script injections
        // by setting the cookie to be inaccessible to Javascript (using httpOnly : true)
        // we ensure that only the server can access the cookie, not client-side scripts
        sameSite : "lax",
        secure : process.env.NODE_ENV !== 'development', // true : sent the cookie only over HTTPS
        maxAge : 1000 * 60 * 60 * 24 * 7
    })
    return token;
 }

 export default genToken;