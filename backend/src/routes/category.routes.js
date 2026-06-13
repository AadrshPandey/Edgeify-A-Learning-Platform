import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryDetails,
    updateCategoryThumbnail,
    deleteCategory
} from "../controllers/category.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const categoryRouter = Router();

categoryRouter.route("/")
.get(getAllCategories);

categoryRouter.route("/create")
.post(
    verifyJWT,
    upload.single("thumbnail"),
    createCategory
);

categoryRouter.route("/update-details/:category_id")
.patch(
    verifyJWT,
    updateCategoryDetails
);

categoryRouter.route("/update-thumbnail/:category_id")
.patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateCategoryThumbnail
);

categoryRouter.route("/delete/:category_id")
.delete(
    verifyJWT,
    deleteCategory
);

categoryRouter.route("/:category_id")
.get(getCategoryById);

export default categoryRouter;