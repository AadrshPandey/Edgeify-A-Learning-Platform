import { Router } from "express";
import {
    addToHistory,
    getMyHistory,
    removeFromHistory,
    clearHistory
} from "../controllers/history.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const historyRouter = Router();

historyRouter.route("/create/:video_id").post(
    verifyJWT,
    addToHistory
);

historyRouter.route("/myHistory").get(
    verifyJWT,
    getMyHistory
);

historyRouter.route("/removeVideo/:video_id").delete(
    verifyJWT,
    removeFromHistory
);

historyRouter.route("/clearHistory").delete(
    verifyJWT,
    clearHistory
);

export default historyRouter;