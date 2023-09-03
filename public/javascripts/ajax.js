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
      alert('성공');
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
      alert('성공');
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
