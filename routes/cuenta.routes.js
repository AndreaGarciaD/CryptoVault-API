module.exports = app => {
    const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
    const controller = require("../controllers/cuentaBancaria.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listCuentas);
    router.post("/", checkUserMiddleware, controller.createCuenta);
    router.get("/:id", checkUserMiddleware, controller.getCuentaById);
    router.post("/retiro/:id", checkUserMiddleware, controller.retiroParaCuentaId);
    router.get("/usuario/:id", checkUserMiddleware, controller.getCuentasPorUsuario);
    router.put("/:id", checkUserMiddleware, controller.updateCuenta);
    router.delete("/:id", checkUserMiddleware, controller.deleteCuenta);

    app.use('/api/cuenta', router);
}