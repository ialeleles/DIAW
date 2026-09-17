const formularioLogin = document.getElementById('formularioLogin');

if (formularioLogin) {
    formularioLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuario = document.getElementById('input-usuario').value;
        const senha = document.getElementById('input-senha').value;

        const resposta = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            window.location.href = '/index.html';
        } else {
            alert(dados.mensagem || dados.Erro || 'Usuário ou senha incorretos');
        }
    });
}

const btnSair = document.getElementById('btn-sair');

if (btnSair) {
    btnSair.addEventListener('click', async () => {
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });
}

const formProduto = document.getElementById('form-produto');

if (formProduto) {
    const tabela = formProduto.closest('body').querySelector('table');
    const campoId = document.getElementById('produto-id');
    const btnSalvar = document.getElementById('btn-salvar');
    const tituloForm = document.getElementById('form-title');

    async function carregarProdutos() {
        const resposta = await fetch('/produtos');
        const produtos = await resposta.json();

        tabela
            .querySelectorAll('tr:not(#linha-cabecalho)')
            .forEach((linha) => linha.remove());

        produtos.forEach((produto) => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.descricao}</td>
                <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                <td>${produto.categoria}</td>
                <td>${produto.estoque}</td>
                <td>
                    <button type="button" class="btn-editar" data-id="${produto.id}">Editar</button>
                    <button type="button" class="btn-excluir" data-id="${produto.id}">Excluir</button>
                </td>
            `;

            tabela.appendChild(linha);
        });
    }

    function limparFormulario() {
        formProduto.reset();
        campoId.value = '';
        btnSalvar.textContent = 'Salvar';
        tituloForm.textContent = 'Cadastrar Novo Produto';
    }

    async function tratarRespostaProtegida(resposta) {
        if (resposta.status === 401 || resposta.status === 403) {
            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    formProduto.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = campoId.value;
        const corpo = {
            descricao: document.getElementById('descricao').value,
            preco: document.getElementById('preco').value,
            categoria: document.getElementById('categoria').value,
            estoque: document.getElementById('estoque').value
        };

        const url = id ? `/produtos/${id}` : '/produtos';
        const metodo = id ? 'PUT' : 'POST';

        const resposta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpo)
        });

        if (!(await tratarRespostaProtegida(resposta))) return;

        if (!resposta.ok) {
            const erro = await resposta.json();
            alert(erro.Erro || 'Não foi possível salvar o produto');
            return;
        }

        limparFormulario();
        await carregarProdutos();
    });

    tabela.addEventListener('click', async (event) => {
        const id = event.target.dataset.id;
        if (!id) return;

        if (event.target.classList.contains('btn-editar')) {
            const resposta = await fetch(`/produtos/${id}`);
            const produto = await resposta.json();

            campoId.value = produto.id;
            document.getElementById('descricao').value = produto.descricao;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('categoria').value = produto.categoria;
            document.getElementById('estoque').value = produto.estoque;

            tituloForm.textContent = 'Editar Produto';
            btnSalvar.textContent = 'Atualizar';
        }

        if (event.target.classList.contains('btn-excluir')) {
            const confirmar = confirm('Deseja realmente excluir este produto?');
            if (!confirmar) return;

            const resposta = await fetch(`/produtos/${id}`, { method: 'DELETE' });

            if (!(await tratarRespostaProtegida(resposta))) return;

            await carregarProdutos();
        }
    });

    carregarProdutos();
}
