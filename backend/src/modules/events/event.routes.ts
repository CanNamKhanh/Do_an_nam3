import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import * as eventController from "./event.controller";

export const eventRouter = Router();

eventRouter.get("/public", eventController.listPublic);

eventRouter.use(authenticate);

eventRouter.get("/", eventController.list);
eventRouter.post("/", eventController.create);
eventRouter.get("/:id", eventController.getOne);
eventRouter.patch("/:id", eventController.update);
eventRouter.delete("/:id", eventController.remove);
