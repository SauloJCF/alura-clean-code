import { listaUsuarios } from "../../consts";
import { UsuarioNaoEncontradoError } from "../../execeptions";

const buscarIndiceUsuarioLista = (idParam: any): number => {
    const id = parseInt(idParam, 10);

    for (let i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].id === id) {
            return i;
        }
    }

    throw new UsuarioNaoEncontradoError();
};

const UsuarioService = () => {
    return { buscarIndiceUsuarioLista };
};

export default UsuarioService;