
    const productList = document.getElementById('scrollable-products');
    const cartItems = document.getElementById('cart-items');  //Made cartItems a global variable
    const totalPriceElement = document.getElementById('total-price');
    const searchInput = document.querySelector("#product-search input");
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    let searchedProducts = [];//for storing searched products

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
            searchedProducts = data; //start the searched products with the entire product list
            
            // Looping through the fetched data and creating product items dynamically
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
        const unitPrice = parseFloat(priceElement.dataset.unitPrice); /* Get the unit price from
                                                                         the data attribute we used
                                                                         in createCartItem */

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

    //hides the empty cart item DOM elements
    if (cartItems.children.length > 0) {
        emptyCartMessage.style.display = 'none';
    }
}
//made createCartItem function for separation of concern purposes
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

    const price = document.createElement('span');
    price.classList.add('cart-item-price'); //added this for selector purposes
    const unitPrice = product.price; // This is the price per item
    price.textContent = `$${unitPrice.toFixed(2)}`; // Show price for one item
    price.dataset.unitPrice = unitPrice; /* Storing unit price with the dataset property
                                            so that price remains constant even
                                            when increasing quantity. With this, the price rises
                                            linearly rather than exponentially*/

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
    updateCartTotal();  // Must Update the total price after removal
    console.log(`Removed product with ID ${productId} from the cart`);//confirm function working as expected

    if (cartItems.children.length === 0) {
        emptyCartMessage.style.display = 'block';
    }

}

// Adjust the quantity of an item by either +1 or -1
function adjustQuantity(cartItem, adjustment) {
    const quantityInput = cartItem.querySelector('input');
    const priceElement = cartItem.querySelector('.cart-item-price');
    
    let newQuantity = parseInt(quantityInput.value) + adjustment;
    
    // Quantity must not go below 1
    if (newQuantity < 1) return;

    // Update the quantity and price
    quantityInput.value = newQuantity;
    const price = parseFloat(priceElement.textContent.replace('$', '')) / (newQuantity - adjustment);  // Calculate price per item
    const newPrice = price * newQuantity;
    priceElement.textContent = `$${newPrice.toFixed(2)}`; // Update the price display

    updateCartTotal(); // Recalculate total price after price adjustment
}

// Update the total price in the cart
function updateCartTotal() {
    let total = 0;

    // Looping through each cart item to calculate the total price
    Array.from(cartItems.children).forEach(item => {
        if (item.classList.contains('empty-cart-message')) return;//skip checking this part
        console.log(item);//checking the structure of the cart item
        const quantityInput = item.querySelector('input');
        const priceElement = item.querySelector('.cart-item-price');
        
        if (!priceElement) {
            console.warn('Price element not found for:', item);
            return;  // Skip this iteration if price is missing
        }

        const unitPrice = parseFloat(priceElement.dataset.unitPrice);
        const quantity = parseInt(quantityInput.value); // Get quantity

        // Multiply price by quantity to get total for this item
        console.log(`Unit Price is: ${unitPrice} and quantity is ${quantity}`)
        total += unitPrice * quantity;
        console.log(`Total is: ${total}`);
    });

    // Display the total price in the cart
    totalPriceElement.textContent = total.toFixed(2);
}

// Event listener for payment buttons
document.getElementById('cash').addEventListener('click', () => processPayment('Cash'));
document.getElementById('mpesa').addEventListener('click', () => processPayment('Mpesa'));
document.getElementById('bank').addEventListener('click', () => processPayment('Bank'));

// Handle the payment processing (will enhance this in the future to store and process payment data)
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
    cartItems.innerHTML = '';  // return innerText to an empty string
    updateCartTotal();
}

function renderProducts(products) {
    productList.innerHTML = ''; // Clear the current list
    products.forEach(product => {
        const productItem = createProductItem(product);
        productList.appendChild(productItem);
    });
}

//adding search functionality
searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();
    const filteredProducts = searchedProducts.filter(product => 
        product.title.toLowerCase().includes(searchText)
    );
    renderProducts(filteredProducts); // Use existing function
});
