import crypto from 'crypto'
const randomString = crypto.randomBytes(32).toString("base64");
console.log(randomString);