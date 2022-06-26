const validator = permissions => {
    return (req, res, next) => {
        const hasPermission = permission => req.user.permissions.includes(permission);
        const valid = permissions.every(hasPermission);
        return next(valid ? null : {message:"No permissions", status:"403"});
    }
}

module.exports = validator;