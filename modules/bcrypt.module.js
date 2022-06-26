const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const encrypt = value => bcrypt.hashSync(value, saltRounds);
const compare = (value, encryptedValue) => bcrypt.compareSync(value,encryptedValue);

module.exports = {
    encrypt,
    compare
}
