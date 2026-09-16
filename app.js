const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const CHAVE_SECRETA = 'sua_chave_secreta_super_segura';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const produtos = [
  { "id": 1, "descricao": "Arroz parboilizado 5Kg", "preco": 25.00, "categoria": "Alimentos", "estoque": 10 },
  { "id": 2, "descricao": "Maionese 250gr", "preco": 7.20, "categoria": "Alimentos", "estoque": 5 },
  { "id": 3, "descricao": "Iogurte Natural 200ml", "preco": 2.50, "categoria": "Laticínios", "estoque": 0 }
];

function autenticarToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ Erro: 'Acesso negado. Faça login para continuar.' });
  }

  try {
    const usuarioVerificado = jwt.verify(token, CHAVE_SECRETA);
    req.usuario = usuarioVerificado;
    next();
  } catch (err) {
    return res.status(403).json({ Erro: 'Token inválido ou expirado.' });
  }
}

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === 'admin' && senha === '123456') {
    // Cria o payload do JWT
    const token = jwt.sign({ usuario: 'admin', id: 1 }, CHAVE_SECRETA, {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    });

    return res.json({ mensagem: 'Login realizado com sucesso!' });
  }

  return res.status(401).json({ Erro: 'Usuário ou senha incorretos.' });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ mensagem: 'Logout realizado com sucesso!' });
});

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

app.post('/produtos', autenticarToken, (req, res) => {
  const { descricao, preco, categoria, estoque } = req.body;

  if (!descricao || preco === undefined || !categoria || estoque === undefined) {
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

app.put('/produtos/:id', autenticarToken, (req, res) => {
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

app.delete('/produtos/:id', autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(produto => produto.id === id);

  if (index !== -1) {
    produtos.splice(index, 1);
    res.json(produtos);
  } else {
    res.status(404).json({ Erro: 'Id não encontrado' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});