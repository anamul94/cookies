const cron = require("node-cron");
const { Op } = require("sequelize");
const Order = require("../models/Order"); // Import your Order model
const OrderStatus = require("../enums/OrderStatus");

// Schedule a job to run every day at midnight
cron.schedule("0 */12 * * *", async () => {
    console.log("Running scheduled job to update expired orders...");

    try {
        const result = await Order.update(
            { status: OrderStatus.EXPIRED },
            {
                where: {
                    endDate: {
                        [Op.lt]: new Date(), // Check if endDate is in the past
                    },
                    status: {
                        [Op.ne]: OrderStatus.EXPIRED, // Only update orders not already expired
                    },
                },
            }
        );
        console.log(`Updated ${result[0]} orders to expired.`);
    } catch (error) {
        console.error("Error updating expired orders:", error);
    }
});
