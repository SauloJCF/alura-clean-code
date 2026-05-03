import express, { Request, Response } from 'express';
import { listaCidades } from '../../consts';
import CidadeService from './cidade.service';

const router = express.Router();

const cidadeService = CidadeService();

/**
 * Rota para criar uma nova cidade.
 * Valida, verifica duplicidade e insere. Tudo na mesma função.
 */

const cadastrarCidade = (req: Request, res: Response) => {
    // Pega os dados do corpo da requisição. Nome genérico "dados".Ï
    const dados = req.body;

    const novaCidade = cidadeService.adicionarCidadeNaBase(dados);

    res.status(201).json(novaCidade);
};

const buscarCidades = (req: Request, res: Response) => {
    // Retorna a lista completa de cidades.
    res.status(200).json(listaCidades);
}

router
    .post('/',
        cidadeService.validarCamposObrigatoriosCadastrarCidade,
        cidadeService.validarCidadeJaCadastrada,
        cadastrarCidade)
    .get('/', buscarCidades);

export default router;