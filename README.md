# DIAW

**O que é um cookie?**
É um dado que o servidor pede para o navegador guardar e o navegador devolve em todas as próximas requisições no mesmo site.

**Quem armazena o cookie: cliente ou servidor?**
O cliente (navegador). O servidor apenas envia a instrução de criação.

**Quem envia o cookie nas próximas requisições?**
O próprio navegador de forma automática e em toda requisição feita para o domínio dono do cookie.

**O que muda quando utilizamos HttpOnly?**
O cookie deixa de poder ser lido ou alterado no JavaScript da página, passando apenas pelo http.

**Por que um cookie HttpOnly continua funcionando mesmo não aparecendo em `document.cookie`?**
Porque `HttpOnly` só bloqueia o acesso pelo JavaScript do navegador, já que o envio do cookie nas requisições HTTP é feito pelo próprio navegador.

**Qual é a finalidade de Secure?**
Garantir que o cookie só seja enviado em conexões HTTPS, evitando que ele passe como texto em uma rede insegura.

**Qual é a finalidade de SameSite?**
Restringir o envio do cookie em requisições que partem de outros sites.

**Qual a diferença entre armazenar simplesmente um identificador de usuário e armazenar um JWT?**
Um identificador simples é só um número que o servidor precisa consultar em sua base a cada requisição, e que pode ser alterado manualmente pelo usuário sem nenhuma proteção. Já o JWT carrega os dados com uma assinatura, então o servidor consegue verificar se o conteúdo foi alterado.

**O conteúdo de um JWT é secreto?**
Não, é apenas codificado em Base64. O que é protegido é a assinatura, que impede alterações não autorizadas no conteúdo.

**Por que armazenar um JWT em um cookie HttpOnly pode ser mais seguro do que disponibilizá-lo diretamente ao JavaScript?**
Porque se o token ficasse acessível pelo JavaScript, ele poderia ser acessado facilmente. Dentro de um cookie HttpOnly, o token não pode ser lido por scripts maliciosos na página.


Link render: https://diaw-api-nodejs.onrender.com
