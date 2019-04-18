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
        console.log(res);
        // TODO: switch to db img
        //$('nav .profile-icon').css('background-image', `url(/images/thumb/${pet.img})`);
        $('nav .profile-icon').css('background-image', `url(/images/thumb/moxie.jpg)`);

        //build matches
        $('.contacts').append(`
          <li data-with-id="someId">
          <div class="d-flex bd-highlight">
            <div class="img_cont">
              <img src="/images/thumb/badger.jpg" class="rounded-circle user_img">
            </div>
            <div class="user_info">
              <span>Badger</span>
            </div>
          </div>
        </li>`
      )

      //build chat header
      $('.msg_head').prepend(`
          <div class="d-flex bd-highlight">
            <div class="img_cont">
              <img src="/images/thumb/bailey.jpg" class="rounded-circle user_img">
            </div>
            <div class="user_info">
              <span>DYNAMIC Chat with Bailey</span>
            </div>
          </div>`
        )

        //build message from match
        $('.msg_card_body').append(`
          <div class="d-flex justify-content-start mb-4">
            <div class="img_cont_msg">
              <img src="/images/thumb/bailey.jpg" class="rounded-circle user_img_msg">
            </div>
            <div class="msg_cotainer">
              Hi, how are you moxie?
              <span class="msg_time">8:40 AM, Today</span>
            </div>
          </div>`
        )

        //build message from user
        $('.msg_card_body').append(`
            <div class="d-flex justify-content-end mb-4">
              <div class="msg_cotainer_send">
                Hi bailey i am good tnx how about you?
                <span class="msg_time_send">8:55 AM, Today</span>
              </div>
              <div class="img_cont_msg">
            <img src="/images/thumb/moxie.jpg" class="rounded-circle user_img_msg">
              </div>
            </div>`
          )

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
