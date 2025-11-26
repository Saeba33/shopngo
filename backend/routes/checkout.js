import { Router } from "express";

const router = Router();

router.get("/checkout", async (req, res) => {
	res.get("Checkout route is working");
});

export default router;
