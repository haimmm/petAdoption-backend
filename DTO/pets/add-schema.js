const addSchema = {
    type: 'object',
    properties: {
        height: { type: 'integer'},
        weight: { type: 'integer'},
        type: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string'},
        color: { type: 'string'},
        bio: { type: 'string'},
        diet: { type: 'string'},
        bread: { type: 'string'},
        image: { type: 'string'},
        hypoallergenic: { type: 'boolean'},
    }
}
addSchema.required = Object.keys(addSchema.properties);
delete addSchema.required.imageUrl;

module.exports = addSchema;