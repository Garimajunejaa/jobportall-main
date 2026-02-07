import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        console.log('=== AUTHENTICATION CHECK ===');
        const token = req.cookies.token;
        console.log('Token present:', !!token);
        
        if (!token) {
            console.log('ERROR: No token found');
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }
        
        // Check if SECRET_KEY is available
        if (!process.env.SECRET_KEY) {
            console.error('ERROR: SECRET_KEY not set in environment variables');
            return res.status(500).json({
                message: "Server configuration error",
                success: false
            });
        }
        
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        console.log('Token decoded successfully:', decode.userId);
        
        if(!decode){
            console.log('ERROR: Token decode failed');
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
        
        // Set both userId and id for compatibility
        req.userId = decode.userId;
        req.id = decode.userId;
        console.log('User ID set:', req.id);
        
        console.log('=== AUTHENTICATION SUCCESS ===');
        next();
    } catch (error) {
        console.error('=== AUTHENTICATION ERROR ===');
        console.error("Authentication error:", error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
};

export default isAuthenticated;