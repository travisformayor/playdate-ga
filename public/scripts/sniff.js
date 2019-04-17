// get the pet loginID from the URL
const url = window.location.href;
const id = parseInt(url.substring(url.lastIndexOf('/') + 1));

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
      // add profile photo to header
      $('nav .profile-icon').css('background-image', `url(/images/thumb/${pet.img})`);
      // add ID-specific links to header and add CSS to make cursor a pointer on links
      $('#profile-link').attr('href', `/profile/${pet.loginId}`);
      $('#profile-link').css('cursor', 'pointer');
      $('#sniff-link').attr('href', `/sniff/${pet.loginId}`);
      $('#sniff-link').css('cursor', 'pointer');
      $('#chat-link').attr('href', `/chat/${pet.loginId}`);
      $('#chat-link').css('cursor', 'pointer');
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
    let pets = res;
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
      // don't push to pets array if the id is equal to current pet
      // if (pet.loginId !== currId) {
        let petHTML = `
        <div class="carousel-item">
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
  };

  function handleError(res){
    let error = `<h1>Error retrieving pet information. Please try again.</h1>`;
    $('main').append(error);
  };
}