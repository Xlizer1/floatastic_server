import { Setup } from "./lib/setup";
import fs from "fs";
import path from "path";

const server = new Setup({
    APP_NAME: process.env.APP_NAME || "Floatastic",
    HOST: process.env.HOST || "localhost",
    PORT: parseInt(process.env.PORT || "8080", 10),
});

const apisPath = path.resolve(__dirname, "./apis");

const routes = fs
    .readdirSync(apisPath)
    .map((dir) => {
        const routerPath = path.join(apisPath, dir, "router.ts");
        if (fs.existsSync(routerPath)) {
            const router = require(routerPath).default;
            return { path: `/${dir}`, router };
        }
        return null;
    })
    .filter((route) => route !== null);

server.registerRoutes(routes as { path: string; router: any }[]);

server.initiateHttpServer();
