// import ApiError from "../../errors/ApiError";
// import { prisma } from "../../shared/prisma";
// import bcrypt from "bcryptjs";
// import { generateOTP } from "./auth.utils";
// import { deleteOTP, saveOTP, verifyOTP } from "./auth.redis";
// import jwt from "jsonwebtoken"
// const login = async (email:string, password:string) => {

//     const user = await prisma.user.findUnique({
//         where:{
//             email:email
//         }
//     });
//     if(!user)throw new ApiError(404, "User not Found");

//     const validPass = await bcrypt.compare(password, user.password!);
//     if(!validPass){
//         throw new ApiError(401, "Invalid password")
//     }

//     const otp = generateOTP();
//     await saveOTP(email, otp);

//         // TODO: send email/sms OTP (placeholder)
//     console.log("Generated OTP:", otp);




//   const isValid = await verifyOTP(email, otp);
//    if (!isValid) throw new Error("Invalid OTP");
   
//    await deleteOTP(email);

//     const accessToken = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "15m" }
//     );

//     const refreshToken = jwt.sign(
//       { id: user.id },
//       process.env.JWT_REFRESH_SECRET!,
//       { expiresIn: "7d" }
//     );

//      return {
//       message: "Login successful",
//       accessToken,
//       refreshToken,
//       user,
//       email,
//     };


   



// };



// export const AuthServices = {
//     login,
// }




import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { generateOTP } from "./auth.utils";
import { deleteOTP, saveOTP, verifyOTP } from "./auth.redis";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { sendOTPEmail } from "../../helper/emailSender";





// const login = async (email: string, password: string) => {
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user) throw new ApiError(404, "User not found");

//   if (!user.password) {
//     throw new ApiError(400, "Password not set for this account");
//   }

//   const isValidPass = await bcrypt.compare(password, user.password);
//   if (!isValidPass) throw new ApiError(401, "Invalid password");

//   const otp = generateOTP();
//   await saveOTP(email, otp);

//   console.log("Generated OTP:", otp);

//   return {
//     message: "OTP sent successfully",
//     email,
//   };
// };





// -----------------------------
// VERIFY OTP - Step 2 (Token Issue)
// -----------------------------




const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const validPass = await bcrypt.compare(password, user.password!);
  if (!validPass) throw new ApiError(401, "Invalid password");

  const otp = generateOTP();
  await saveOTP(email, otp);

  // SEND OTP VIA EMAIL
  await sendOTPEmail(email, otp);

  return {
    message: "OTP sent successfully",
    email,
  };
};


const verifyOtp = async (email: string, otp: string) => {
  const isValid = await verifyOTP(email, otp);
  if (!isValid) throw new ApiError(400, "Invalid OTP");

  await deleteOTP(email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    config.jwt.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwt.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
    user,
  };
};

export const AuthServices = {
  login,
  verifyOtp,
};



