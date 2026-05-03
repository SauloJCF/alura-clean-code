import { NextFunction, Request, Response } from "express";
import { listaCidades, listaUsuarios } from "../../consts";
import { BaseError, UsuarioNaoEncontradoError } from "../../execeptions";

function buscarIndiceUsuarioLista(idParam: any): number {
    const id = parseInt(idParam, 10);

    for (let i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].id === id) {
            return i;
        }
    }

    throw new UsuarioNaoEncontradoError();
};

function tratarExcecao(error: any, res: Response) {
    if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ code: error.code, message: error.message });
    } else {
        return res.status(500).send({ error })
    }
}

function validarCamposObrigatoriosRequisicaoCriarUsuario(req: Request, res: Response, next: NextFunction) {
    const { nome_completo, doc, end } = req.body;

    if (!nome_completo || !doc || !end || !end.rua || !end.num || !end.cidade_id) {
        return res.status(400).send({ erro: 'Dados incompletos para o usuário.' });
    }

    next();
}

function validarDocExistenteRequisicaoCriarUsuario(req: Request, res: Response, next: NextFunction) {
    const { doc } = req.body;

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

    next();
}

function validarCidadeRequisicaoCriarUsuario(req: Request, res: Response, next: NextFunction) {
    const { end } = req.body;

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

    next();
}

function validarCamposObrigatoriosRequisicaoAtualizarUsuario(req: Request, res: Response, next: NextFunction) {
    const { nome_completo, end } = req.body;

    if (!nome_completo || !end) {
        return res.status(400).send({ erro: 'Dados incompletos para atualização.' });
    }

    next();
}

function UsuarioService() {
    return {
        buscarIndiceUsuarioLista,
        tratarExcecao,
        validarCamposObrigatoriosRequisicaoCriarUsuario,
        validarDocExistenteRequisicaoCriarUsuario,
        validarCidadeRequisicaoCriarUsuario,
        validarCamposObrigatoriosRequisicaoAtualizarUsuario
    };
};

export default UsuarioService;