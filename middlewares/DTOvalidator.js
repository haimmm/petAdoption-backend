const ajv = require("../modules/ajv.module");

const validator = (schema) => {
    return (req, res, next) => {
        const obj = req.body;
        const validator = ajv.compile(schema);
        const valid = validator(obj);
        return next(valid ? null : {message: validator.errors, status:"401"});
    }
}

module.exports = validator;
