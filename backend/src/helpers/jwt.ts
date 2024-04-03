import { expressjwt } from "express-jwt";
const ACCESS_SECRET = process.env.ACCESS_SECRET;

function authJwt() {
   const api = process.env.API_URL;
   if (!ACCESS_SECRET) {
      console.log("access secret is not found in authJwt");
      return;
   }
   return expressjwt({
      secret: ACCESS_SECRET,
      algorithms: ["HS256"],
   }).unless({
      path: [
         { url: /\/public(.*)/, methods: ["GET", "OPTIONS"] },
         `${api}/auth/login`,
         `${api}/auth/refresh`,
         `${api}/auth/register`,
      ],
   });
}

export default authJwt;
