const express = require('express');
const app = express();
app.use(express.json());

const produtos = [
  { "id": 1, "descricao": "Arroz parboilizado 5Kg", "preco": 25.00, "categoria": "Alimentos", "estoque": 10 },
  { "id": 2, "descricao": "Maionese 250gr", "preco": 7.20, "categoria": "Alimentos", "estoque": 5 },
  { "id": 3, "descricao": "Iogurte Natural 200ml", "preco": 2.50, "categoria": "Laticínios", "estoque": 0 },
  { "id": 4, "descricao": "Batata Maior Palha 300gr", "preco": 15.20, "categoria": "Alimentos", "estoque": 2 },
  { "id": 5, "descricao": "Nescau 400gr", "preco": 8.00, "categoria": "Alimentos", "estoque": 6 }
];


app.get('/produtos', (req, res) => {
    res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (produto) {
        res.json(produto);
    } else {
        res.status(404).json({ Erro: 'Produto não encontrado' });
    }
});

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`excluir ${id}`);

    const index = produtos.findIndex(produto => produto.id === id);

    if (index !== -1) {
        produtos.splice(index, 1);
        res.json(produtos);
    } else {
        res.status(404).json({ Erro: 'Id não encontrado' });
    }
});

app.post('/produtos', (req, res) => {
    const { descricao, preco, categoria, estoque } = req.body;

    if (!descricao || preco === undefined || !categoria || estoque === undefined) { // Undefined para receber 0 como valor
    return res.status(400).json({ Erro: 'Todos os campos são obrigatórios!' });
    }

    const ultimoId = produtos.length > 0 ? produtos[produtos.length - 1].id : 0;
    
    const novoProduto = {
        id: ultimoId + 1,
        descricao,
        preco: Number(preco),
        categoria,
        estoque: Number(estoque)
    };

    produtos.push(novoProduto);
    return res.status(201).json(novoProduto);
});


app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, preco, categoria, estoque } = req.body;

    const index = produtos.findIndex(produto => produto.id === id);

    if (index !== -1) {
        produtos[index] = {
            id,
            descricao: descricao || produtos[index].descricao,
            preco: preco !== undefined ? Number(preco) : produtos[index].preco,
            categoria: categoria || produtos[index].categoria,
            estoque: estoque !== undefined ? Number(estoque) : produtos[index].estoque
        };

        res.json(produtos[index]);
    } else {
        res.status(404).json({ Erro: 'Produto não encontrado' });
    }
});

app.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
});