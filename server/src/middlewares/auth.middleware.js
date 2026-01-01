import jwt from "jsonwebtoken";


const protectRoute= async(req,res,next)=>{
    try {

        if (!req.cookies) {
      return res.status(401).json({ message: "No cookies found" });
    }
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({messsage: "Unauthorized access - No token provided"});
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: "Uauthorized access - invalid token - please login"});

        }

       req.client_data=decoded;

       next();


    } catch (error) {
        console.log("⚠️ error in protectRoute middleware:"+ error);
        res.status(500).json({message:"Interenal server error"});
        
    }
}

export default protectRoute;