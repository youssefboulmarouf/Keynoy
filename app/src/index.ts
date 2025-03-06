import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./resources";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app }; // Export for testing
