import {ModeloCidade, ModeloUsuario} from './models/models';

// Vamos usar listas genéricas para armazenar os dados em memória.
// lista1 para cidades, lista2 para usuários. Nomes ruins propositalmente.
const lista1: ModeloCidade[] = [
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

export { lista1, lista2 };