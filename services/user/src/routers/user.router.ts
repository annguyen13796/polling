import express, { Router } from "express";
import {
	getUserByIdHandler,
	updateUserInformationHandler,
	getAddressesHandler,
	updateAddressHandler,
	addAddressHandler,
	deleteAddressHandler,
} from "../controllers";

import { protect } from "../middlewares";
const router: Router = express.Router();

router.get("/owner", protect, getUserByIdHandler);
router.patch("/owner", protect, updateUserInformationHandler);
router.post("/owner/addresses", protect, addAddressHandler);
router.delete("/owner/addresses/:id", protect, deleteAddressHandler);
router.put("/owner/addresses/:id", protect, updateAddressHandler);
router.get("/owner/addresses", protect, getAddressesHandler);

export const userRouter: Router = router;
