const mysql = require("mysql2/promise");

// Database configuration
const host = process.env.DB_HOST || "lizer.tech";  // Remove https://
const port = parseInt(process.env.DB_PORT || '3306', 10);
const user = process.env.DB_USER || "root";
const password = process.env.PASSWORD || "Mustag252@";
const database = process.env.DATABASE || "floatastic";

// Database configuration
const dbConfig = {
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8",
    multipleStatements: true,
    connectTimeout: 60000,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

async function batchInsertItems(items: any[]) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertQuery = `
            INSERT INTO skinport_items 
            (market_hash_name, currency, suggested_price, min_price, max_price, 
             mean_price, median_price, quantity, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))
            ON DUPLICATE KEY UPDATE
            currency = VALUES(currency),
            suggested_price = VALUES(suggested_price),
            min_price = VALUES(min_price),
            max_price = VALUES(max_price),
            mean_price = VALUES(mean_price),
            median_price = VALUES(median_price),
            quantity = VALUES(quantity),
            updated_at = VALUES(updated_at)
        `;

        // Process items in batches
        const BATCH_SIZE = 1000;
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const batch = items.slice(i, i + BATCH_SIZE);
            const values = batch.map(
                (item: {
                    market_hash_name: any;
                    currency: any;
                    suggested_price: any;
                    min_price: any;
                    max_price: any;
                    mean_price: any;
                    median_price: any;
                    quantity: any;
                    created_at: any;
                    updated_at: any;
                }) => [
                    item.market_hash_name,
                    item.currency,
                    item.suggested_price,
                    item.min_price,
                    item.max_price,
                    item.mean_price,
                    item.median_price,
                    item.quantity,
                    item.created_at,
                    item.updated_at,
                ]
            );

            for (const value of values) {
                await connection.execute(insertQuery, value);
            }

            console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
        }

        await connection.commit();
        console.log("All items processed successfully");
    } catch (error) {
        await connection.rollback();
        console.error("Error inserting items:", error);
        throw error;
    } finally {
        connection.release();
    }
}

// Example usage:
async function main() {
    try {
        // Your Skinport items array
        const skinportItems = [
            {
                market_hash_name: "Item Name",
                currency: "EUR",
                suggested_price: 0.9,
                min_price: 0.9,
                max_price: 4.05,
                mean_price: 1.49,
                median_price: 1.1,
                quantity: 225,
                created_at: 1661324437,
                updated_at: 1736148838,
            },
            // ... more items
        ];

        await batchInsertItems(skinportItems);
    } catch (error) {
        console.error("Main error:", error);
    } finally {
        await pool.end();
    }
}

// Export for use in other files
module.exports = {
    batchInsertItems,
    pool,
};
