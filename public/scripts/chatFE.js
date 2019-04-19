$(document).ready(function(){
  // get the profile loginId from the URL
  const url = window.location.href;
  const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
  const chatEvent = {};
  let matchesData = {};

  // add ID-specific links to header
$('#profile-link').attr('href', `/profile/${id}`);
$('#sniff-link').attr('href', `/sniff/${id}`);
$('#chat-link').attr('href', `/chat/${id}`);

  getMatchesById(id);

  function getMatchesById(loginid) {
    const api = `/api/matches/${loginid}`;
    $.ajax({
      method: 'GET',
      url: api,
      success: handleSuccess,
      error: handleError
    });

    function handleSuccess(res) {
      if (true) {
        matchesData = res;
        $('nav .profile-icon').css('background-image', `url(/images/thumb/${res.img})`);
        $('#preChat').attr('src', `/images/thumb/${res.img}`);

        //build matches
        res.likes[0].foundMatches.forEach(match => {
          buildMatch(match);
        })

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
      <li data-match-id="${contact.match[0].id}">
        <div class="d-flex bd-highlight">
          <div class="img_cont">
            <img src="/images/thumb/${contact.match[0].img}" class="rounded-circle user_img">
          </div>
          <div class="user_info">
            <span>${contact.match[0].name}</span>
          </div>
        </div>
      </li>`
    )
  }

  function buildChatHead(name, img) {
    $('.msg_head').empty();
    $('.msg_head').prepend(`
        <div class="d-flex bd-highlight">
          <div class="img_cont">
            <img src="/images/thumb/${img}" class="rounded-circle user_img">
          </div>
          <div class="user_info">
            <span>Chat with ${name}</span>
          </div>
        </div>`
      )
  }

  function buildMatchMessage(msg, img) {
    let time = new Date(msg.time);
    $('.msg_card_body').prepend(`
      <div class="d-flex justify-content-start mb-4">
        <div class="img_cont_msg">
          <img src="/images/thumb/${img}" class="rounded-circle user_img_msg">
        </div>
        <div class="msg_container">
          ${msg.content}
          <span class="msg_time">${time.toDateString()}</span>
        </div>
      </div>`
    )
  }

  function buildUserMessage(msg, img) {
    let time = new Date(msg.time);
    $('.msg_card_body').prepend(`
      <div class="d-flex justify-content-end mb-4">
        <div class="msg_container_send">
          ${msg.content}
          <span class="msg_time_send">${time.toDateString()}</span>
        </div>
        <div class="img_cont_msg">
      <img src="/images/thumb/${img}" class="rounded-circle user_img_msg">
        </div>
      </div>`
    )
  }

  function handlePostSuccess(res) {
  }
  function handlePostError(err) {
    console.log(`Error: ${err}`);
  }

  function buildChat() {
    console.log(chatEvent)
    buildChatHead(chatEvent.chatData.match[0].name, chatEvent.chatData.match[0].img);
    // add the messages
    $('.msg_card_body').empty();
    chatEvent.chatData.chatId.messages.forEach((msg) => {
      if (msg.senderId === chatEvent.chatWithId) {
        buildMatchMessage(msg, chatEvent.chatData.match[0].img);
      } else {
        buildUserMessage(msg, matchesData.img);
      }
    })
    // add data to button for updating Chat collection
    $('.send_btn').attr('data-chat-id', chatEvent.chatData.chatId._id);
    $('textarea').focus();
  }

// EVENT Handling

  $('.contacts').on('click', 'li', e => {
    getMatchesById(id);
    const chatWithId = e.currentTarget.dataset.matchId;
    const chatData = matchesData.likes[0].foundMatches.find((match) => {
      return match.match[0].id == chatWithId;
    })
    chatEvent.chatWithId = chatWithId;
    chatEvent.chatData = chatData;
    buildChat();
    chatEvent.interval = setInterval(buildChat, 5000);
  })


  $('.send_btn').on('click', (e) => {
    const content = $('textarea').val();
    if (content !== '') {
      let msg = {senderId: `${matchesData._id}`, content: `${content}`, time: Date.now()};
      buildUserMessage(msg, matchesData.img)

      $.ajax({
        method: 'POST',
        url: `/api/message/${e.currentTarget.dataset.chatId}`,
        data: JSON.stringify(msg),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: handlePostSuccess,
        error: handlePostError
      })

      $('textarea').val('').attr('placeholder', '').focus();
    }
  })
  $('textarea').on('keyup', (e) => {
    if (e.which === 13) $('.send_btn').click();
  })
})
