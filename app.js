const express = require ('express')
const app = express()
app.use(express.json());

const produtos = [
    { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
        { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
        { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
        { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
        { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" }
]

app.get ('/produtos', (req, res) => {
    res.json(produtos)
});

app.delete ('/produtos/:id', (req, res) => {
    const id = parseInt (req.params.id);
    console.log(`excluir ${id}`)

    const index = produtos.findIndex (produto => produto.id === id)

    if(index != -1) {
        produtos.splice (index, 1)
        res.json (produtos)
    } else {
        res.status(404).json({Erro: 'Id não encontrado'});
    }
});

app.post ('/produtos', (req, res) => {
    const { descricao, valor, marca } = req.body;

    if (!descricao || !valor || !marca) {
        return res.status(400).json({Erro: 'Todos os campos sáo obrigatórios!'})
    }

    const novoProduto = {
        id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
        descricao,
        valor: Number(valor),
        marca
    };

    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, valor, marca } = req.body;

    const index = produtos.findIndex(produto => produto.id === id);

    if (index !== -1) {
       
        produtos[index] = {
            id,
            descricao: descricao || produtos[index].descricao,
            valor: valor ? Number(valor) : produtos[index].valor,
            marca: marca || produtos[index].marca
        };

        res.json(produtos[index]);
    } else {
        res.status(404).json({ Erro: 'Produto não encontrado' });
    }
});

app.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000')
});