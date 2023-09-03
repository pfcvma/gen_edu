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

// function writing_ajax() {
//   const purpose = document.getElementById('report_select').value;
//   const title = document.getElementById('title').value;
//   const subtitle = document.getElementById('subtitle').value;
//   const explanation = document.getElementById('explanation').value;
//   const length = document.getElementById('length').value;
//   var obj = {
//     purpose,
//     title,
//   };
//   if (subtitle !== '') {
//     obj['subtitle'] = subtitle;
//   }
//   if (explanation !== '') {
//     obj['explanation'] = explanation;
//   }
//   if (length !== '') {
//     obj['length'] = length;
//   }
//   const fileInput = document.getElementById('file');
//   const file = fileInput.files[0];
//   if (file) {
//     const formData = new FormData(); // FormData 객체 생성
//     formData.append('file', file);
//     $.ajax({
//       url: '/file',
//       data: formData,
//       contentType: false,
//       processData: false,
//       type: 'POST',
//       success: function (result) {
//         obj['file'] = result.file;
//         console.log(result.file);
//         // $.ajax({
//         //   url: '/report',
//         //   data: JSON.stringify(obj),
//         //   dataType: 'json',
//         //   contentType: 'application/json',
//         //   // enctype: 'multipart/form-data',
//         //   type: 'POST',
//         //   success: function (result) {
//         //     alert('성공');
//         //     const report = document.getElementById('report_text');
//         //
//         //     report.innerHTML = result.report.replace(/\n/g, '<br>');
//         //   },
//         //   error: function (errorThrown) {
//         //     alert(errorThrown.statusText);
//         //   },
//         // });
//       },
//       error: function (errorThrown) {
//         alert(errorThrown.statusText);
//       },
//     });
//   } else {
//     $.ajax({
//       url: '/report',
//       data: JSON.stringify(obj),
//       dataType: 'json',
//       contentType: 'application/json',
//       // enctype: 'multipart/form-data',
//       type: 'POST',
//       success: function (result) {
//         alert('성공');
//         const report = document.getElementById('report_text');
//
//         report.innerHTML = result.report.replace(/\n/g, '<br>');
//       },
//       error: function (errorThrown) {
//         alert(errorThrown.statusText);
//       },
//     });
//   }
// }

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
        // $.ajax({
        //   url: '/report',
        //   data: JSON.stringify(obj),
        //   dataType: 'json',
        //   contentType: 'application/json',
        //   // enctype: 'multipart/form-data',
        //   type: 'POST',
        //   success: function (result) {
        //     alert('성공');
        //     const report = document.getElementById('report_text');
        //
        //     report.innerHTML = result.report.replace(/\n/g, '<br>');
        //   },
        //   error: function (errorThrown) {
        //     alert(errorThrown.statusText);
        //   },
        // });
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
        alert('성공');
        const report = document.getElementById('report_text');

        report.innerHTML = result.report.replace(/\n/g, '<br>');
      },
      error: function (errorThrown) {
        alert(errorThrown.statusText);
      },
    });
  }
}
