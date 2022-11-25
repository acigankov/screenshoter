const hamburger = document.getElementById('hamburger');

//отслеживание клика по бургеру
window.addEventListener('click', function (event) {
    if (event.target.closest('.hamburger')) {
        hamburger.classList.toggle('is-active');
        return false;
    }
    hamburger.classList.remove('is-active');
});

