const hamburger = document.getElementById('hamburger');
const menu = document.querySelector('.top-menu__list');

//отслеживание клика по бургеру
hamburger.addEventListener('click', function (event) {
    this.classList.toggle('is-active');

    if(!menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        menu.classList.add('active');
    } else {
        document.body.style.overflow = 'auto';
        menu.classList.remove('active');
    }
    
});

