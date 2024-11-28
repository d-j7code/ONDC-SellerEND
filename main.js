// script.js
class SellerDashboard {
    constructor() {
        this.products = [];
        this.notifications = [];
        this.orders = [];
        this.initializeEventListeners();
        this.setupWebSocket();
        this.loadInitialData();
    }

    initializeEventListeners() {
        // Tab navigation
        document.getElementById('products-tab').addEventListener('click', () => this.showSection('products'));
        document.getElementById('notifications-tab').addEventListener('click', () => this.showSection('notifications'));
        document.getElementById('orders-tab').addEventListener('click', () => this.showSection('orders'));

        // Add product form
        document.getElementById('saveProduct').addEventListener('click', () => this.handleAddProduct());
    }

    setupWebSocket() {
        // Initialize WebSocket connection for real-time notifications
        this.ws = new WebSocket('wss://your-websocket-server-url');
        
        this.ws.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            this.handleNewNotification(notification);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    async loadInitialData() {
        // For demonstration, we'll use some sample data
        this.products = [
            {
                id: 1,
                name: "Sample Product 1",
                description: "This is a sample product description",
                price: 99.99,
                stock: 50,
                image: "https://via.placeholder.com/300"
            }
        ];
        this.renderProducts();
    }

    showSection(section) {
        // Hide all sections
        document.getElementById('products-section').style.display = 'none';
        document.getElementById('notifications-section').style.display = 'none';
        document.getElementById('orders-section').style.display = 'none';

        // Show selected section
        document.getElementById(`${section}-section`).style.display = 'block';

        // Update active tab
        document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('active'));
        document.getElementById(`${section}-tab`).classList.add('active');
    }

    async handleAddProduct() {
        const productData = {
            id: this.products.length + 1, // Simple ID generation
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            image: document.getElementById('productImage').value
        };

        // Basic validation
        if (!productData.name || !productData.description || !productData.price || !productData.stock || !productData.image) {
            this.showAlert('Please fill in all fields', 'danger');
            return;
        }

        // In a real application, you would make an API call here
        this.products.push(productData);
        this.renderProducts();
        document.getElementById('addProductForm').reset();
        this.showAlert('Product added successfully!', 'success');
    }

    renderProducts() {
        const container = document.getElementById('products-container');
        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        No products added yet. Use the form on the right to add your first product.
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.products.map(product => `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-primary fw-bold">$${product.price.toFixed(2)}
                            <span class="badge bg-${product.stock > 0 ? 'success' : 'danger'}">
                                ${product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            
                        </div>
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary" onclick="dashboard.editProduct(${product.id})">
                                Edit
                            </button>
                            <button class="btn btn-outline-danger" onclick="dashboard.deleteProduct(${product.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    async editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // For demonstration, we'll just log the product
            console.log('Editing product:', product);
            this.showAlert('Edit functionality coming soon!', 'info');
        }
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.renderProducts();
            this.showAlert('Product deleted successfully!', 'success');
        }
    }

    handleNewNotification(notification) {
        this.notifications.unshift(notification);
        this.renderNotifications();
    }

    renderNotifications() {
        const container = document.getElementById('notifications-container');
        container.innerHTML = this.notifications.length === 0 
            ? '<div class="alert alert-info">No notifications yet</div>'
            : this.notifications.map(notification => `
                <div class="notification">
                    <strong>${notification.type}</strong>
                    <p>${notification.message}</p>
                    <small>${new Date(notification.timestamp).toLocaleString()}</small>
                </div>
            `).join('');
    }
}

// Initialize dashboard
const dashboard = new SellerDashboard();
