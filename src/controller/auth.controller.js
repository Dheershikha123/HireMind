const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user, expects username email and pass in requirement
 * @access Public
 */

async function registerUserController(req,res){

    const{ username, email, password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({
            message : "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [{username}, {email}]
    })

    if(isUserAlreadyExists){
        /* isUserAlreadyExists.username = username */
        return res.status(400).json({
            message : "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password,10)
     const user = await userModel.create({
        username,
        email,
        password : hash
     })

     const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
     )

   res.cookie("token", token)
     res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
     })

}

async function loginUserController(req, res) {
    console.log("=========== LOGIN ===========");
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    const user = await userModel.findOne({ email });

    console.log("User Found:", user);

    if (!user) {
        console.log("User not found");
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password Valid:", isPasswordValid);

    if (!isPasswordValid) {
        console.log("Wrong password");
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    return res.status(200).json({
        message: "User login successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

// /**
//  * @name loginUserController
//  * @description login a user, expects email and password in the request body
//  * @access Public
//  */

// async function loginUserController(req,res){
//     const{email, password}= req.body
//     const user = await userModel.findOne({email})
//     if(!user){
//         return res.status(400).json({
//             message:"Invalid email or password"
//         })
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password)
//     if(!isPasswordValid){
//         return res.status(400).json({
//             message:"Invalid email orpassword"
//         })
//     }
//      const token = jwt.sign(
//         {id: user._id, username: user.username},
//         process.env.JWT_SECRET,
//         {expiresIn:"1d"}
//      )

//      res.cookie("token",token)
//      res.status(200).json({
//         message :"User login successfully",
//         user :{
//             id:user._id,
//             username :user.username,
//             email: user.email

//         }
        
//      })
// }


// // async function logoutUserController(req,res){
// //     const token = req.cookies.token
// //     if(token){
// //         await tokenBlacklistModel.create({token})

// //     }
// //     res.clearCookie("token")
// //     res.status(200).json({
// //         message : "User logged out successfully"
// //     })
// // }

// // async function logoutUserController(req, res) {
// //     console.log("Cookies:", req.cookies);

// //     const token = req.cookies.token;
// //     console.log("Token:", token);

// //     if (token) {
// //         const savedToken = await tokenBlacklistModel.create({ token });
// //         console.log("Saved token:", savedToken);
// //     } else {
// //         console.log("No token found");
// //     }

// //     res.clearCookie("token");
// //     res.status(200).json({
// //         message: "User logged out successfully"
// //     });
// // }




async function logoutUserController(req, res) {
    try {
        console.log("Cookies:", req.cookies);

        const token = req.cookies.token;
        console.log("Token:", token);

        if (token) {
            const saved = await tokenBlacklistModel.create({ token });
            console.log("Saved:", saved);
        } else {
            console.log("No token found");
        }

        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({
            message: err.message
        });
    }
}
/**
 * @name getmeController
 * @description get the current logged i user details
 * @ access private
 */

async function getMeController(req,res){
   const user = await userModel.findById(req.user.id)
  message : "User details fetch successfully"
   res.status(200).json({

    user:{
        id: user._id,
        username : user.username,
        email : user.email

    }
   })
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}