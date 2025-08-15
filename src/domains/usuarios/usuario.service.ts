import {NextFunction, Request, Response} from "express";
import {listaCidades, listaUsuario} from "../../constants";

function buscarIndiceUsuario(id: number) {

	// Encontrar o índice do usuário na lista para poder manipular (atualizar/deletar)
	let indice = -1;
	for (let i = 0; i < listaUsuario.length; i++) {
		if (listaUsuario[i].id === id) {
			indice = i;
			break;
		}
	}
	return indice;
}


function validarDadosDaRequisicaoDeCriarUsuario(req: Request, res: Response, next: NextFunction) {
	const {nome_completo, doc, end} = req.body;

	// Validação de campos obrigatórios
	if (!nome_completo || !doc || !end || !end.rua || !end.num || !end.cidade_id) {
		return res.status(400).send({erro: 'Dados incompletos para o usuário.'});
	}

	next()
}

function validarSeUsuarioExiste(req: Request, res: Response, next: NextFunction) {
	const id = parseInt(req.params.id, 10);

	const indice = buscarIndiceUsuario(id);

	if (indice === -1) {
		return res.status(404).send({erro: 'Usuário não encontrado.'});
	}

	next()
}

function validarSeUsuarioExisteComDocumento(req: Request, res: Response, next: NextFunction) {
	const {doc} = req.body;


	// Validação de documento - verifica se já existe
	let docExiste = false;
	for (let i = 0; i < listaUsuario.length; i++) {
		if (listaUsuario[i].doc === doc) {
			docExiste = true;
			break;
		}
	}
	if (docExiste) {
		return res.status(409).send({erro: 'Documento já cadastrado.'});
	}

	next()
}

function buscarUsuarioPorDocumento(doc: string) {
	let encontrado = null;
	for (const u of listaUsuario) { // 'u' é um nome de variável ruim e curto
		if (u.doc === doc) {
			encontrado = u;
			break;
		}
	}

	return encontrado
}

function validarDadosParaAtualizacao(req: Request, res: Response, next: NextFunction) {
	// Atualizar o usuário
	const {nome_completo, end} = req.body;
	if (!nome_completo || !end) {
		return res.status(400).send({erro: 'Dados incompletos para atualização.'});
	}

	next();
}

function verificarSeCidadeExiste(req: Request, res: Response, next: NextFunction) {
	const {end} = req.body;

	// Verifica se a cidade informada existe na nossa lista de cidades
	let cidadeValida = false;
	for (let i = 0; i < listaCidades.length; i++) {
		if (listaCidades[i].id === end.cidade_id) {
			cidadeValida = true;
			break;
		}
	}
	if (!cidadeValida) {
		return res.status(400).send({erro: 'A cidade informada não existe.'});
	}

	next();
}

function UsuarioService() {

	return {
		buscarIndiceUsuario,
		buscarUsuarioPorDocumento,
		validarDadosDaRequisicaoDeCriarUsuario,
		validarSeUsuarioExiste,
		validarSeUsuarioExisteComDocumento,
		validarDadosParaAtualizacao,
		verificarSeCidadeExiste
	}
}


export default UsuarioService;