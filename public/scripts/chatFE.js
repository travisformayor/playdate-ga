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
        let matchArr = [];
        res.forEach(result => {matchArr = matchArr.concat(result.match)})
        matchArr.sort();
        let user_id = '';

        for (i = 0; i < matchArr.length - 1; i++) {
          if (matchArr[i] === matchArr[i + 1]) {user_id = matchArr[i]; break;}
        }

        matchArr.forEach(match => {
          if (match !== user_id) buildMatch(match);
        })

        buildChatHead(user_id);
        buildMatchMessage(res[0].chatId.messages[0]);
        buildUserMessage(res[0].chatId.messages[1]);

      } else {
        handleError(res);
      }
    }

    function handleError(err) {
      let error = `<h1>Error retrieving pet information. Please try again.</h1>`;
      $('main').append(error);
    }
  }

  function buildMatch(contact) {
    $('.contacts').append(`
      <li data-with-id="${contact}">
        <div class="d-flex bd-highlight">
          <div class="img_cont">
            <img src="/images/thumb/badger.jpg" class="rounded-circle user_img">
          </div>
          <div class="user_info">
            <span>${contact.substring(18)}</span>
          </div>
        </div>
      </li>`
    )
  }

  function buildChatHead(id) {
    $('.msg_head').prepend(`
        <div class="d-flex bd-highlight">
          <div class="img_cont">
            <img src="/images/thumb/bailey.jpg" class="rounded-circle user_img">
          </div>
          <div class="user_info">
            <span>DYNAMIC Chat with ${id.substring(18)}</span>
          </div>
        </div>`
      )
  }

  function buildMatchMessage(msg) {
    $('.msg_card_body').prepend(`
      <div class="d-flex justify-content-start mb-4">
        <div class="img_cont_msg">
          <img src="/images/thumb/bailey.jpg" class="rounded-circle user_img_msg">
        </div>
        <div class="msg_cotainer">
          ${msg.content}
          <span class="msg_time">${msg.time}</span>
        </div>
      </div>`
    )
  }

  function buildUserMessage(msg) {
    $('.msg_card_body').prepend(`
      <div class="d-flex justify-content-end mb-4">
        <div class="msg_cotainer_send">
          ${msg.content}
          <span class="msg_time_send">${msg.time}</span>
        </div>
        <div class="img_cont_msg">
      <img src="/images/thumb/moxie.jpg" class="rounded-circle user_img_msg">
        </div>
      </div>`
    )
  }

  $('#action_menu_btn').click(function(){
    $('.action_menu').toggle();
  })
})
