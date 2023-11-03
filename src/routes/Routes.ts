import { Router } from "express";
import { balanceController } from "../controllers/balanceController";
import { eventController } from "../controllers/eventController";
import { resetController } from "../controllers/resetController";

const apiV1Router = Router();

apiV1Router.post("/reset", resetController.reset);
apiV1Router.get("/balance", balanceController.getBalance);
apiV1Router.post("/event", eventController.createUpdate);

export default apiV1Router;
