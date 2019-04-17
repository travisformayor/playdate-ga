$(document).ready(function(){
  // get the profile loginId from the URL
  const url = window.location.href;
  const id = parseInt(url.substring(url.lastIndexOf('/') + 1));

  getMatchesById(id);

  // generate array of all matches/chats for loginId
  function getMatchesById(loginid) {
    const api = `/api/matches/${loginid}`;
    $.ajax({
      method: 'GET',
      url: api,
      success: handleSuccess,
      error: handleError
    });

    function handleSuccess(res) {
      if (res[0].match) {
        console.log('do stuff');
      } else {
        handleError(res);
      }
    }

    function handleError(err) {
      let error = `<h1>Error retrieving pet information. Please try again.</h1>`;
      $('main').append(error);
    }
  }


  $('#action_menu_btn').click(function(){
    $('.action_menu').toggle();
  })
})
