const express = require('express');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const app = express();
const bodyParser = require('body-parser');

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};
if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.locals.title = 'Garage Bin';

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      if (items.length < 1) {
        response.status(404).json({ error: 'No items found' });
      }
      response.status(200).json(items);
    })
    .catch(error => {
      response.status(500).json(error);
    });
});
app.post('/api/v1/items', (request, response) => {
  for (let requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!request.body[requiredParameter]) {
      return response.status(422)
        .json({ error: `Expected format: { name: <String>, reason: <String>, cleanliness: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('items').insert(request.body, 'id')
    .then(id => {
      response.status(201).json(id);
    })
    .catch(error => {
      response.status(500).json(error);
    });
});
app.patch('/api/v1/items/:id', (request, response) => {
  if (!request.body.cleanliness) {
    return response.status(422)
      .send({ error: 'cleanliness property required' });
  }
  database('items').where('id', request.params.id).update({ cleanliness: request.body.cleanliness})
    .then(result => {
      if (!result) {
        response.status(422).json({ error: `No item with ID ${request.params.id}` });
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json(error);
    });
});

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
