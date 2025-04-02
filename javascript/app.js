/* This is where I manage which section is visible based on what the user clicks on the
navigation pane */

const navigation = document.getElementById('navigation');
const sales = document.getElementById('sales');
const pos = document.getElementById('pos')
const inventory = document.getElementById('inventory');

navigation.addEventListener('change', function () {
    const selectedPage = this.value;

    //first I'm going to hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.style.display = 'none';
    });

    //If else statements to decide which sections get displayed
    if (selectedPage === 'inventory') {
        inventory.style.display = 'block';
        renderInventory(); // Call inventory function
    } else if (selectedPage === 'sales') {
        sales.style.display = 'block';
        loadSales(); // Call sales function
    } else {
        pos.style.display = 'block';
    }
});
