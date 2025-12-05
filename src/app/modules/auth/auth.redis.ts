

// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: 'Nn82tcopbel0mpVkV2UbYVixs09MxF35',
//     socket: {
//         host: 'redis-10465.c16.us-east-1-3.ec2.cloud.redislabs.com',
//         port: 10465
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

import Redis from "ioredis";
import config from "../../../config";


export const redis = new Redis({
    host:config.REDIS_HOST,
    port:Number(config.REDIS_PORT),
    password:config.REDIS_PASS
});

export const saveOTP = async (email:string, otp:string) => {
    try {
       await redis.setex(`OTP${email}`, 300, otp);
    } catch (error) {
        console.log(error)
        
    }

}


 export const verifyOTP = async (email:string, otp:string) => {
    try {

        const stored = await redis.get(`OTP${email}`);
        return stored === otp;

        
    } catch (error) {
        console.log(error)
        
    }
};


 export const deleteOTP = async (email:string) => {
    try {
        await redis.del(`OTP${email}`)
    } catch (error) {
        console.log(error)
        
    }
}