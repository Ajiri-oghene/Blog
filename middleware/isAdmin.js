const jwt = require('jsonwebtoken');

role = (req, res, next) => {
    if(req.isAdmin === false){
        return res.status(404).json({
            error: err
        })
    }

    next();
}

module.exports = role;