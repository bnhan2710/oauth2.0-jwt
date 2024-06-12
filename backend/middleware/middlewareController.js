const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = {
    // verifyToken
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.token;
        if (authHeader) {
            const token = authHeader.split(" ")[1]; 
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You are not authenticated");
        }
    },

    AdminAuth: (req, res, next) => {
        verifyTokenMiddleware.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin) {
                next();
            } else {
                return res.status(403).json("You are not allowed to delete other user");
            }
        });
    }
};

module.exports = verifyTokenMiddleware;
