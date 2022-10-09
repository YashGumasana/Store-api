const errorHandlerMiddleware = async (err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ msg: 'Somethimg went wrong,please try again' });
}

export default errorHandlerMiddleware;