import {Request, Response, NextFunction} from "express";
import {lista2} from "../../constants";

function buscarIndiceUsuario(id: number) {

	// Encontrar o índice do usuário na lista para poder manipular (atualizar/deletar)
	let indice = -1;
	for (let i = 0; i < lista2.length; i++) {
		if (lista2[i].id === id) {
			indice = i;
			break;
		}
	}
	return indice;
}


function validarDadosDaRequisicaoDeCriarUsuario (req: Request, res: Response, next: NextFunction) {
	const {nome_completo, doc, end} = req.body;

	// Validação de campos obrigatórios
	if (!nome_completo || !doc || !end || !end.rua || !end.num || !end.cidade_id) {
		return res.status(400).send({erro: 'Dados incompletos para o usuário.'});
	}

	next()
}

function UsuarioService() {

	return {buscarIndiceUsuario, validarDadosDaRequisicaoDeCriarUsuario}
}


export default UsuarioService;