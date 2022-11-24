const toggler = document.querySelector('.language-toggler');
const togglerText = document.querySelector('.language-toggler span');
const togglerItems = document.querySelectorAll('.language-dropdown__item');

//клик в окне
window.addEventListener('click', function (event) {
   if(event.target.closest('.language-toggler')) {
      toggler.classList.toggle('language-toggler_open');
      return false;
   }
   toggler.classList.remove('language-toggler_open');

});

togglerItems.forEach(function (elem){
   elem.addEventListener('click', function (event) {
      togglerItems.forEach(function (item) {item.classList.remove('active')});
      elem.classList.toggle('active');
      togglerText.innerHTML = elem.innerHTML;
   });
});

