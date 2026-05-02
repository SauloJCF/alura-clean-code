import { ModeloCidade, ModeloUsuario } from "./models/models";


// lista1 para cidades, lista2 para usuários. Nomes ruins propositalmente.
const listaCidades: ModeloCidade[] = [
	{ id: 1, nome_cidade: 'Propriá', uf: 'SE' },
	{ id: 2, nome_cidade: 'Aracaju', uf: 'SE' },
];

let listaUsuarios: ModeloUsuario[] = [
	{
		id: 1,
		nome_completo: 'Fulano de Tal',
		doc: '11122233344',
		end: { rua: 'Rua A', num: 10, cidade_id: 1 },
	},
];

export { listaCidades, listaUsuarios };