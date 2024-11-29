document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartPanel = document.getElementById('cart-panel');
    const backButton = document.getElementById('back-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceDisplay = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');
    const searchInput = document.getElementById('search-bar');
    const progressBar = document.getElementById('progress-bar'); // Progress bar element
    let cartItems = [];

    // Function to update the cart display
    const updateCartDisplay = () => {
        cartItemsList.innerHTML = ''; // Clear the current cart items
        let total = 0;
        
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - KSh ${item.price}`;
            
            // Create remove button for each item
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-item');
            removeButton.addEventListener('click', () => removeItem(index));
            
            // Append remove button to the list item
            li.appendChild(removeButton);
            cartItemsList.appendChild(li);
            
            total += item.price;
        });

        totalPriceDisplay.textContent = `Total: KSh ${total}`;
        document.getElementById('item-count').textContent = cartItems.length;
    };

    // Function to remove an item from the cart
    const removeItem = (index) => {
        cartItems.splice(index, 1); // Remove the item at the specified index
        updateCartDisplay(); // Update the cart display after removal
        saveCartToLocalStorage(); // Save the updated cart to localStorage
    };

    // Function to save the cart to localStorage
    const saveCartToLocalStorage = () => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };

    // Function to load the cart from localStorage
    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            updateCartDisplay(); // Update the display with the saved cart
        }
    };

    // Handle opening and closing the cart panel
    cartButton.addEventListener('click', () => {
        cartPanel.classList.add('open'); // Open the cart panel
    });

    backButton.addEventListener('click', () => {
        cartPanel.classList.remove('open'); // Close the cart panel
    });

    // Add item to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h4').textContent;
            const productPriceText = productCard.querySelector('.discount').textContent;
            const productPrice = parseInt(productPriceText.replace(/[^0-9]/g, ''));

            // Add the item to the cart
            cartItems.push({ name: productName, price: productPrice });
            updateCartDisplay();
            saveCartToLocalStorage(); // Save the updated cart to localStorage
        });
    });

    // Clear the cart functionality
    clearCartButton.addEventListener('click', () => {
        cartItems = [];
        updateCartDisplay();
        saveCartToLocalStorage(); // Save the cleared cart to localStorage
    });

    // Load the cart from localStorage when the page loads
    loadCartFromLocalStorage();

    // Search functionality
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase(); // Get the search query and make it lowercase
        const productCards = document.querySelectorAll('.product-card'); // Get all product cards

        productCards.forEach(card => {
            const productName = card.querySelector('h4').textContent.toLowerCase(); // Get product name and make it lowercase
            
            // Toggle visibility based on search query match
            if (productName.includes(query)) {
                card.style.display = ''; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    });

    // Scroll progress functionality
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight; // Total height of the document
        const scrollPosition = window.scrollY; // Current scroll position
        const progress = (scrollPosition / docHeight) * 100; // Calculate the progress as a percentage
        
        progressBar.style.width = progress + '%'; // Set the progress bar width
    });
});
