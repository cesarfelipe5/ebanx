import express from "express";
import "dotenv/config";
import apiV1Router from "./src/routes/Routes";

const app = express();
app.use(express.json());
// app.use('/api/v1', apiV1Router);
app.use(apiV1Router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log("Server runing on port ", PORT));
