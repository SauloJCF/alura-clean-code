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

export { ModeloCidade, ModeloUsuario };