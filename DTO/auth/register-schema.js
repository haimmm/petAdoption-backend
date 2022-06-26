const registerSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        phone: { type: 'string', format: 'phone'},
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'pass' },
        passwordConfirm: { type: 'string', format: 'pass' },
        permissions: { type: 'array' },
    }
}
registerSchema.required = Object.keys(registerSchema.properties);

module.exports = registerSchema;

