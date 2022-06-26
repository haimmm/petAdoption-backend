const loginSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
    }
}
loginSchema.required = Object.keys(loginSchema.properties);

module.exports = loginSchema;
