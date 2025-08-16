import express, {Request, Response} from 'express';
import {listaCidades} from '../../constants';
import CidadeService from "./cidade.service";

const router = express.Router();

const service = CidadeService()

const criarCidade = (req: Request, res: Response) => {
	const dados = req.body;

	const novaCidade = service.adicionarCidadeNaBase(dados);

	res.status(201).json(novaCidade);
};


const listarCidades = (_req: Request, res: Response) => {
	res.status(200).json(listaCidades);
};

/**
 * Rota para listar todas as cidades.
 */
router
	.post('/', service.validarDadosCadstroCidade, service.validarSeCidadeExiste, criarCidade)
	.get('/', listarCidades);


export default router;