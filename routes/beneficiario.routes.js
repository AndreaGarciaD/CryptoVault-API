module.exports = app => {
    const controller = require("../controllers/beneficiario.controller.js");
    let router = require("express").Router();

    router.post("/:id", controller.createBeneficiarioParaUsuario);
    router.put("/:id", controller.updateBeneficiario);
    router.delete("/:id", controller.deleteBeneficiario);
    router.get("/:id", controller.getBeneficiarioById);
    router.get("/usuario/:id", controller.getBeneficiariosPorUsuario);

    app.use('/api/beneficiario', router);
}