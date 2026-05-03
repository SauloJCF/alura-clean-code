import express, { Request, Response } from 'express';
import { listaCidades } from '../../consts';
import CidadeService from './cidade.service';

const router = express.Router();

const cidadeService = CidadeService();

/**
 * Rota para criar uma nova cidade.
 * Valida, verifica duplicidade e insere. Tudo na mesma função.
 */

const cadastrarCidade = (req: Request, res: Response) => {
    // Pega os dados do corpo da requisição. Nome genérico "dados".Ï
    const dados = req.body;

    // Contadores globais para gerar novos IDs.
    let contador_cidade = listaCidades.length;

    // Incrementa o contador e cria o novo objeto.
    contador_cidade = contador_cidade + 1;
    const novaCoisa = {
        id: contador_cidade,
        nome_cidade: dados.nome_cidade,
        uf: dados.uf,
    };

    listaCidades.push(novaCoisa); // Adiciona na lista.

    // Comentário redundante: Retorna a cidade criada com o status 201.
    res.status(201).json(novaCoisa);
};

const buscarCidades = (req: Request, res: Response) => {
    // Retorna a lista completa de cidades.
    res.status(200).json(listaCidades);
}

router.post('/', 
    cidadeService.validarCamposObrigatoriosCadastrarCidade, 
    cidadeService.validarCidadeJaCadastrada,
    cadastrarCidade
);

/**
 * Rota para listar todas as cidades.
 */
router.get('/', buscarCidades);

export default router;