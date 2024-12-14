const { PROCESSING } = require("./OrderStatus");

const TrialOrderStatus = {
        PENDING: 'pending',
        APPROVED: 'approved',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        FAILED: 'failed'
    };
    
 module.exports = TrialOrderStatus;