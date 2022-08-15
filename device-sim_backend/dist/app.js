"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const statusController = require("./controllers/status");
const app = express();
app.set("port", process.env.PORT || 3000);
// app.get('/', statusController.hi);
app.post('/awesome', statusController.awesome);
app.get("/hello", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});
exports.default = app;
//# sourceMappingURL=app.js.map