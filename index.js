import express from "express";
import bootstrap from "./src/app.controller.js";
import {port} from "./config/config.service.js"
const app = express();
await bootstrap(app, express);
app.listen(port, ()=>{
    console.log(`servre is running http://127.0.0.1 ${port}`);
})