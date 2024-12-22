const loggingMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const { method, originalUrl } = req;

    console.log('=== Request Log ===');
    console.log(`Time: ${timestamp}`);
    console.log(`Method: ${method}`);
    console.log(`URL: ${originalUrl}`);
    
    // Safely check and log body
    // if (req.body && Object.keys(req.body).length > 0) {
    //     console.log('Body:', JSON.stringify(req.body, null, 2));
    // }
    
    // Safely check and log query
    if (req.query && Object.keys(req.query).length > 0) {
        console.log('Query:', JSON.stringify(req.query, null, 2));
    }
    
    // Safely check and log params
    if (req.params && Object.keys(req.params).length > 0) {
        console.log('Params:', JSON.stringify(req.params, null, 2));
    }
    
    console.log('================');

    // Capture the original send function
    const originalSend = res.send;
    
    // Override the send function to log the response
    res.send = function(body) {
        console.log('=== Response Log ===');
        console.log(`Status: ${res.statusCode}`);
        // if (body) {
        //     console.log('Body:', typeof body === 'string' ? body : JSON.stringify(body, null, 2));
        // }
        console.log('=================');
        
        // Call the original send function
        originalSend.apply(res, arguments);
    };

    next();
};

module.exports = loggingMiddleware;
