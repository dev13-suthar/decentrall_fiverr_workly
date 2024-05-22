import express from "express";
const app = express();
import userRouter from "./routers/user"
import workerRouter from "./routers/worker"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/v1/user",userRouter)
app.use("/v1/worker",workerRouter)

app.listen(3000,()=>console.log(`Server Port 3000`));


