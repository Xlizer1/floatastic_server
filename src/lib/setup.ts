import { createBanner } from "@skyra/start-banner";
import express, { type Request, type Response } from "express";
import gradient from "gradient-string";
import figlet from "figlet";
import { version } from "../../package.json";

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

    constructor(setupObject: SetupObject) {
        this.APP_NAME = setupObject.APP_NAME;
        this.HOST = setupObject.HOST;
        this.PORT = setupObject.PORT;
    }

    initiateHttpServer() {
        if (!this.HOST || !this.PORT) {
            throw new Error(
                "Host and port must be set before starting the server."
            );
        }

        app.use(express.json());

        app.get("/", (req: Request, res: Response) => {
            res.json({
                message: "App version " + version,
            });
        });

        app.use((req: Request, res: Response) => {
            res.status(404).send("Endpoint not found");
        });

        app.use((err: Error, req: Request, res: Response, next: Function) => {
            console.error(err);
            res.status(500).send("An unexpected error occurred");
        });

        const server = app.listen(this.PORT, this.HOST, () => {
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
    registerRoutes(routes: { path: string; router: express.Router }[]) {
        const apiRouter = express.Router();

        routes.forEach((route) => {
            apiRouter.use(route.path, route.router);
        });

        app.use("/api", apiRouter);

        app.use((req: express.Request, res: express.Response) => {
            res.status(404).send("API Endpoint not found");
        });

        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });

        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(`Request received: ${req.method} ${req.url}`);
            next();
        });
        
    }
}
