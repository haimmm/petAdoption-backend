const Ajv = require('ajv');
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true, $data: true });

addFormats(ajv);

ajv.addFormat('pass', (value) => {
    const PASSWORD_PATTERNS = ['[A-Z]','[a-z]', '\\d', '^\\w{8,15}$'];
    for(const p of PASSWORD_PATTERNS){
        if(!(new RegExp(p).test(value))) return false
    }
    return true;
})

ajv.addFormat('adopt', (value) => {
    return value === "adopted" || value === "fostered";
})

ajv.addFormat('phone', (value) => {
    const PHONE_PATTERN = '^\\d{3}-?\\d{7}$';
    return new RegExp(PHONE_PATTERN).test(value);
})

module.exports = ajv;