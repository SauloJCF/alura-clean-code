import express, { Request, Response } from 'express';
import { lista1 } from '../../constants';

const router = express.Router();

/**
 * Rota para criar uma nova cidade.
 * Valida, verifica duplicidade e insere. Tudo na mesma função.
 */
router.post('/cidades', (req: Request, res: Response) => {
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

	let contador_cidade = lista1.length;

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
router.get('/cidades', (req: Request, res: Response) => {
	// Retorna a lista completa de cidades.
	res.status(200).json(lista1);
});