const db = require('./models');

// Declare seed data.
const petSeed = [
  {loginId: 1, name: 'Badger', img: 'badger.jpg', age: '6 years', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 2, name: 'Bailey', img: 'bailey.jpg', age: '11 years', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 3, name: 'Bedelia', img: 'bedelia.jpg', age: '7 months', type: 'Bearded Dragon', bio: 'Placeholder Bio.', likes: []},
  {loginId: 4, name: 'Coraline', img: 'coraline.jpg', age: '2 years', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 5, name: 'Dakota', img: 'dakota.jpg', age: '11 years', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 6, name: 'Frodo', img: 'frodo.jpg', age: '6 months', type: 'Gecko', bio: 'Placeholder Bio.', likes: []},
  {loginId: 7, name: 'Indiana Bones', img: 'indianabones.jpg', age: '5 months', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 8, name: 'King Bee', img: 'kingbee.jpg', age: '1 week', type: 'Ducky', bio: 'Quack. Placeholder Bio.', likes: []},
  {loginId: 9, name: 'Lucky', img: 'lucky.jpg', age: '5 years', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 10, name: 'Moxie', img: 'moxie.jpg', age: '10 years', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 11, name: 'Nadia', img: 'nadia.jpg', age: '7 years', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 12, name: 'Oreo', img: 'oreo.jpg', age: '5 years', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 13, name: 'Orpheus', img: 'orpheus.jpg', age: '2 years', type: 'Tortoise', bio: 'Placeholder Bio.', likes: []},
  {loginId: 14, name: 'Penelope', img: 'penelope.jpg', age: '2 years', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 15, name: 'Persephone', img: 'persephone.jpg', age: '4 months', type: 'Gecko', bio: 'Placeholder Bio.', likes: []},
  {loginId: 16, name: 'Sabriel', img: 'sabriel.jpg', age: '7 years', type: 'Ball Python', bio: 'Placeholder Bio.', likes: []},
  {loginId: 17, name: 'Sierra', img: 'sierra.jpg', age: '8 years', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 18, name: 'Smaug', img: 'smaug.jpg', age: '10 months', type: 'Bearded Dragon', bio: 'Placeholder Bio.', likes: []},
  {loginId: 19, name: 'Venus', img: 'venus.jpg', age: '4 months', type: 'Rosy Boa', bio: 'Placeholder Bio.', likes: []}
];

// DELETE all existing data from collections in order of dependency

// DELETE all Matches
db.Match.deleteMany({}, (err, deletedMatches) => {
  if (err) {
    console.log(`Error deleting matches: ${err}`);
    return;
  }
  console.log(`Removed all pets: ${JSON.stringify(deletedMatches)}`);
  // DELETE all Chats
  db.Chat.deleteMany({}, (err, deletedChats) => {
    if (err) {
      console.log(`Error deleting chats: ${err}`);
      return;
    }
    console.log(`Removed all matches: ${JSON.stringify(deletedChats)}`);
    // DELETE all Pets
    db.Pet.deleteMany({}, (err, deletedPets) => {
      if (err) {
        console.log(`Error deleting pets: ${err}`);
        return;
      }
      console.log(`Removed all chats: ${JSON.stringify(deletedPets)}`);
      // Successfully cleared all collections
      // Can now insert seed data
      seedCollections(); 
    });
  });
});



// // DELETE all Pets
// db.Pet.deleteMany({}, (err, deletedPets) => {
//   if (err) {
//     console.log(`Error deleting pets: ${err}`);
//     return;
//   }
//   console.log(`Removed all pets: ${JSON.stringify(deletedPets)}`);

//   // CREATE all Pets
//   db.Pet.create(seedPets, (err, createdPets) => {
//     if (err) {
//       console.log(`Error creating pets: ${err}`);
//       return;
//     }
//     console.log(`recreated all pets: ${createdPets}`);
//     console.log(`created ${createdPets.length} pets`);
//     return process.exit(0);
//   })
// })
