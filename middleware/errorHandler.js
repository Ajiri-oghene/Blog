const errorHandler = async (err, req, res ,next) => {
    console.log(err)
    if(err.name === "TokenExpiredError"){
        res.status(400).json({message:"Invalid token"})
        return
    }

    res.status(500).json({message:"something went wrong on the server"})
    return
}

module.exports = errorHandler;