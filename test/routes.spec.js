const chai = require('chai');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
      });
  });
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
  });
});
describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then( () => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return all items in garage', () => {
      return chai.request(server)
        .get('/api/v1/items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.be.a('object');
          response.body[0].should.have.property('name');
          response.body[0].name.should.be.a('string');
          response.body[0].should.have.property('reason');
          response.body[0].reason.should.be.a('string');
          response.body[0].should.have.property('cleanliness');
          response.body[0].cleanliness.should.be.a('string');
        })
        .catch(err => {
          throw err;
        });
    });
    it('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .get('/api/v1/sad')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(err => {
          throw err;
        });
    });
  });
  describe('POST /api/v1/items', () => {
    it('should insert an items in to the garage', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'Storm Trooper Costume',
          reason: 'Just because',
          cleanliness: 'Dusty'
        })
        .then(response => {
          response.should.have.status(201);
          response.body[0].should.be.a('number');
        })
        .catch(err => {
          throw err;
        });
    });
    it('should return 422 if value is missing', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'Storm Trooper Costume',
          cleanliness: 'Dusty'
        })
        .then(response => {
          response.should.have.status(422);
        })
        .catch(err => {
          throw err;
        });
    });
  });
  describe('PATCH /api/v1/items/:id', () => {
    it('should update an items in to the garage', () => {
      return chai.request(server)
        .patch('/api/v1/items/3')
        .send({ cleanliness: 'Dusty' })
        .then(response => {
          response.should.have.status(204);
        })
        .catch(err => {
          throw err;
        });
    });
    it('should return 422 if cleanliness is missing', () => {
      return chai.request(server)
        .patch('/api/v1/items/3')
        .send()
        .then(response => {
          response.error.text.should.equal('cleanliness property required');
          response.should.have.status(422);
        })
        .catch(err => {
          throw err;
        });
    });
    it('should return 422 if no item with ID', () => {
      return chai.request(server)
        .patch('/api/v1/items/123')
        .send({ cleanliness: 'Dusty' })
        .then(response => {
          response.error.text.should.equal('"No item with ID 123"');
          response.should.have.status(422);
        })
        .catch(err => {
          throw err;
        });
    });
  });
});
