import express from "express";
import incidentRoutes from "./routes/incident.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger } from "./middlewares/logger.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { requestInfo } from "./middlewares/request-info.middleware";

const app = express();

// Orden de middlewares (importa): Logger -> RequestInfo -> body parser -> Router -> 404 -> Error
app.use(logger);
app.use(requestInfo);
app.use(express.json());

app.use("/api/incidents", incidentRoutes);

app.use(notFoundMiddleware); // después de todas las rutas
app.use(errorMiddleware); // siempre el último

export default app;
