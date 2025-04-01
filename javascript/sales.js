document.addEventListener('DOMContentLoaded', () => {
    const salesList = document.getElementById('sales-list');
    const searchInput = document.getElementById('sales-search');
    const dateRangeInput = document.getElementById('sales-date-range');
    let salesData = [];

    // Fetch sales data from a third-party API
    fetch('https://fakestoreapi.com/products')  // Replace with the actual API URL
        .then(response => response.json())
        .then(data => {
            salesData = data;  // Assuming the API returns an array of sales objects
            loadSales();  // Render sales data after fetching
        })
        .catch(error => console.error('Error fetching sales data:', error));

    // Render the sales table
    function loadSales() {
        salesList.innerHTML = ''; // Clear the previous content
        salesData.forEach(sale => {
            const row = document.createElement('tr');
            row.dataset.id = sale.id;

            // Format products info for display (Assuming `products` is an array of objects)
            const productNames = sale.products.map(p => `${p.name} (${p.quantity})`).join(', ');

            row.innerHTML = `
                <td>${sale.date}</td>
                <td>${productNames}</td>
                <td>$${sale.totalAmount.toFixed(2)}</td>
                <td>${sale.paymentMethod}</td>
                <td><button class="view-btn">View</button></td>
            `;

            salesList.appendChild(row);
        });
    }

    // Handle search functionality for sales
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();

        const filteredSales = salesData.filter(sale => {
            // Filter by product name (can be expanded to include other fields like date, etc.)
            return sale.products.some(product =>
                product.name.toLowerCase().includes(searchText)
            );
        });

        salesData = filteredSales; // Update salesData with the filtered result
        loadSales();
    });

    // Handle date range filtering (optional)
    dateRangeInput.addEventListener('change', () => {
        const [startDate, endDate] = dateRangeInput.value.split(' - ');
        const filteredSales = salesData.filter(sale => {
            return new Date(sale.date) >= new Date(startDate) && new Date(sale.date) <= new Date(endDate);
        });

        salesData = filteredSales; // Update salesData with the filtered result
        loadSales();
    });

    // Initially render all sales data
    loadSales();
});
