document.addEventListener('DOMContentLoaded', function () {
  const text_button = document.getElementById('text_button');
  const img_button = document.getElementById('img_button');

  text_button.addEventListener('click', () => {
    const text_input = document.getElementById('text_preview');
    const img_input = document.getElementById('img_preview');

    text_input.style.display = 'block';
    text_button.style.backgroundColor = '#B0CAF5';
    img_button.style.backgroundColor = '#FFF';
    img_input.style.display = 'none';
  });

  img_button.addEventListener('click', () => {
    const text_input = document.getElementById('text_preview');
    const img_input = document.getElementById('img_preview');

    img_input.style.display = 'block';
    img_button.style.backgroundColor = '#B0CAF5';
    text_button.style.backgroundColor = '#FFF';
    text_input.style.display = 'none';
  });
});


function previewImage() {
  const input = document.querySelector('.img_input');
  const preview = document.querySelector('.image_preview');

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.style.backgroundImage = `url('${e.target.result}')`;
    };

    reader.readAsDataURL(input.files[0]);
  }
}
