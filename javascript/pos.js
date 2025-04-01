
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
                const productItem = createProductItem(product);
                productList.appendChild(productItem);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

function createProductItem(product) {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.dataset.productId = product.id;

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.title;
    productImage.classList.add('product-img');
    productItem.appendChild(productImage);

    const productTitle = document.createElement('span');
    productTitle.textContent = product.title;
    productTitle.classList.add('product-title');
    productItem.appendChild(productTitle);

    const productPrice = document.createElement('span');
    productPrice.textContent = `$${product.price}`;
    productPrice.classList.add('product-price');
    productItem.appendChild(productPrice);

    //when user clicks on the image, add product to cart
    productItem.addEventListener('click', () => {
        addProductToCart(product);
    });

    return productItem;
}

// Add clicked product to the cart
function addProductToCart(product) {
    console.log(product);
    const existingCartItem = Array.from(cartItems.children).find(item => item.dataset.productId === product.id.toString());

    if (existingCartItem) {
        // If the product is already in the cart, increase its quantity
        const quantityInput = existingCartItem.querySelector('input');
        const priceElement = existingCartItem.querySelector('.cart-item-price')
        const unitPrice = parseFloat(priceElement.dataset.unitPrice); // Get the unit price from the data attribute

        const newQuantity = parseInt(quantityInput.value) + 1;
        quantityInput.value = newQuantity;

        //now increasing price relative to quantity
        const newPrice = unitPrice * newQuantity;
        priceElement.textContent = `$${newPrice.toFixed(2)}`//this displays the updated price

        updateCartTotal();
    } else {
        //create a new cart item if its not in the cart
        const cartItem = createCartItem(product);
        cartItems.appendChild(cartItem);
        updateCartTotal();
    }
}

function createCartItem(product) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.dataset.productId = product.id;

    const title = document.createElement('span');
    title.textContent = product.title;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = 1;
    quantityInput.min = 1;
    quantityInput.addEventListener('input', updateCartTotal);

    // The price should be based on the unit price (not multiplied by quantity)
    const price = document.createElement('span');
    price.classList.add('cart-item-price'); //added this for selector purposes
    const unitPrice = product.price; // This is the price per item
    price.textContent = `$${unitPrice.toFixed(2)}`; // Show price for one item
    price.dataset.unitPrice = unitPrice; // Store unit price as a data attribute

    //adding a remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-item');
    removeButton.addEventListener('click', () => removeItemFromCart(cartItem, product.id));

    //Create the quantity adjustment buttons
    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.classList.add('adjust-quantity');
    increaseButton.addEventListener('click', () => adjustQuantity(cartItem, 1));

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.classList.add('adjust-quantity');
    decreaseButton.addEventListener('click', () => adjustQuantity(cartItem, -1));
    
    cartItem.appendChild(title);
    cartItem.appendChild(quantityInput);
    cartItem.appendChild(price);
    cartItem.appendChild(removeButton);
    cartItem.appendChild(increaseButton);
    cartItem.appendChild(decreaseButton);

      // Added logging to verify price creation
    console.log('Created cart item with price:', price.textContent);

    return cartItem;
}

// Remove an item from the cart
function removeItemFromCart(cartItem, productId) {
    cartItem.remove();  // Remove the cart item element from the DOM
    updateCartTotal();  // Update the total price after removal
    console.log(`Removed product with ID ${productId} from the cart`);
}

// Adjust the quantity of an item (either +1 or -1)
function adjustQuantity(cartItem, adjustment) {
    const quantityInput = cartItem.querySelector('input');
    const priceElement = cartItem.querySelector('.cart-item-price');
    
    let newQuantity = parseInt(quantityInput.value) + adjustment;
    
    // Ensure quantity does not go below 1
    if (newQuantity < 1) return;

    // Update the quantity and price
    quantityInput.value = newQuantity;
    const price = parseFloat(priceElement.textContent.replace('$', '')) / (newQuantity - adjustment);  // Calculate price per item
    const newPrice = price * newQuantity;
    priceElement.textContent = `$${newPrice.toFixed(2)}`; // Update the price display

    updateCartTotal(); // Recalculate total price
}

// Update the total price in the cart
function updateCartTotal() {
    let total = 0;

    // Loop through each cart item to calculate the total price
    Array.from(cartItems.children).forEach(item => {
        const quantityInput = item.querySelector('input');
        const priceElement = item.querySelector('.cart-item-price');  // Target price more specifically
        
        if (!priceElement) {
            console.warn('Price element not found for:', item);
            return;  // Skip this iteration if price is missing
        }
        
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
