document.addEventListener('DOMContentLoaded', () => {
    const inventorySection = document.getElementById('inventory');
    const inventoryList = document.getElementById('inventory-list');
    const searchInput = document.getElementById('inventory-search');
    const navigation = document.getElementById('navigation');

    let inventory = []; //for storing searched products

    // 🔹 Show Inventory Page When Selected
    navigation.addEventListener('change', () => {
        const selectedPage = navigation.value;
        document.getElementById('pos').style.display = selectedPage === 'pos' ? 'block' : 'none';
        inventorySection.style.display = selectedPage === 'inventory' ? 'block' : 'none';
    });

    // 🔹 Fetch inventory from Fake Store API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            inventory = data;
            renderInventory(inventory);
        })
        .catch(error => console.error('Error fetching inventory:', error));

    // 🔹 Function to create a row for a product
    function createInventoryRow(product) {
        const row = document.createElement('tr');
        row.dataset.id = product.id;

        row.innerHTML = `
            <td>${product.title}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><input type="number" value="${product.rating.count}" min="0" class="stock-input"></td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        return row;
    }

    // 🔹 Render inventory table
    function renderInventory(filteredData) {
        inventoryList.innerHTML = ''; // Clear previous content
        filteredData.forEach(product => {
            inventoryList.appendChild(createInventoryRow(product));
        });
    }

    // 🔹 Handle search functionality
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredInventory = inventory.filter(product => 
            product.title.toLowerCase().includes(searchText)
        );
        renderInventory(filteredInventory); // Use existing function
    });

    // 🔹 Handle stock updates
    inventoryList.addEventListener('input', event => {
        if (event.target.classList.contains('stock-input')) {
            const row = event.target.closest('tr');
            const productId = row.dataset.id;
            let newStock = parseInt(event.target.value);
            newStock = isNaN(newStock) ? 0 : newStock; // Prevent NaN

            const product = inventory.find(item => item.id == productId);
            if (product) {
                product.rating.count = newStock;
            }
        }
    });

    // 🔹 Handle product deletion
    inventoryList.addEventListener('click', event => {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.closest('tr');
            const productId = row.dataset.id;

            inventory = inventory.filter(product => product.id != productId);
            renderInventory(inventory); // Re-render after deletion
        }
    });
});
