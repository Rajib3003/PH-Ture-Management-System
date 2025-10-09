import { Router } from "express";
import { divisionController } from "./division.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();




router.post("/create",checkAuth(Role.USER),validateRequest(createDivisionZodSchema) ,divisionController.createDivision);
router.get("/", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), divisionController.getAllDivision);
router.patch("/:id", validateRequest(updateDivisionZodSchema) ,checkAuth(Role.USER), divisionController.updateDivision);
router.delete("/:id",checkAuth(Role.ADMIN), divisionController.deleteDivision);

export const divisionRoutes = router