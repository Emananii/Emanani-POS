
    const productList = document.getElementById('scrollable-products');
    const cartItems = document.getElementById('cart-items');  // Define cartItems once
    const totalPriceElement = document.getElementById('total-price');

    document.addEventListener('DOMContentLoaded', () => {
    // Fetching products from Fake Store API
    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Loop through fetched data and create product items dynamically
            data.forEach(product => {
                // Create product item container
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.dataset.productId = product.id;

                // Create and append product image
                const productImage = document.createElement('img');
                productImage.src = product.image;
                productImage.alt = product.title;
                productImage.classList.add('product-img');
                productItem.appendChild(productImage);

                // Create and append product title
                const productTitle = document.createElement('span');
                productTitle.textContent = product.title;
                productTitle.classList.add('product-title');
                productItem.appendChild(productTitle);

                // Create and append product price
                const productPrice = document.createElement('span');
                productPrice.textContent = `$${product.price}`;
                productPrice.classList.add('product-price');
                productItem.appendChild(productPrice);

                // Add item to cart on click
                productItem.addEventListener('click', () => {
                    addProductToCart(product);
                });

                productList.appendChild(productItem);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

// Add clicked product to the cart
function addProductToCart(product) {
    const existingCartItem = Array.from(cartItems.children).find(item => item.dataset.productId === product.id.toString());

    if (existingCartItem) {
        // If the product is already in the cart, increase its quantity
        const quantityInput = existingCartItem.querySelector('input');
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateCartTotal();
    } else {
        // If product is not in the cart, create a new cart item
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.dataset.productId = product.id;

        const title = document.createElement('span');
        title.textContent = product.title;

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;
        quantityInput.min = 1;//minimum acceptable value

        quantityInput.addEventListener('input', () => {
            updateCartTotal();
        });

        const price = document.createElement('span');
        price.textContent = `$${(product.price * parseInt(quantityInput.value)).toFixed(2)}`;

        // Append elements to the cart item
        cartItem.appendChild(title);
        cartItem.appendChild(quantityInput);
        cartItem.appendChild(price);

        // Append the cart item to the cart
        cartItems.appendChild(cartItem);

        updateCartTotal();
    }
}

// Update the total price in the cart
function updateCartTotal() {
    let total = 0;

    // Loop through each cart item to calculate the total price
    Array.from(cartItems.children).forEach(item => {
        const quantityInput = item.querySelector('input');
        const priceElement = item.querySelector('.product-price');  // Target price more specifically
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        const quantity = parseInt(quantityInput.value); // Get quantity

        // Multiply price by quantity to get total for this item
        total += price * quantity;
    });

    // Display the total price in the cart
    totalPriceElement.textContent = total.toFixed(2);
}

// Event listener for payment buttons
document.getElementById('cash').addEventListener('click', () => processPayment('Cash'));
document.getElementById('mpesa').addEventListener('click', () => processPayment('Mpesa'));
document.getElementById('bank').addEventListener('click', () => processPayment('Bank'));

// Handle the payment processing (this can be enhanced to store or process payment data)
function processPayment(method) {
    const totalAmount = parseFloat(totalPriceElement.textContent);
    
    if (totalAmount === 0) {
        console.log("Payment has been triggered!!!")
        alert('Your cart is empty!');
        return;
    }

    alert(`Payment of $${totalAmount.toFixed(2)} processed via ${method}.`);
    resetCart();
}

// Reset cart after payment
function resetCart() {
    cartItems.innerHTML = '';  // Directly reference cartItems
    updateCartTotal();
}
