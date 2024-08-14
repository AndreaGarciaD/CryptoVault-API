const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");


exports.createBeneficiarioParaUsuario = async (req, res) => {
    const id = req.params.id;
    const requiredFields = ["nombre_referencia", "codigo_billetera"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { nombre_referencia, codigo_billetera } = req.body;

    try {
        const billetera = await db.billeteras.findOne({ where: { codigo: codigo_billetera } });

        if (!billetera) {
            res.status(400).send({ message: "El código de billetera no existe." });
            return;
        }

        const beneficiario = await db.beneficiarios.create({
            nombre_referencia: nombre_referencia,
            codigo_billetera: codigo_billetera,
            usuario_id: id
        });

        res.status(201).send(beneficiario);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


exports.updateBeneficiario = async (req, res) => {
    const id = req.params.id;
    const beneficiario = await db.beneficiarios.findByPk(id);

    if (!beneficiario){
        res.status(404).send({ message: `No se encontro al beneficiario` });
        return;
    }

    await beneficiario.update(req.body);
    res.send(beneficiario);
};

exports.deleteBeneficiario = async (req, res) => {
    const id = req.params.id;
    const beneficiario = await db.beneficiarios.findByPk(id);

    if (!beneficiario){
        res.status(404).send({ message: `No se encontro el beneficiario` });
        return;
    }

    await beneficiario.destroy();
    res.send({ message: `El beneficiario fue eliminado` });
};

exports.getBeneficiarioById = async (req, res) => {
    const id = req.params.id;
    const beneficiario = await db.beneficiarios.findByPk(id, {
        include: [
            "usuario"
        ]
    });

    if (!beneficiario){
        res.status(404).send({ message: `No se encontro al beneficiario` });
        return;
    }

    res.send(beneficiario);
}

exports.getBeneficiariosPorUsuario = async (req, res) => {
    const id = req.params.id;
    const beneficiarios = await db.beneficiarios.findAll({
        where: {
            usuario_id: id,
        },
        include: [
            "usuario"
        ]
    });

    res.send(beneficiarios);
}



