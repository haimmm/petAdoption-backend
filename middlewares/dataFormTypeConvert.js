const dataFormTypeConvert = async (req, res, next) => {
    if(req.file) req.body.image = req.file;
    if(req.body.height) req.body.height = +req.body.height;
    if(req.body.weight) req.body.weight = +req.body.weight;
    if(req.body.hypoallergenic) req.body.hypoallergenic  = (req.body.hypoallergenic === 'true');

    if(req.query.minHeight) req.query.minHeight = +req.query.minHeight;
    if(req.query.maxHeight) req.query.maxHeight = +req.query.maxHeight;
    if(req.query.minWeight) req.query.minWeight = +req.query.minWeight;
    if(req.query.maxWeight) req.query.maxWeight = +req.query.maxWeight;

    next();
}

module.exports = dataFormTypeConvert;