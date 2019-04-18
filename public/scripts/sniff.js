// get the pet loginID from the URL
const url = window.location.href;
const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
let _id;
// create var to hold all the logged in pet's likes
let petLikes;
// create var to hold the ID of the pet in the active carousel
let activeId;

getProfile(id);
getAllPets();

// get the logged in pet's loginID to populate profile thumbnail and links
function getProfile(id) {
  // make ajax call
  let api = '/api/pets/' + id;
  $.ajax({
    method: 'GET',
    url: api,
    success: (res) => {
      let pet = res;
      // add the logged in pet's likes to the petLikes var from above
      petLikes = pet.likes;
      _id = pet._id;
      // add profile photo to header
      $('nav .profile-icon').css('background-image', `url(/images/thumb/${pet.img})`);
      // add ID-specific links to header and add CSS to make cursor a pointer on links
      $('#profile-link').attr('href', `/profile/${pet.loginId}`);
      $('#sniff-link').attr('href', `/sniff/${pet.loginId}`);
      $('#chat-link').attr('href', `/chat/${pet.loginId}`);
      $('a').css('cursor', 'pointer');
    } ,
    error: (res) => {
    }
  });
}

// generate array of all pets
function getAllPets() {
  const api = '/api/pets';
  $.ajax({
    method: 'GET',
    url: api,
    success: handleSuccess,
    error: handleError
  });

  function handleSuccess(res){
    // filter the logged in pet's own info out of the response array
    // then filter out any pets the logged in pet already likes
    let pets = res.filter(pet => pet.loginId !== id)
                .filter(pet => petLikes.indexOf(pet._id) === -1);

    pets.forEach((pet) => {
      // properly format pet age into year or year and months
      let petFormattedAge;
      if (pet.age > 12) {
        if (pet.age % 12 === 0) {
          petFormattedAge = `${pet.age / 12} years`
        } else {
          petFormattedAge = `${pet.age / 12 } years ${pet.age % 12} months`;
        }
      } else {
        petFormattedAge = `${pet.age} months`;
      }
        let petHTML = `
        <div class="carousel-item" data-petid="${pet._id}">
          <div class="profile card text-center">
            <img src="/images/${pet.img}" class="card-img-top" alt="..." id="pet-image">
            <div class="card-body">
              <h2 class="card-title">
                <span class="bold" id="name">${pet.name}</span>
                <span> the </span>
                <span class="bold" id="type">${pet.type}</span>
              </h2>
              <p class="card-text" id="bio">${pet.bio}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item stats">
                <span class="bold prop">Age</span>
                <span class="stat">${petFormattedAge}</span>
              </li>
            </ul>
            </div>
            </div>
          `;
          $('.carousel-inner').append(petHTML);
      // }
    });
    $('.carousel-item').first().addClass('active');
    // set the initial activeId to the active carousel class
    activeId = $('.carousel-item.active')[0].dataset.petid;
    // add click listeners for carousel - null because we don't need a this object
     $('#like').on('click', likePet.bind(null, activeId));
  };

  function handleError(res){
    let error = `<h1>Error retrieving pet information. Please try again.</h1>`;
    $('main').append(error);
  };
}

 // uses POST
function likePet(likedPetId) {
  const api = `/api/like/${_id}`;
  $.ajax({
    method: 'POST',
    url: api,
    data: {liked: likedPetId},
    success: (() => {
      console.log('success');
      setTimeout(() => {
        activeId = $('.carousel-item.active')[0].dataset.petid;
      }, 500);
    }),
    error: () => {console.log(`Could not like pet ${likedPetId}.`);}
  });
}