const updateSchema = {
    type: 'object',
    properties: {
        image: {type: 'string'},
        height: { type: 'integer'},
        weight: { type: 'integer'},
        type: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string'},
        color: { type: 'string'},
        bio: { type: 'string'},
        diet: { type: 'string'},
        bread: { type: 'string'},
        hypoallergenic: { type: 'boolean'}
    }
}

module.exports = updateSchema;