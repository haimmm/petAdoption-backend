const adoptSchema = {
    type: 'object',
    properties: {
        status: { type: 'string', format: 'adopt'}
    }
}
adoptSchema.required = Object.keys(adoptSchema.properties);

module.exports = adoptSchema;