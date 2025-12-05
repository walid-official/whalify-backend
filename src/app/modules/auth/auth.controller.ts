// import { Request, Response } from "express"
// import catchAsync from "../../shared/catchAsync"
// import { AuthServices } from "./auth.service"
// import { loginSchema } from "./auth.validation"




//   const loginC = catchAsync(async (req:Request, res:Response) => {

//     const parsed = loginSchema.parse(req.body);

//     const data = await AuthServices.login(parsed.email, parsed.password);

//     res.status(400).json({
//       success:true,
//       message:"OTP Verification",
//       data:data
//     })

//   });


//     async verifyOtp(req: Request, res: Response) {
//     try {
//       const parsed = verifyOtpSchema.parse(req.body);
//       const data = await AuthService.verifyOtp(parsed.email, parsed.otp);
//       res.json(data);
//     } catch (err: any) {
//       res.status(400).json({ error: err.message });
//     }
//   },
// };







// export const UserController = {
//     loginC

// }


















import { Request, Response } from "express";
import { loginSchema, verifyOtpSchema } from "./auth.validation";
import { AuthServices } from "./auth.service";


export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      const data = await AuthServices.login(parsed.email, parsed.password);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const parsed = verifyOtpSchema.parse(req.body);
      const data = await AuthServices.verifyOtp(parsed.email, parsed.otp);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
