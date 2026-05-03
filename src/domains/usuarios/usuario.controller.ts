import express, { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { listaCidades, listaUsuarios } from "../../consts";
import { BaseError, UsuarioNaoEncontradoError } from '../../execeptions';

const router = express.Router();

const criarUsuario = (req: Request, res: Response) => {
	// Lógica para CRIAR um usuário
	const { nome_completo, doc, end } = req.body;

	// Validação de campos obrigatórios
	if (!nome_completo || !doc || !end || !end.rua || !end.num || !end.cidade_id) {
		return res.status(400).send({ erro: 'Dados incompletos para o usuário.' });
	}

	// Validação de documento - verifica se já existe
	let docExiste = false;
	for (let i = 0; i < listaUsuarios.length; i++) {
		if (listaUsuarios[i].doc === doc) {
			docExiste = true;
			break;
		}
	}
	if (docExiste) {
		return res.status(409).send({ erro: 'Documento já cadastrado.' });
	}

	// Verifica se a cidade informada existe na nossa lista de cidades
	let cidadeValida = false;
	for (let i = 0; i < listaCidades.length; i++) {
		if (listaCidades[i].id === end.cidade_id) {
			cidadeValida = true;
			break;
		}
	}
	if (!cidadeValida) {
		return res.status(400).send({ erro: 'A cidade informada não existe.' });
	}

	let contador_usuario = listaUsuarios.length;

	contador_usuario += 1; // Incrementa o contador global
	const novoUsuario = {
		id: contador_usuario,
		nome_completo,
		doc,
		end,
	};
	listaUsuarios.push(novoUsuario);
	res.status(201).json(novoUsuario);
};

const buscarUsuarios = (req: Request, res: Response) => {
	// Lógica para LER todos os usuários ou buscar por documento
	const query: ParsedQs = req.query;

	if (query && query.doc) {
		// Procurar um usuário por documento
		let encontrado = null;
		for (const u of listaUsuarios) { // 'u' é um nome de variável ruim e curto
			if (u.doc === query.doc) {
				encontrado = u;
				break;
			}
		}
		if (encontrado) {
			res.status(200).json(encontrado);
		} else {
			res.status(404).send({ erro: 'Usuário não encontrado com o documento informado.' });
		}
	} else {
		// Retornar todos os usuários
		res.status(200).json(listaUsuarios);
	}
};

const buscarUsuario = (req: Request, res: Response) => {
	try {
		const indice = buscarIndiceUsuarioLista(req.params.id);

		return res.json(listaUsuarios[indice]);
	} catch (error) {
		tratarExcecao(error, res);
	}
};

const atualizarUsuario = (req: Request, res: Response) => {
	try {
		const indice = buscarIndiceUsuarioLista(req.params.id);
		// Atualizar o usuário
		const { nome_completo, end } = req.body;
		if (!nome_completo || !end) {
			return res.status(400).send({ erro: 'Dados incompletos para atualização.' });
		}
		// Não permitimos mudar o documento (regra de negócio escondida aqui)
		listaUsuarios[indice].nome_completo = nome_completo;
		listaUsuarios[indice].end = end;

		return res.json(listaUsuarios[indice]);
	} catch (error) {
		tratarExcecao(error, res);
	}
};

const excluirUsuario = (req: Request, res: Response) => {
	try {
		const indice = buscarIndiceUsuarioLista(req.params.id);
		
		// Deletar o usuário
		listaUsuarios.splice(indice, 1);

		return res.status(204).send(); // Sem conteúdo
	} catch (error) {
		tratarExcecao(error, res);
	}
};


const buscarIndiceUsuarioLista = (idParam: any): number => {
	const id = parseInt(idParam, 10);

	for (let i = 0; i < listaUsuarios.length; i++) {
		if (listaUsuarios[i].id === id) {
			return i;
		}
	}

	throw new UsuarioNaoEncontradoError();
};

const tratarExcecao = (error: any, res: Response) => {
	if (error instanceof BaseError) {
		return res.status(error.statusCode).send({ code: error.code, message: error.message });
	} else {
		return res.status(500).send({ error })
	}
}


// Agrupando as rotas de usuário em um único handler.
// O método .route do Express é usado aqui.
router.route('/')
	.post(criarUsuario)
	.get(buscarUsuarios);

// Rotas para manipular um usuário específico por ID.
router.route('/:id')
	.get(buscarUsuario)
	.put(atualizarUsuario)
	.delete(excluirUsuario);

export default router;