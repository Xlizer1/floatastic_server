import { pool } from "../lib/db";

export function formatCurrency(num: number): string {
    const formatted = (num / 100).toFixed(2);
    return `$${formatted}`;
}

export async function executeQuery(
    sql: string,
    logName: string,
    callback: any
) {
    try {
        if (pool)
            await pool.query(
                {
                    sql: sql,
                    timeout: 40000,
                },
                (error: any, result: any) => {
                    if (!error) {
                        callback(result);
                    } else {
                        console.error(`${logName}sql: ${sql}`);
                        console.error(logName + ": " + error);
                        callback([false, error?.message]);
                    }
                }
            );
    } catch (e) {
        console.log("Error in common.js -> executeQuery: " + e);
    }
}
