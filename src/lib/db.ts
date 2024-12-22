import mysql from "mysql2";

const host = process.env.HOST || "localhost";
const user = process.env.DB_USER || "root";
const password = process.env.PASSWORD || "";
const database = process.env.DATABASE || "floatastic";

let pool: mysql.Pool | undefined;

function connectPoolWithRetry() {
    console.log("Trying to connect to the DB (with pool)");

    pool = mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: "utf8",
        multipleStatements: true,
        connectTimeout: 60000,
    });

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error in DB connection:", err);
            console.log("Retrying DB pool connection in 5 seconds...");
            setTimeout(connectPoolWithRetry, 5000);
        } else {
            console.log("DB pool connected to:", database);
            connection.release();
        }
    });

    pool.on("error", (err) => {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Database connection lost");
            console.log("Retrying DB pool connection in 5 seconds...");
            setTimeout(connectPoolWithRetry, 5000);
        } else {
            if (pool) {
                console.error("Fatal error encountered, recreating DB pool");
                pool.end();
                connectPoolWithRetry();
            }
        }
    });
}

connectPoolWithRetry();

// Use ES Module export syntax
export { pool };

// Optionally, you can export the query method directly
export function query(query: string, values?: any[]) {
    if (pool) {
        pool.query(query, values, (err: any, results: any) => {
            if (err) {
                console.error("Error executing query:", err);
            } else {
                console.log("Query executed successfully:", results);
            }
        });
    } else {
        console.error("MySQL pool is not initialized.");
    }
}
