const form = document.getElementById('form-produto');
const inputId = document.getElementById('produto-id');
const inputDescricao = document.getElementById('descricao');
const inputPreco = document.getElementById('preco');
const inputCategoria = document.getElementById('categoria');
const inputEstoque = document.getElementById('estoque');
const tabela = document.querySelector('table');

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
    });

    const data = await res.json();
    if (res.ok) {
        alert('Login realizado com sucesso!');
        carregarProdutos();
    } else {
        alert(data.Erro || 'Erro ao realizar login');
    }
});

document.getElementById('btn-logout').addEventListener('click', async () => {
    await fetch('/logout', { method: 'POST' });
    alert('Desconectado!');
    carregarProdutos();
});

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
                    <td>R$ ${p.preco.toFixed(2)}</td>
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

    const url = id ? `/produtos/${id}` : '/produtos';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    });

    if (res.status === 401 || res.status === 403) {
        alert('Você precisa estar logado para salvar ou alterar produtos!');
        return;
    }

    form.reset();
    inputId.value = '';
    carregarProdutos();
});

async function excluirProduto(id) {
    const res = await fetch(`/produtos/${id}`, { method: 'DELETE' });

    if (res.status === 401 || res.status === 403) {
        alert('Você precisa estar logado para excluir produtos!');
        return;
    }

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