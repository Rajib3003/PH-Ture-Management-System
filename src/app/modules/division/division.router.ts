import { Router } from "express";
import { divisionController } from "./division.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDivisionZodSchema } from "./division.validation";


const router = Router();

// router.post("/register", validateRequest(createUserZodSchema), userController.createUser);

// router.get("/", divisionController.getAllDivision);
router.post("/create",validateRequest(createDivisionZodSchema) ,divisionController.createDivision);

export const divisionRoutes = router