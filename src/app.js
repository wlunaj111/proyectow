import express from "express";
import morgan from "morgan";
import cors from "cors";
import searchRoutes from './routes/search.routes.js';

//inicialization
const app = express();

//settings
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(searchRoutes);


//routes
app.get("/", (req, res) => {
  res.send(`The api is at http:localhost: ${app.get("port")}`);
});

export default app;
