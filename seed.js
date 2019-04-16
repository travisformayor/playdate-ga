const db = require('./models');

const seedPets = [
  {
    loginId: 1,
    name: 'Godzilla',
    type: 'monster',
    age: 1267,
    bio: 'Young at heart monster who likes stomping through downtown Tokyo. ',
    img: '/images/godzilla.jpg',
    likes: ['user3', 'user6']
  }
];

// DELETE all Pets
db.Pet.deleteMany({}, (err, deletedPets) => {
  if (err) {
    console.log(`Error deleting pets: ${err}`);
    return;
  }
  console.log(`Removed all pets: ${JSON.stringify(deletedPets)}`);

  // CREATE all Pets
  db.Pet.create(seedPets, (err, createdPets) => {
    if (err) {
      console.log(`Error creating pets: ${err}`);
      return;
    }
    console.log(`recreated all pets: ${createdPets}`);
    console.log(`created ${createdPets.length} pets`);
    return process.exit(0);
  })
})
