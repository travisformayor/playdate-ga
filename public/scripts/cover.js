// Get all pets info
let api = '/api/pets/';
$.ajax({
  method: 'GET',
  url: api,
  success: handleSuccess,
  error: handleError
});

function handleError(err) {
  // insert errorhHandler
}
function handleSuccess(res) {
  if (res.length > 0) {
    res.forEach(pet => {
      let img = pet.img;

      let petHtml = `
          <div class="loginHolder">
            <div class="imgHold" id="${pet._id}">

            </div>
            <h3>${pet.name}</h3>
            <a href="/profile/${pet.loginId}" class="btn btn-lg btn-secondary">Login</a>
          </div>`;
      $('#petList').append(petHtml);
      $(`#${pet._id}`).css('background-image', `url(/images/thumb/${pet.img})`);
    })
  }
}