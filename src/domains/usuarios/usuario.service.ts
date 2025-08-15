import {lista2} from "../../constants";

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


function UsuarioService() {

	return {buscarIndiceUsuario}
}


export default UsuarioService;