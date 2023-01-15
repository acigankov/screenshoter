const closeButtons = document.querySelectorAll('.faq-item__toggler');

function closeAll(items, activeClassName) {
    items.forEach(function (item) {
        if(item.classList.contains(activeClassName)) {
            item.classList.remove(activeClassName);
        }
    })
}

closeButtons.forEach(function (item) {
    item.addEventListener('click' , function (event) {

       closeAll(closeButtons, 'active');

        this.classList.toggle('active');
    })
})