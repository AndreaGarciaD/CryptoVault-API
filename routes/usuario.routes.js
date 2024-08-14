module.exports = app => {
    const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
    const controller = require("../controllers/usuario.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listUsuarios);
    router.post("/", checkUserMiddleware, controller.createUsuario);
    router.get("/:id", checkUserMiddleware, controller.getUsuarioById);
    router.put("/:id", checkUserMiddleware, controller.updateUsuario);
    router.patch("/:id", checkUserMiddleware, controller.updateUsuario);
    router.delete("/:id", checkUserMiddleware, controller.deleteUsuario);

    app.use('/api/usuarios', router);
}