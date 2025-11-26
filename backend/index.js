import cors from "cors";
import "dotenv/config";
import express from "express";
import checkout from "./routes/checkout.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("yes we can");
});

app.use("/", checkout);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
