import express, {Request, Response} from "express";
import {ParsedQs} from "qs";
import {lista1, lista2} from "../../constants";


const router = express.Router();
let contador_usuario = lista2.length;

// ===================================================================================
// ROTAS E LÓGICA DE NEGÓCIO (TUDO MISTURADO)
// ===================================================================================


const buscarUsuarios = (req: Request, res: Response) => {
// Lógica para LER todos os usuários ou buscar por documento
	const query: ParsedQs = req.query;

	if (query && query.doc) {
		// Procurar um usuário por documento
		let encontrado = null;
		for (const u of lista2) { // 'u' é um nome de variável ruim e curto
			if (u.doc === query.doc) {
				encontrado = u;
				break;
			}
		}
		if (encontrado) {
			res.status(200).json(encontrado);
		} else {
			res.status(404).send({erro: 'Usuário não encontrado com o documento informado.'});
		}
	} else {
		// Retornar todos os usuários
		res.status(200).json(lista2);
	}
}

const criarUsuario = (req: Request, res: Response) => {
// Lógica para CRIAR um usuário
	const {nome_completo, doc, end} = req.body;

	// Validação de campos obrigatórios
	if (!nome_completo || !doc || !end || !end.rua || !end.num || !end.cidade_id) {
		return res.status(400).send({erro: 'Dados incompletos para o usuário.'});
	}

	// Validação de documento - verifica se já existe
	let docExiste = false;
	for (let i = 0; i < lista2.length; i++) {
		if (lista2[i].doc === doc) {
			docExiste = true;
			break;
		}
	}
	if (docExiste) {
		return res.status(409).send({erro: 'Documento já cadastrado.'});
	}

	// Verifica se a cidade informada existe na nossa lista de cidades
	let cidadeValida = false;
	for (let i = 0; i < lista1.length; i++) {
		if (lista1[i].id === end.cidade_id) {
			cidadeValida = true;
			break;
		}
	}
	if (!cidadeValida) {
		return res.status(400).send({erro: 'A cidade informada não existe.'});
	}

	contador_usuario += 1; // Incrementa o contador global
	const novoUsuario = {
		id: contador_usuario, nome_completo, doc, end,
	};
	lista2.push(novoUsuario);
	res.status(201).json(novoUsuario);

}


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

const buscarUsuario = (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);

	const indice = buscarIndiceUsuario(id);

	if (indice === -1) {
		return res.status(404).send({erro: 'Usuário não encontrado.'});
	}

	return res.json(lista2[indice]);
};

const editarUsuario = (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);

	const indice = buscarIndiceUsuario(id);

	if (indice === -1) {
		return res.status(404).send({erro: 'Usuário não encontrado.'});
	}

	// Atualizar o usuário
	const {nome_completo, end} = req.body;
	if (!nome_completo || !end) {
		return res.status(400).send({erro: 'Dados incompletos para atualização.'});
	}
	// Não permitimos mudar o documento (regra de negócio escondida aqui)
	lista2[indice].nome_completo = nome_completo;
	lista2[indice].end = end;
	return res.json(lista2[indice]);
}

/**
 * Função para lidar com um item específico (usuário).
 * Outra função com múltiplas responsabilidades: GET, PUT e DELETE.
 */
const deletarUsuario = (req: Request, res: Response) => {

	const id = parseInt(req.params.id, 10);

	const indice = buscarIndiceUsuario(id);

	if (indice === -1) {
		return res.status(404).send({erro: 'Usuário não encontrado.'});
	}

	lista2.splice(indice, 1);
	return res.status(204).send(); // Sem conteúdo

};


// Agrupando as rotas de usuário em um único handler.
// O método .route do Express é usado aqui.
router.route('/')
	.post(criarUsuario)
	.get(buscarUsuarios);

// Rotas para manipular um usuário específico por ID.
router.route('/:id')
	.get(buscarUsuario)
	.put(editarUsuario)
	.delete(deletarUsuario);

export default router;
