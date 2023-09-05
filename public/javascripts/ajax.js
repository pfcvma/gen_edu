function assigment_text_ajax() {
  const text = document.getElementById('text_input').value;
  var obj = {
    text: text,
  };
  $.ajax({
    url: '/assignment_text',
    data: JSON.stringify(obj),
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    success: function (result) {
      // alert('성공');
      const answer = document.getElementById('answer_text');
      const solution = document.getElementById('solution_text');

      answer.textContent = result.answer;
      solution.textContent = result.solution;
    },
    error: function (errorThrown) {
      alert(errorThrown.statusText);
    },
  });
}

function assigment_img_ajax() {
  const fileInput = document.getElementById('img_input');
  const file = fileInput.files[0];
  const formData = new FormData(); // FormData 객체 생성
  formData.append('file', file);

  $.ajax({
    url: '/assignment_image',
    data: formData,
    contentType: false,
    processData: false,
    type: 'POST',
    success: function (result) {
      // alert('성공');
      const answer = document.getElementById('answer_text');
      const solution = document.getElementById('solution_text');

      answer.textContent = result.answer;
      solution.textContent = result.solution;
    },
    error: function (errorThrown) {
      alert(errorThrown.statusText);
    },
  });
}

function writing_ajax() {
  const purpose = document.getElementById('report_select').value;
  const title = document.getElementById('title').value;
  const subtitle = document.getElementById('subtitle').value;
  const explanation = document.getElementById('explanation').value;
  const length = document.getElementById('length').value;
  var obj = {
    purpose,
    title,
  };
  if (subtitle !== '') {
    obj['subtitle'] = subtitle;
  }
  if (explanation !== '') {
    obj['explanation'] = explanation;
  }
  if (length !== '') {
    obj['length'] = length;
  }
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];
  if (file) {
    const formData = new FormData(); // FormData 객체 생성
    formData.append('file', file);
    formData.append('reportInfo', JSON.stringify(obj));
    $.ajax({
      url: '/report_file',
      data: formData,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function (result) {
        const report = document.getElementById('report_text');

        report.innerHTML = result.report.replace(/\n/g, '<br>');
      },
      error: function (errorThrown) {
        alert(errorThrown.statusText);
      },
    });
  } else {
    $.ajax({
      url: '/report',
      data: JSON.stringify(obj),
      dataType: 'json',
      contentType: 'application/json',
      // enctype: 'multipart/form-data',
      type: 'POST',
      success: function (result) {
        // alert('성공');
        const report = document.getElementById('report_text');

        report.innerHTML = result.report.replace(/\n/g, '<br>');
      },
      error: function (errorThrown) {
        alert(errorThrown.statusText);
      },
    });
  }
}

function chat_ajax() {
  let text = document.getElementById('chat_input').value;
  const chatSpace = document.getElementById('chat_space');

  // 새로운 chat_box 요소를 생성합니다.
  const newChatBox = document.createElement('div');
  newChatBox.className = 'chat_box';

  // 새로운 request_chat 요소를 생성하고 내용을 설정합니다.
  const newRequestChat = document.createElement('p');
  newRequestChat.className = 'request_chat';
  newRequestChat.textContent = text;

  // request_chat 요소를 chat_box에 추가합니다.
  newChatBox.appendChild(newRequestChat);

  // chat_space에 새로운 chat_box를 추가합니다.
  chatSpace.appendChild(newChatBox);
  var obj = {
    request: text,
  };
  document.getElementById('chat_input').value = '';
  $.ajax({
    url: '/chat',
    data: JSON.stringify(obj),
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    success: function (result) {
      // alert('성공');
      const chatSpace = document.getElementById('chat_space');

      // 새로운 chat_box 요소를 생성합니다.
      const newChatBox = document.createElement('div');
      newChatBox.className = 'chat_box';

      // 새로운 request_chat 요소를 생성하고 내용을 설정합니다.
      const newRequestChat = document.createElement('p');
      newRequestChat.className = 'response_chat';
      newRequestChat.textContent = result.response;

      // request_chat 요소를 chat_box에 추가합니다.
      newChatBox.appendChild(newRequestChat);

      // chat_space에 새로운 chat_box를 추가합니다.
      chatSpace.appendChild(newChatBox);
    },
    error: function (errorThrown) {
      alert(errorThrown.statusText);
    },
  });
}

function file_ajax() {
  const fileInput = document.getElementById('file_input');
  const file = fileInput.files[0];
  const formData = new FormData(); // FormData 객체 생성
  formData.append('file', file);

  $.ajax({
    url: '/file_chat',
    data: formData,
    contentType: false,
    processData: false,
    type: 'POST',
    success: function (result) {
      // alert('성공');
      const chatSpace = document.getElementById('chat_space');

      // 새로운 chat_box 요소를 생성합니다.
      const newChatBox = document.createElement('div');
      newChatBox.className = 'chat_box';

      // 새로운 request_chat 요소를 생성하고 내용을 설정합니다.
      const newRequestChat = document.createElement('p');
      newRequestChat.className = 'response_chat';
      newRequestChat.innerHTML =
        '요청하신' +
        file.name +
        '의 분석이 끝났습니다! <br>궁금한점을 물어보세요!';

      // request_chat 요소를 chat_box에 추가합니다.
      newChatBox.appendChild(newRequestChat);

      // chat_space에 새로운 chat_box를 추가합니다.
      chatSpace.appendChild(newChatBox);
    },
    error: function (errorThrown) {
      alert(errorThrown.statusText);
    },
  });
}
