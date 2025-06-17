import Auth from "../Models/auth.models.js";
import { hashPassword , TokenGenerator } from "../Utils/helpers.js";

export const registerUser = async (req ,res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message : "All fields are required"
            });
        }
        
        const userExists = await Auth.findOne({email});

        if(userExists){
            return res.status(400).json({
                message : "User already exists in DB try signing in"
            })
        }

        const hashedPassword = await hashPassword(password);

        const user = await Auth.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        });

        const token = await TokenGenerator(user);
        if(!token){
            return res.status(500).json({
                message : "Token generation failed"
            });
        }

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 4 * 60 * 60 * 1000 // 4 hours
        // });


        return res.status(201).json({
            message : "User registered successfully",
            user : {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            token:token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Internal server error",
            error : error.message
        })
    }
}