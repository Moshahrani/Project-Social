const jsonwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send("Unauthorized");
        }
         // destructuring userId from payload object after token was sent 
         // from our backend (auth.js)

        const { userId } = jsonwt.verify(req.headers.authorization, process.env.jsonwtSecret);

        req.userId = userId;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send("Unauthorized");
    }
};
