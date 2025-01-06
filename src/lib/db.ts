import mysql from "mysql2";

// Database configuration
const host = process.env.DB_HOST || "lizer.tech";  // Remove https://
const port = parseInt(process.env.DB_PORT || '3306', 10);
const user = process.env.DB_USER || "root";
const password = process.env.PASSWORD || "Mustag252@";
const database = process.env.DATABASE || "floatastic";

let pool: mysql.Pool | undefined;

function connectPoolWithRetry() {
    console.log(`Attempting to connect to MySQL at ${host}:${port}`);

    pool = mysql.createPool({
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
    });

    // Test the connection
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database Connection Error:", {
                code: err.code,
                errno: err.errno
            });

            // Handle specific error cases
            switch (err.code) {
                case 'ECONNREFUSED':
                    console.error(`Connection refused. Please verify:
                        1. MySQL is running on ${host}:${port}
                        2. Firewall allows connections
                        3. MySQL user ${user} has remote access permissions`);
                    break;
                case 'ER_ACCESS_DENIED_ERROR':
                    console.error('Access denied. Please check username and password');
                    break;
                case 'ER_BAD_DB_ERROR':
                    console.error(`Database '${database}' does not exist`);
                    break;
                default:
                    console.error('Unknown database error:', err.message);
            }

            console.log("Retrying connection in 5 seconds...");
            setTimeout(connectPoolWithRetry, 5000);
        } else {
            console.log(`Successfully connected to MySQL database: ${database}`);
            console.log(`Connected as user: ${user}`);
            connection.release();
        }
    });

    pool.on("error", (err) => {
        console.error("Pool error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Database connection was lost");
            console.log("Attempting to reconnect...");
            setTimeout(connectPoolWithRetry, 5000);
        } else {
            if (pool) {
                console.error("Fatal error encountered, recreating pool");
                pool.end(() => {
                    connectPoolWithRetry();
                });
            }
        }
    });

    return pool;
}

// Promisified query function
export async function query(sql: string, values?: any[]): Promise<any> {
    if (!pool) {
        throw new Error("Database pool not initialized");
    }
    
    try {
        const [results] = await pool.promise().query(sql, values);
        return results;
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

// Initialize connection
const initialPool = connectPoolWithRetry();

export { initialPool as pool };