const updateUserProps = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        tel: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        currentPassword: { type: 'string', format: 'pass' },
        newPassword: { type: 'string', format: 'pass' },
        bio: { type: 'string'},
    }
}

module.exports = updateUserProps;