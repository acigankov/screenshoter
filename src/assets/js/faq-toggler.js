const closeButtons = document.querySelectorAll('.faq-item__toggler');

closeButtons.forEach(function (item) {
    item.addEventListener('click' , function (event) {
       this.classList.toggle('active');
       const targetData = item.getAttribute('data-toggler');
       const textBlock = document.querySelector('.content-row__description[data-description="' + targetData + '"]');

       textBlock.classList.toggle('active');
    })
})