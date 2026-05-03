import express, { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { listaCidades, listaUsuarios } from "../../consts";
import { BaseError } from '../../execeptions';
import UsuarioService from './usuario.service';

const router = express.Router();

const usuarioService = UsuarioService();

const criarUsuario = (req: Request, res: Response) => {
	// Lógica para CRIAR um usuário
	const { nome_completo, doc, end } = req.body;	

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
		const indice = usuarioService.buscarIndiceUsuarioLista(req.params.id);

		return res.json(listaUsuarios[indice]);
	} catch (error) {
		usuarioService.tratarExcecao(error, res);
	}
};

const atualizarUsuario = (req: Request, res: Response) => {
	try {
		const indice = usuarioService.buscarIndiceUsuarioLista(req.params.id);
		// Atualizar o usuário
		const { nome_completo, end } = req.body;
		// Não permitimos mudar o documento (regra de negócio escondida aqui)
		listaUsuarios[indice].nome_completo = nome_completo;
		listaUsuarios[indice].end = end;

		return res.json(listaUsuarios[indice]);
	} catch (error) {
		usuarioService.tratarExcecao(error, res);
	}
};

const excluirUsuario = (req: Request, res: Response) => {
	try {
		const indice = usuarioService.buscarIndiceUsuarioLista(req.params.id);
		
		// Deletar o usuário
		listaUsuarios.splice(indice, 1);

		return res.status(204).send(); // Sem conteúdo
	} catch (error) {
		usuarioService.tratarExcecao(error, res);
	}
};

// Agrupando as rotas de usuário em um único handler.
// O método .route do Express é usado aqui.
router.route('/')
	.post(
		usuarioService.validarCamposObrigatoriosRequisicaoCriarUsuario, 
		usuarioService.validarDocExistenteRequisicaoCriarUsuario,
		usuarioService.validarCidadeRequisicaoCriarUsuario,
		criarUsuario
	)
	.get(buscarUsuarios);

// Rotas para manipular um usuário específico por ID.
router.route('/:id')
	.get(buscarUsuario)
	.put(usuarioService.validarCamposObrigatoriosRequisicaoAtualizarUsuario, atualizarUsuario)
	.delete(excluirUsuario);

export default router;