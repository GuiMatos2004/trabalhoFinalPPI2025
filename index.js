import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listaEquipes = [];
let listaJogadores = [];
let listaEquipe = [];

const aplicacao = express();

aplicacao.use(express.urlencoded({ extended: true }));

aplicacao.use(session({
    secret: 'ChaveSecreta',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30      //30 minutos
    }
}));

aplicacao.use(cookieParser());

function VerificarAutenticacao(requisicao, resposta, next) {
    if (requisicao.session.Autenticacao) {
        next();
    }
    else {
        resposta.redirect('/pageLogin.html');
    }
}

function autenticarUsuario(requisicao, resposta) {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123') {
        requisicao.session.Autenticacao = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha na autenticação</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/pageLogin.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso) {
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}

function CadastroEquipes(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const tecnico = requisicao.body.tecnico;
    const telefone = requisicao.body.telefone;

    if (nome && tecnico && telefone) {
        listaEquipes.push({ nome: nome, tecnico: tecnico, telefone: telefone });
        resposta.redirect('/listarEquipes');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Cadastro de Equipes</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Preencha todos os campos!!!</p>');
        resposta.write('<a href="/pageEquipe.html">Voltar</a>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
};

function cadastroJogadores(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const numero = requisicao.body.numero;
    const idade = requisicao.body.idade;
    const altura = requisicao.body.altura;
    const sexo = requisicao.body.sexo;
    const posicao = requisicao.body.posicao;
    const equipe = requisicao.body.equipe;

    if (nome && numero && idade && altura && sexo && posicao && equipe ) {
        listaJogadores.push({ nome: nome, numero: numero, idade: idade, altura: altura, sexo: sexo, posicao: posicao, equipe: equipe});
        resposta.redirect('/listarJogadores');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Cadastro de Equipes</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Preencha todos os campos!!!</p>');
        resposta.write('<a href="/cadastroJogadores.html">Voltar</a>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
};

function cadastroEquipe(requisicao, resposta) {
    const equipe = requisicao.body.equipe;
    const data = requisicao.cookies.dataUltimoAcesso;

    if (equipe) {
        listaEquipe.push({ equipe: equipe, data: requisicao.cookies.dataUltimoAcesso });
        resposta.redirect('/listarEquipe');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Equipe</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Preencha todos os campos!!!</p>');
        resposta.write('<a href="/pageEquipe">Voltar</a>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
};



aplicacao.post('/login', autenticarUsuario);

aplicacao.get('/login', (req, resp) => {
    resp.redirect('/pageLogin.html');
});

aplicacao.get('/logout', (req, resp) => {
    req.session.usuarioLogado = false;
    resp.redirect('/pageLogin.html');
});

aplicacao.use(express.static(path.join(process.cwd(), 'public')));
aplicacao.use(VerificarAutenticacao, express.static(path.join(process.cwd(), 'protected')));


aplicacao.post('/cadastrarEquipes', VerificarAutenticacao, CadastroEquipes);
aplicacao.post('/cadastrarJogador', VerificarAutenticacao, cadastroJogadores);
aplicacao.post('/listaEquipe', VerificarAutenticacao, cadastroEquipe);

aplicacao.get('/pageEquipe', VerificarAutenticacao, (req, resp) => {
    resp.write('<!DOCTYPE html>');
    resp.write('<html lang = "pt-br">');
    resp.write('<head>');
    resp.write('<meta charset="UTF-8">');
    resp.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    resp.write('<title>Equipe</title>');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">');
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<div class="container m-5">');
    resp.write('<form method="POST" action="/listaEquipe" class="border row g-3 needs-validation">');
    resp.write('<div class="col-md-4">');
    resp.write('<label for="equipe" class="form-label">Equipe:</label>');
    resp.write('<select name="equipe">');
    for (let i = 0; i < listaEquipes.length; i++) {
        resp.write(`<option value="${listaEquipes[i].nome}">${listaEquipes[i].nome}</option>`);
    }
    resp.write('</select>');
    resp.write('</div>');
    resp.write('<div class="col-md-4">');
    resp.write('<label for="equipe" class="form-label">Equipe:</label>');
    resp.write('<select name="equipe">');
    for (let i = 0; i < listaJogadores.length; i++) {
        resp.write(`<option value="${listaJogadores[i].nome}">${listaJogadores[i].nome}</option>`);
    }
    resp.write('</select>');
    resp.write('</div>');
    resp.write('<div class="col-12 mb-3">');
    resp.write('<button class="btn btn-primary" type="submit">Cadastrar</button>');
    resp.write('<a class="btn btn-secondary" href="/">Voltar</a>');
    resp.write('</div>');
    resp.write('</form>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>');
    resp.write('</html>');
    resp.end();
})

aplicacao.get('/listarEquipe', VerificarAutenticacao, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Lista de Equipes</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Equipe</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Equipe</th>');
    resp.write('<th>Data</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaEquipe.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaEquipe[i].nome}`);
        resp.write(`<td>${listaEquipe[i].equipe}`);
        resp.write(`<td>${listaEquipe[i].data}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/pageEquipe">Equipe</a>');
    resp.write('<br />')
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br />');

    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }

    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
})

aplicacao.get('/listarJogadores', VerificarAutenticacao, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Relação de Jogadores</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Jogadores</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Nome</th>');
    resp.write('<th>Número</th>');
    resp.write('<th>Data de Nascimento</th>');
    resp.write('<th>Altura (em cm)</th>');
    resp.write('<th>Gênero (sexo)</th>');
    resp.write('<th>Posição</th>');
    resp.write('<th>Equipe</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaJogadores.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaJogadores[i].nome}`);
        resp.write(`<td>${listaJogadores[i].numero}`);
        resp.write(`<td>${listaJogadores[i].idade}`);
        resp.write(`<td>${listaJogadores[i].altura}`);
        resp.write(`<td>${listaJogadores[i].sexo}`);
        resp.write(`<td>${listaJogadores[i].posicao}`);
        resp.write(`<td>${listaJogadores[i].equipe}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br />');

    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }

    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

aplicacao.get('/listarEquipes', VerificarAutenticacao, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Relação de Equipes</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Equipes</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Nome</th>');
    resp.write('<th>Tecnico</th>');
    resp.write('<th>Telefone</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaEquipes.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaEquipes[i].nome}`);
        resp.write(`<td>${listaEquipes[i].tecnico}`);
        resp.write(`<td>${listaEquipes[i].telefone}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br />');

    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }

    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});



aplicacao.get('/index', (req, resp) => {
    resp.redirect('/index.html');
});



aplicacao.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})