const express = require('express');
const bodyParser = require('body-parser');
const { setupWebSocket, broadcastToClient } = require("./src/websocket/websocket");

const cors = require('cors');
const setupSwagger = require('./src/config/swagger');
const authRoutes = require('./src/routes/userRoute');
const productRoutes = require('./src/routes/productRoute');
const planRoutes = require('./src/routes/planRoutes'); // Import the routes
const orderRoutes = require("./src/routes/orderRoutes")


const app = express();

app.use(cors());
app.use(bodyParser.json());

setupSwagger(app);

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use(planRoutes); // Register the Plan routes
app.use('/order', orderRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

setupWebSocket(server);
