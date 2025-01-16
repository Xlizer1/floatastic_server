import { createBanner } from "@skyra/start-banner";
import express, { type Request, type Response } from "express";
import gradient from "gradient-string";
import figlet from "figlet";
import { version } from "../../package.json";
import "./db";
import cors from 'cors';

const app = express();

interface SetupObject {
    APP_NAME: string;
    HOST: string;
    PORT: number;
}

export class Setup {
    private HOST!: string;
    private PORT!: number;
    private APP_NAME!: string;
    private app: express.Application;

    constructor(setupObject: SetupObject) {
        this.APP_NAME = setupObject.APP_NAME;
        this.HOST = setupObject.HOST;
        this.PORT = setupObject.PORT;
        this.app = express();
        
        // Initialize middleware
        this.setupMiddleware();
    }

    private setupMiddleware() {
        // Global middleware should be first
        this.app.use(express.json());
        this.app.use(cors({
            origin: 'http://localhost:4000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));

        // Logging middleware
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(`Request received: ${req.method} ${req.url}`);
            next();
        });
    }

    registerRoutes(routes: { path: string; router: express.Router }[]) {
        // Root route
        this.app.get("/", (req: Request, res: Response) => {
            res.json({
                message: "App version " + version,
            });
        });

        // API routes
        const apiRouter = express.Router();
        routes.forEach((route) => {
            apiRouter.use(route.path, route.router);
        });
        this.app.use("/api", apiRouter);

        // 404 handler (after all routes)
        this.app.use((req: express.Request, res: express.Response) => {
            res.status(404).send("API Endpoint not found");
        });

        // Error handler (must be last)
        this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
    }

    initiateHttpServer() {
        if (!this.HOST || !this.PORT) {
            throw new Error("Host and port must be set before starting the server.");
        }

        const server = this.app.listen(this.PORT, this.HOST, () => {
            console.log(
                createBanner({
                    name: [
                        gradient.retro.multiline(
                            figlet.textSync(this.APP_NAME)
                        ),
                    ],
                    extra: [
                        `${this.APP_NAME} is running at http://${this.HOST}:${this.PORT}`,
                    ],
                })
            );
        });

        process.on("SIGINT", () => {
            server.close(() => {
                console.log("Server shutting down gracefully...");
                process.exit(0);
            });
        });
    }
}