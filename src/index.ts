/**
 * Importações necessárias para o Express e para a tipagem do TypeScript.
 */
import express, { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { ModeloUsuario } from './models/models';
import { lista1 } from './constants';
import CidadeController from './domains/cidades/cidade.controller';
import UsuarioController from "./domains/usuarios/usuario.controller";

/**
 * Inicialização do Express e configuração do middleware para aceitar JSON.
 */
const app = express();
app.use(express.json());

app.use('/cidades', CidadeController);
app.use('/usuarios', UsuarioController)

// ===================================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ===================================================================================
const PORTA = 3000;
app.listen(PORTA, () => {
	console.log(`Servidor de exemplo rodando na porta http://localhost:${PORTA}`);
});