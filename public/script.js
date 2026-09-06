const form = document.getElementById('form-produto');
const inputId = document.getElementById('produto-id');
const inputDescricao = document.getElementById('descricao');
const inputPreco = document.getElementById('preco');
const inputCategoria = document.getElementById('categoria');
const inputEstoque = document.getElementById('estoque');
const tabela = document.querySelector('table');

// Const login
const formulario = document.getElementById('formularioLogin');

if (formulario) {
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const usuarioDigitado = document.getElementById('input-usuario').value;
        const senhaDigitada = document.getElementById('input-senha').value;

        const resposta = await fetch('/login', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                usuario: usuarioDigitado,
                senha: senhaDigitada
            })
        });

        const dados = await resposta.json();

        if(resposta.ok) {
            window.location.href = '/index.html';
        } else {
            alert(dados.mensagem);
        }
    });
}
// Produtos
function carregarProdutos() {
    fetch('/produtos')
        .then(res => res.json())
        .then(data => {
            tabela.innerHTML = `
                <tr>
                    <td><b>ID</b></td>
                    <td><b>Descrição</b></td>
                    <td><b>Preço</b></td>
                    <td><b>Categoria</b></td>
                    <td><b>Estoque</b></td>
                    <td><b>Ações</b></td>
                </tr>
            `;

            data.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.descricao}</td>
                    <td>R$ ${p.preco}</td>
                    <td>${p.categoria}</td>
                    <td>${p.estoque}</td>
                    <td>
                        <button onclick="prepararEdicao(${p.id}, '${p.descricao}', ${p.preco}, '${p.categoria}', ${p.estoque})">Editar</button>
                        <button onclick="excluirProduto(${p.id})">Excluir</button>
                    </td>
                `;
                tabela.appendChild(tr);
            });
        });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputId.value;
    const produto = {
        descricao: inputDescricao.value,
        preco: Number(inputPreco.value),
        categoria: inputCategoria.value,
        estoque: Number(inputEstoque.value)
    };

    if (id) {
        await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });
    } else {
        await fetch('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });
    }

    form.reset();
    inputId.value = '';
    carregarProdutos();
});

async function excluirProduto(id) {
    await fetch(`/produtos/${id}`, { method: 'DELETE' });
    carregarProdutos();
}

function prepararEdicao(id, descricao, preco, categoria, estoque) {
    inputId.value = id;
    inputDescricao.value = descricao;
    inputPreco.value = preco;
    inputCategoria.value = categoria;
    inputEstoque.value = estoque;
}

carregarProdutos();
