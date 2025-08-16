import {NextFunction, Request, Response} from "express";
import {listaCidades} from "../../constants";
import {ModeloCidade} from "../../models/models";

function validarDadosCadstroCidade(req: Request, res: Response, next: NextFunction) {
	const dados = req.body;

	if (!dados.nome_cidade || !dados.uf) {
		return res.status(400).send({erro: 'Dados incompletos: nome_cidade e uf são obrigatórios.'});
	}

	next()
}

function adicionarCidadeNaBase(dados: Omit<ModeloCidade, 'id'>) {
	let contadorCidade = listaCidades.length;

	// Incrementa o contador e cria o novo objeto.
	contadorCidade = contadorCidade + 1;
	const novaCidade = {
		id: contadorCidade,
		nome_cidade: dados.nome_cidade,
		uf: dados.uf,
	};

	listaCidades.push(novaCidade); // Adiciona na lista.
	return novaCidade;
}

function validarSeCidadeExiste(req: Request, res: Response, next: NextFunction) {
	const dados = req.body;

	for (let i = 0; i < listaCidades.length; i++) {
		if (listaCidades[i].nome_cidade.toLowerCase() === dados.nome_cidade.toLowerCase() && listaCidades[i].uf.toLowerCase() === dados.uf.toLowerCase()) {
			return res.status(409).send({erro: 'Esta cidade já está cadastrada.'});
		}
	}

	next()
}

function CidadeService() {
	return {validarDadosCadstroCidade, validarSeCidadeExiste, adicionarCidadeNaBase}
}

export default CidadeService;