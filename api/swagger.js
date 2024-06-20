const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })

const env = process.env.NODE_ENV || 'development'

const doc = {
  info: {
    title: 'Fagord API',
    description: 'Åpent API for deg som ønsker å jobbe med fagtermer'
  },
  host: env === 'development' ? 'localhost:8080' : 'fagord.no',
  tags: ['Artikler', 'Fagfelt', 'Termer'],
  components: {
    schemas: {
      Variant: {
        $term: 'overgangsmetall',
        $dialect: 'nb',
        votes: '3'
      },
      Term: {
        $_id: 'transition_metal_1',
        $en: 'transition metal',
        nb: 'overgangsmetall',
        nn: 'overgangsmetall',
        variants: {
          schema: {
            $ref: '#/components/schemas/Variant'
          }
        },
        field: 'Kjemi',
        subfield: 'Uorganisk kjemi',
        $pos: 'Substantiv',
        reference: 'https://no.wikipedia.org/wiki/Overgangsmetall',
        $_added: '2020-10-07T10:00:00.000Z',
        $_modified: '2020-10-07T10:00:00.000Z',
        $_active: true,
        definition: 'Metall i d-blokka i periodesystemet'
      }
    }
  }
}

const outputFile = './swagger.json'
const endpointsFiles = ['./index.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
