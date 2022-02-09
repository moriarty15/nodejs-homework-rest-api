const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const {User} = require("../models/user")

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
    try {
        const { authorization = ""} = req.headers;
        const [Bearer, Token] = authorization.split(" ");
        if (Bearer !== "Bearer") {
            throw new createError(401, "Not authorized")
        }
        const { id } = jwt.verify(Token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token) {
            throw new createError(401, "Not autorized")
        }
        req.user = user;
        next();
    } catch (error) {
        if (!error.status) {
            error.status = 401;
            error.message = "Not authorized";
        }
        next(error);
    }
 }

module.exports = authenticate;