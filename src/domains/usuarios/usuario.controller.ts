import express, {Request, Response} from "express";
import {ParsedQs} from "qs";
import {listaUsuario} from "../../constants";
import UsuarioService from "./usuario.service";

const router = express.Router();
let contador_usuario = listaUsuario.length;

const service = UsuarioService();

// ===================================================================================
// ROTAS E LÓGICA DE NEGÓCIO (TUDO MISTURADO)
// ===================================================================================


const buscarUsuarios = (req: Request, res: Response) => {
// Lógica para LER todos os usuários ou buscar por documento
	const query: ParsedQs = req.query;

	if (query && query.doc) {
		// Procurar um usuário por documento
		const encontrado = service.buscarUsuarioPorDocumento(query.doc as string);

		if (encontrado) {
			res.status(200).json(encontrado);
		} else {
			res.status(404).send({erro: 'Usuário não encontrado com o documento informado.'});
		}
	} else {
		// Retornar todos os usuários
		res.status(200).json(listaUsuario);
	}
}

const criarUsuario = (req: Request, res: Response) => {
	// Lógica para CRIAR um usuário
	const {nome_completo, doc, end} = req.body;

	contador_usuario += 1; // Incrementa o contador global
	const novoUsuario = {
		id: contador_usuario, nome_completo, doc, end,
	};
	listaUsuario.push(novoUsuario);
	res.status(201).json(novoUsuario);

}

const buscarUsuario = (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);

	const indice = service.buscarIndiceUsuario(id);

	return res.json(listaUsuario[indice]);
};

const editarUsuario = (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);

	const indice = service.buscarIndiceUsuario(id);
	// Atualizar o usuário
	const {nome_completo, end} = req.body;

	// Não permitimos mudar o documento (regra de negócio escondida aqui)
	listaUsuario[indice].nome_completo = nome_completo;
	listaUsuario[indice].end = end;
	return res.json(listaUsuario[indice]);
}

/**
 * Função para lidar com um item específico (usuário).
 * Outra função com múltiplas responsabilidades: GET, PUT e DELETE.
 */
const deletarUsuario = (req: Request, res: Response) => {

	const id = parseInt(req.params.id, 10);

	const indice = service.buscarIndiceUsuario(id);

	listaUsuario.splice(indice, 1);
	return res.status(204).send(); // Sem conteúdo
};


// Agrupando as rotas de usuário em um único handler.
// O método .route do Express é usado aqui.
router.route('/')
	.post(service.validarDadosDaRequisicaoDeCriarUsuario, service.validarSeUsuarioExisteComDocumento, service.verificarSeCidadeExiste, criarUsuario)
	.get(buscarUsuarios);

// Rotas para manipular um usuário específico por ID.
router.route('/:id')
	.get(service.validarSeUsuarioExiste, buscarUsuario)
	.put(service.validarSeUsuarioExiste, service.validarDadosParaAtualizacao, editarUsuario)
	.delete(service.validarSeUsuarioExiste, deletarUsuario);

export default router;
