/**
 * Importações necessárias para o Express e para a tipagem do TypeScript.
 */
import express, { Request, Response } from 'express';
import { ParsedQs } from 'qs';

// ===================================================================================
// INÍCIO DA APLICAÇÃO - TUDO EM UM ARQUIVO SÓ
// ===================================================================================

/**
 * Inicialização do Express e configuração do middleware para aceitar JSON.
 */
const app = express();
app.use(express.json());

// ===================================================================================
// "BANCO DE DADOS" EM MEMÓRIA E TIPAGENS
// ===================================================================================

/**
 * Tipo para representar uma cidade.
 * Propriedades: id, nome da cidade e a unidade federativa (UF).
 */
type ModeloCidade = {
	id: number;
	nome_cidade: string;
	uf: string;
};

/**
 * Tipo para representar um usuário.
 * Propriedades: id, nome completo, documento (doc) e endereço (end).
 * O endereço é um objeto que contém a rua, número e o ID da cidade (relacionamento).
 */
type ModeloUsuario = {
	id: number;
	nome_completo: string;
	doc: string;
	end: {
		rua: string;
		num: number;
		cidade_id: number;
	};
};

// Vamos usar listas genéricas para armazenar os dados em memória.
// lista1 para cidades, lista2 para usuários. Nomes ruins propositalmente.
let lista1: ModeloCidade[] = [
	{ id: 1, nome_cidade: 'Propriá', uf: 'SE' },
	{ id: 2, nome_cidade: 'Aracaju', uf: 'SE' },
];

let lista2: ModeloUsuario[] = [
	{
		id: 1,
		nome_completo: 'Fulano de Tal',
		doc: '11122233344',
		end: { rua: 'Rua A', num: 10, cidade_id: 1 },
	},
];

// Contadores globais para gerar novos IDs.
let contador_cidade = lista1.length;
let contador_usuario = lista2.length;

// ===================================================================================
// ROTAS E LÓGICA DE NEGÓCIO (TUDO MISTURADO)
// ===================================================================================

/**
 * Rota para criar uma nova cidade.
 * Valida, verifica duplicidade e insere. Tudo na mesma função.
 */
app.post('/cidades', (req: Request, res: Response) => {
	// Pega os dados do corpo da requisição. Nome genérico "dados".Ï
	const dados = req.body;

	// Validação básica e confusa diretamente na função da rota.
	if (!dados.nome_cidade || !dados.uf) {
		return res.status(400).send({ erro: 'Dados incompletos: nome_cidade e uf são obrigatórios.' });
	}

	// Verifica se a cidade já existe para não duplicar (loop ineficiente).
	for (let i = 0; i < lista1.length; i++) {
		if (lista1[i].nome_cidade.toLowerCase() === dados.nome_cidade.toLowerCase() && lista1[i].uf.toLowerCase() === dados.uf.toLowerCase()) {
			return res.status(409).send({ erro: 'Esta cidade já está cadastrada.' });
		}
	}

	// Incrementa o contador e cria o novo objeto.
	contador_cidade = contador_cidade + 1;
	const novaCoisa = {
		id: contador_cidade,
		nome_cidade: dados.nome_cidade,
		uf: dados.uf,
	};

	lista1.push(novaCoisa); // Adiciona na lista.

	// Comentário redundante: Retorna a cidade criada com o status 201.
	res.status(201).json(novaCoisa);
});

/**
 * Rota para listar todas as cidades.
 */
app.get('/cidades', (req: Request, res: Response) => {
	// Retorna a lista completa de cidades.
	res.status(200).json(lista1);
});

/**
 * Função ENORME e com MÚLTIPLAS RESPONSABILIDADES para processar requisições de usuários.
 * Lida com POST (criar) e GET (listar/buscar). Viola o SRP.
 */
const processarUsuarios = (req: Request, res: Response) => {
	// Lógica diferenciada por método HTTP dentro da mesma função.
	if (req.method === 'POST') {
		// Lógica para CRIAR um usuário
		const { nome_completo, doc, end } = req.body;

		// Validação de campos obrigatórios
		if (!nome_completo || !doc || !end || !end.rua || !end.num || !end.cidade_id) {
			return res.status(400).send({ erro: 'Dados incompletos para o usuário.' });
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
			return res.status(409).send({ erro: 'Documento já cadastrado.' });
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
			return res.status(400).send({ erro: 'A cidade informada não existe.' });
		}

		contador_usuario += 1; // Incrementa o contador global
		const novoUsuario = {
			id: contador_usuario,
			nome_completo,
			doc,
			end,
		};
		lista2.push(novoUsuario);
		res.status(201).json(novoUsuario);

	} else if (req.method === 'GET') {
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
				res.status(404).send({ erro: 'Usuário não encontrado com o documento informado.' });
			}
		} else {
			// Retornar todos os usuários
			res.status(200).json(lista2);
		}

	} else {
		res.status(405).send(); // Método não permitido
	}
};

/**
 * Função para lidar com um item específico (usuário).
 * Outra função com múltiplas responsabilidades: GET, PUT e DELETE.
 */
const manipularItemEspecifico = (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);

	// Encontrar o índice do usuário na lista para poder manipular (atualizar/deletar)
	let indice = -1;
	for (let i = 0; i < lista2.length; i++) {
		if (lista2[i].id === id) {
			indice = i;
			break;
		}
	}

	if (indice === -1) {
		return res.status(404).send({ erro: 'Usuário não encontrado.' });
	}

	// Lógica baseada no método HTTP
	if (req.method === 'GET') {
		return res.json(lista2[indice]);
	} else if (req.method === 'PUT') {
		// Atualizar o usuário
		const { nome_completo, end } = req.body;
		if (!nome_completo || !end) {
			return res.status(400).send({ erro: 'Dados incompletos para atualização.' });
		}
		// Não permitimos mudar o documento (regra de negócio escondida aqui)
		lista2[indice].nome_completo = nome_completo;
		lista2[indice].end = end;
		return res.json(lista2[indice]);
	} else if (req.method === 'DELETE') {
		// Deletar o usuário
		lista2.splice(indice, 1);
		return res.status(204).send(); // Sem conteúdo
	}
};


// Agrupando as rotas de usuário em um único handler.
// O método .route do Express é usado aqui.
app.route('/usuarios')
	.post(processarUsuarios)
	.get(processarUsuarios);

// Rotas para manipular um usuário específico por ID.
app.route('/usuarios/:id')
	.get(manipularItemEspecifico)
	.put(manipularItemEspecifico)
	.delete(manipularItemEspecifico);

// ===================================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ===================================================================================
const PORTA = 3000;
app.listen(PORTA, () => {
	console.log(`Servidor de exemplo rodando na porta http://localhost:${PORTA}`);
});