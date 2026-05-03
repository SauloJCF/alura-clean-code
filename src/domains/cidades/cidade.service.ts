import { NextFunction, Request, Response } from "express";
import { listaCidades } from "../../consts";

function validarCamposObrigatoriosCadastrarCidade(req: Request, res: Response, next: NextFunction) {
    const dados = req.body;

    // Validação básica e confusa diretamente na função da rota.
    if (!dados.nome_cidade || !dados.uf) {
        return res.status(400).send({ erro: 'Dados incompletos: nome_cidade e uf são obrigatórios.' });
    }

    next();
}

function validarCidadeJaCadastrada(req: Request, res: Response, next: NextFunction) {
    const dados = req.body;

    // Verifica se a cidade já existe para não duplicar (loop ineficiente).
    for (let i = 0; i < listaCidades.length; i++) {
        if (listaCidades[i].nome_cidade.toLowerCase() === dados.nome_cidade.toLowerCase() && listaCidades[i].uf.toLowerCase() === dados.uf.toLowerCase()) {
            return res.status(409).send({ erro: 'Esta cidade já está cadastrada.' });
        }
    }

    next();
}

function CidadeService() {
    return {
        validarCamposObrigatoriosCadastrarCidade,
        validarCidadeJaCadastrada
    };
}

export default CidadeService;