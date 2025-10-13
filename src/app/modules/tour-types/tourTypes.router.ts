// import { Router } from "express";
// import { checkAuth } from "../../middleware/checkAuth";
// import { Role } from "../user/user.interface";
// import { validateRequest } from "../../middleware/validateRequest";
// import { createTourTypesZodSchema, updateTourTypesZodSchema } from "./tourTypes.validation";
// import { tourTypesController } from "./tourTypes.controller";


// const router = Router();


// router.post("/create-tour-type", checkAuth(...Object.values(Role)), validateRequest(createTourTypesZodSchema) ,tourTypesController.createTourTypes);
// router.get("/tour-types", checkAuth(...Object.values(Role)), tourTypesController.getAllTourTypes);
// router.patch("/tour-types/:id",checkAuth(Role.USER), validateRequest(updateTourTypesZodSchema) , tourTypesController.updateTourTypes);
// router.delete("/tour-types/:id",checkAuth(...Object.values(Role)), tourTypesController.deleteTourTypes);

// export const tourTypesRoutes = router