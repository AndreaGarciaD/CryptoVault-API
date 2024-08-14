module.exports = app => {
    const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
    const controller = require("../controllers/moneda.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listMonedas);
    router.post("/", checkUserMiddleware, controller.createMoneda);
    router.get("/:id", checkUserMiddleware, controller.getMonedaById);
    router.put("/:id", checkUserMiddleware, controller.updateMoneda);
    router.patch("/:id", checkUserMiddleware, controller.updateMoneda);
    router.delete("/:id", checkUserMiddleware, controller.deleteMoneda);

    app.use('/api/moneda', router);
}