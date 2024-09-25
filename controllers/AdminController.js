const { generateToken } = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const {generateRefreshToken} = require('../config/refreshToken')
const AdminModel = require('../models/AdminModel')
const BusinessAssociatesModel = require('../models/BusinessAssociatesModel')

const Register = asyncHandler( async(req,res)=>{
   try{
    const newAdmin = await AdminModel.create(req.body)
    const token = generateToken(newAdmin._id);

    res.status(201).json({ newAdmin, token });
   }catch(error){
    res.status(500).json({ message: 'Registration failed', error: error.message });
   }
   
})

// const Login = asyncHandler(async(req,res)=>{
//     try{
//         const {email,password} = req.body
//         const findAdmin = await AdminModel.findOne({email})
//         if(findAdmin && await findAdmin.isPasswordMatched(password)){
//             const refreshToken = await generateRefreshToken(findAdmin._id)
//             const updateAdmin = await AdminModel.findOneAndUpdate(findAdmin._id,{refreshToken},{new:true})
//             res.cookie('refreshToken',refreshToken,{
//                 httpOnly:true,
//                 maxAge : 72 * 60 * 60 * 1000
//             })
//             res.json({
//                 _id:findAdmin._id,
//                 name:findAdmin.name,
//                 email:findAdmin.email,
//                 token:generateToken(findAdmin._id)
//             })
//         }else{
//             throw new Error('Invalid credientials')
//         }
//     }catch(error){
//         res.status(500).json({ message: 'Login failed', error: error.message });
//     }
// })

const Login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Try to find the user in the Admin model
        let user = await AdminModel.findOne({ email });

        // If not found in Admin model, check in Business Associate model
        if (!user) {
            user = await BusinessAssociatesModel.findOne({ email });
        }

        // If user is found in either schema, verify the password
        if (user && await user.isPasswordMatched(password)) {
            const refreshToken = await generateRefreshToken(user._id);

            // Update the refresh token in the corresponding schema
            if (user instanceof AdminModel) {
                await AdminModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
            } else if (user instanceof BusinessAssociatesModel) {
                await BusinessAssociatesModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
            }

            // Set the refresh token in a cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000 // 3 days
            });

            // Respond with user details and access token
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user instanceof AdminModel ? 'admin' : 'business-associate',
                token: generateToken(user._id)
            });
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});


module.exports = {Register,Login}