const toggler = document.querySelector('.language-toggler');
const togglerText = document.querySelector('.language-toggler span');
const togglerItems = document.querySelectorAll('.language-dropdown__item');

toggler.addEventListener('click', function (event) {
   toggler.classList.toggle('language-toggler_open');
});

togglerItems.forEach(function (elem){
   elem.addEventListener('click', function (event) {
      togglerItems.forEach(function (item) {item.classList.remove('active')});
      elem.classList.toggle('active');
      togglerText.innerHTML = elem.innerHTML;
   });
});

