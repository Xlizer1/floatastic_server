import { Setup } from "./lib/setup";
import fs from "fs";
import path from "path";

const server = new Setup({
    APP_NAME: process.env.APP_NAME || "Floatastic",
    HOST: process.env.HOST || "localhost",
    PORT: parseInt(process.env.PORT || "8080", 10),
});

const apisPath = path.resolve(__dirname, "./apis");

(async () => {
    const routes = await Promise.all(
        fs.readdirSync(apisPath).map(async (dir) => {
            const routerPath = path.join(apisPath, dir, "router.ts");
            if (fs.existsSync(routerPath)) {
                const router = (await import(routerPath)).default; // Use await import()
                return { path: `/${dir}`, router };
            }
            return null;
        })
    );

    // Filter out null routes
    const validRoutes = routes.filter((route) => route !== null);

    // Register routes
    server.registerRoutes(validRoutes as { path: string; router: any }[]);

    // Start the server
    server.initiateHttpServer();
})();
