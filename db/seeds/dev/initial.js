
exports.seed = function(knex) {
  return knex('items').del()
    .then(() => knex.raw('ALTER SEQUENCE items_id_seq RESTART WITH 1'))
    .then(() => {
      return knex('items').insert([
        {
          name: 'Leaf Blower',
          reason: 'Store for fall',
          cleanliness: 'Dusty'
        }, {
          name: 'Broken Axe',
          reason: 'I have a hording problem',
          cleanliness: 'Rancid'
        }, {
          name: 'New Bumper for car I sold',
          reason: 'I paid for it',
          cleanliness: 'Sparkling'
        }
      ]);
    })
    // eslint-disable-next-line no-console
    .then(() => console.log('Seeding complete!'))
    // eslint-disable-next-line no-console
    .catch(error => console.log(`Error seeding data: ${error}`));
};
