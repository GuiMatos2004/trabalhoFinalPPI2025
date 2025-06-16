import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

// Dados armazenados em memória
let listaEquipes = [];
let listaJogadores = [];

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'ChaveSeguraParaSessao',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 30 } // 30 minutos
}));

// Função de verificação de login
function verificarAutenticacao(req, res, next) {
    if (req.session.autenticado) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Função de autenticação
function autenticar(req, res) {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if (usuario === 'admin' && senha === '123') {
        req.session.autenticado = true;
        res.cookie('ultimoAcesso', new Date().toLocaleString(), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        res.redirect('/');
    } else {
        res.write('<h2>Usuário ou senha incorretos!</h2>');
        res.write('<a href="/login.html">Voltar</a>');
        res.end();
    }
}

// Cadastro de Equipes
function cadastrarEquipe(req, res) {
    const nome = req.body.nome;
    const cidade = req.body.cidade;

    if (nome && cidade) {
        listaEquipes.push({ nome: nome, cidade: cidade });
        res.redirect('/listarEquipes');
    } else {
        res.write('<p>Preencha todos os campos!</p>');
        res.write('<a href="/cadastroEquipe.html">Voltar</a>');
        res.end();
    }
}

// Cadastro de Jogadores
function cadastrarJogador(req, res) {
    const nome = req.body.nome;
    const idade = req.body.idade;
    const equipe = req.body.equipe;

    if (nome && idade && equipe) {
        listaJogadores.push({ nome: nome, idade: idade, equipe: equipe });
        res.redirect('/listarJogadores');
    } else {
        res.write('<p>Preencha todos os campos!</p>');
        res.write('<a href="/cadastroJogador.html">Voltar</a>');
        res.end();
    }
}

// Rotas de autenticação
app.post('/login', autenticar);

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// Rotas para cadastro
app.post('/cadastrarEquipe', verificarAutenticacao, cadastrarEquipe);
app.post('/cadastrarJogador', verificarAutenticacao, cadastrarJogador);

// Página de listagem de equipes
app.get('/listarEquipes', verificarAutenticacao, (req, res) => {
    res.write('<h1>Lista de Equipes</h1>');
    res.write('<table border="1"><tr><th>Nome</th><th>Cidade</th></tr>');
    for (let eq of listaEquipes) {
        res.write(`<tr><td>${eq.nome}</td><td>${eq.cidade}</td></tr>`);
    }
    res.write('</table>');
    res.write('<a href="/">Voltar</a>');
    res.end();
});

// Página de listagem de jogadores
app.get('/listarJogadores', verificarAutenticacao, (req, res) => {
    res.write('<h1>Lista de Jogadores</h1>');
    res.write('<table border="1"><tr><th>Nome</th><th>Idade</th><th>Equipe</th></tr>');
    for (let jog of listaJogadores) {
        res.write(`<tr><td>${jog.nome}</td><td>${jog.idade}</td><td>${jog.equipe}</td></tr>`);
    }
    res.write('</table>');
    res.write('<a href="/">Voltar</a>');
    res.end();
});

// Configuração de páginas públicas e protegidas
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(verificarAutenticacao, express.static(path.join(process.cwd(), 'protected')));

// Página inicial
app.get('/index', (req, res) => {
    res.redirect('/index.html');
});

// Inicialização do servidor
app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});

//ppi2025