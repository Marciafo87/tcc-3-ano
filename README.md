# NEXT LEVEL EXPERIENCE

> "O futuro não é apenas planejado. É administrado, construído e transformado."

Plataforma digital imersiva do curso de Administração: apresentação do curso, jornada dos dois anos, gestão na prática, simulador "Você é o gestor", projetos, palestras, experiências interativas, mercado de trabalho, formulário com QR Code, assistente NEX, modo apresentação e painel administrativo.

Feito só com **HTML5, CSS3 e JavaScript**. Não precisa instalar nada, não precisa de servidor pago nem de banco de dados.

---

## 1. Estrutura do projeto

```
NEXT-LEVEL-EXPERIENCE/
├── index.html            Site público
├── style.css             Identidade visual
├── script.js             Funcionamento do site
├── INICIAR-SITE.bat      Abre o site no Windows (duplo clique)
├── servidor-local.ps1    Servidor local usado pelo .bat
├── README.md             Este arquivo
├── admin/                Painel administrativo (/admin)
│   ├── index.html
│   ├── admin.css
│   └── admin.js
├── data/
│   ├── defaults.js       Conteúdo demonstrativo inicial
│   └── content.js        Conteúdo publicado (gerado pelo painel)
└── assets/
    ├── js/               store.js, icons.js, qrcode.js, experiences.js, nex.js
    ├── icons/            favicon.svg
    └── images/           (livre para imagens fixas, se quiser)
```

Ajuste em relação à estrutura sugerida: os scripts auxiliares ficam em `assets/js/` e o conteúdo em `data/` como `.js` (e não `.json`), porque arquivos `.js` funcionam até abrindo o site com dois cliques, sem servidor. Um `.json` seria bloqueado pelo navegador nesse modo.

**Bibliotecas externas:** nenhuma. O QR Code é gerado por código próprio (`assets/js/qrcode.js`). A única dependência opcional são as fontes Inter e Sora do Google Fonts: sem internet, o site usa automaticamente as fontes do Windows.

---

## 2. Como abrir no Windows

**Opção A (recomendada):** clique duas vezes em **`INICIAR-SITE.bat`**.
Uma janela preta abre e o navegador mostra o site em `http://localhost:8080/`. Mantenha essa janela aberta enquanto usar o site.
- Se o Windows mostrar "O Windows protegeu o computador", clique em **Mais informações → Executar assim mesmo**.
- Se aparecer um aviso do Firewall, pode permitir: o servidor só atende o próprio computador.

**Opção B:** clique duas vezes em **`index.html`** (abre no navegador padrão). Tudo funciona, inclusive o painel.

**Importante:** o conteúdo editado no painel fica salvo **no navegador e no endereço** usados. Escolha uma opção (A ou B) e use sempre a mesma, no mesmo navegador (Chrome ou Edge recomendados). Se trocar, leve o conteúdo com **Exportar backup → Importar backup**.

---

## 3. Painel administrativo

- Endereço: `http://localhost:8080/admin/`, ou o link **"Área administrativa"** no rodapé do site, ou abra `admin/index.html`.
- **Primeiro acesso:** o painel pede para criar uma senha (mínimo de 6 caracteres).
- Menu lateral: Dashboard, Identidade e textos, Formação, Jornada, Gestão na prática, Projetos, Palestras, Imagens e galeria, Experiências (simulador, quiz, desafio, perfis, NEX), Mercado, Inscrição, Forms e links, Backup e publicação, Segurança.
- Todo salvamento mostra uma mensagem de confirmação. Toda exclusão pede confirmação.
- Com o site aberto em outra aba, as alterações aparecem **na hora**.

### Segurança (leia)
- A senha é guardada como resumo criptográfico (PBKDF2-SHA-256 com sal), **nunca em texto puro**.
- **Limitação:** este é um site estático, sem servidor. A senha impede o acesso casual, mas **não é autenticação segura**: quem tiver acesso técnico ao navegador ou aos arquivos consegue alterar os dados.
- Visitantes **não alteram** o site publicado. Se alguém abrir o /admin na hospedagem, as mudanças ficam só no navegador dessa pessoa.
- Para autenticação real (vários administradores, editar de qualquer lugar) será preciso um backend. Veja a seção 8.

### Esqueci a senha
O conteúdo não se perde. No painel, aperte **F12 → aba Console**, digite `localStorage.removeItem('nlx:auth')`, aperte Enter e recarregue a página. O painel pedirá uma nova senha.

---

## 4. Configurar o Google Forms

1. No Google Forms, abra o formulário → **Enviar** → ícone de **link** → marque **Encurtar URL** → **Copiar**.
2. No painel: **Inscrição, Forms e links** → cole o link → **Salvar link**.
3. O QR Code aparece no painel e no site. Use **Testar link** para conferir.
4. **Teste obrigatório:** aponte a câmera de um celular real para o QR Code (na tela do computador e no telão) e confirme que o formulário abre.
5. Para imprimir: **Baixar QR Code em PNG**.

Sem link cadastrado, o site mostra uma mensagem informativa (nenhum endereço inventado).

### Botão de inscrição
A seção **Inscrição** do site tem um botão grande "QUERO ME INSCREVER".
1. Painel → **Inscrição, Forms e links** → **Botão de inscrição** → cole o link → **Salvar link de inscrição**.
2. Se esse campo ficar vazio, o botão usa o link do Google Forms. Sem nenhum dos dois, aparece "Inscrições em breve".
3. Título, texto e texto do botão podem ser mudados em **Identidade e textos → Inscrição**.

---

## 5. Como a professora cadastra projetos

1. Painel → **Projetos** → **+ Cadastrar projeto**.
2. Preencha nome, categoria, descrição (obrigatórios) e, se quiser: integrantes, objetivo, problema, solução, conhecimentos aplicados, link e imagens.
3. **Imagem de capa:** clique em *Selecionar imagem* (JPG, PNG, WEBP ou GIF, até 10 MB). A imagem é reduzida automaticamente. Use *Substituir* ou *Remover* quando precisar.
4. **Salvar.** Use ↑ ↓ para mudar a ordem na galeria, **Editar** para alterar e 🗑 para excluir.
5. Marque **Ocultar do site (rascunho)** para guardar um projeto sem mostrá-lo aos visitantes. No painel ele aparece com a etiqueta OCULTO.
6. As categorias podem ser editadas no fim da página Projetos.
7. Sem projetos visíveis, o site mostra "Projetos em breve".

## 6. Como cadastrar palestras

1. Painel → **Palestras** → **+ Cadastrar palestra**.
2. Nome, data e horário são obrigatórios. Palestrante, tema, duração, local, foto e descrição são opcionais.
3. A programação é ordenada sozinha. A **próxima atividade** ganha destaque com contagem regressiva, e a atividade em andamento aparece como "Acontecendo agora".
4. Sem palestras cadastradas, o site mostra uma mensagem elegante de "programação em atualização".

---

## 7. Publicar o conteúdo (importante)

O painel salva o conteúdo **no navegador** de quem edita. Para que **outros computadores, celulares e a hospedagem** vejam as alterações:

1. Painel → **Backup e publicação** → **Gerar arquivo de publicação**. O navegador baixa um `content.js`.
2. Substitua o arquivo `data/content.js` do projeto por esse arquivo.
3. Se o site já estiver hospedado, envie o projeto atualizado de novo.

**Backup:** use **Exportar backup JSON** sempre depois de cadastrar conteúdos importantes. **Importar backup JSON** restaura tudo (inclusive em outro computador). **Restaurar demonstração** volta ao conteúdo de exemplo.

**Limite de imagens:** o navegador reserva cerca de 5 MB. O painel mostra quanto já foi usado em **Imagens e galeria**. Se encher, o painel avisa e não salva, sem perder o que já existe.

---

## 8. Hospedagem (quando for definida)

O projeto é um **site estático**: funciona em qualquer hospedagem de arquivos.

- **Netlify Drop (mais rápido):** acesse app.netlify.com/drop e arraste a pasta `NEXT-LEVEL-EXPERIENCE`. Em segundos você recebe um endereço público.
- **GitHub Pages:** crie um repositório, envie os arquivos e ative *Settings → Pages* (branch `main`, pasta raiz).
- **Vercel / Cloudflare Pages:** importe a pasta ou o repositório, sem comando de build.
- **Hospedagem da escola:** envie todos os arquivos mantendo as pastas.

Antes de publicar, gere e substitua o `data/content.js` (seção 7). O painel fica em `seu-endereco/admin/`.

**Se quiserem edição online com login de verdade no futuro:** a camada de dados está isolada em `assets/js/store.js`. Dá para trocá-la por um serviço com autenticação (por exemplo, Supabase ou Firebase) sem refazer o site.

---

## 9. Modo apresentação (telão)

- Clique em **AO VIVO** no topo, ou aperte **P**, ou abra `index.html#apresentacao`.
- **← →** (ou o passador de slides) navegam entre seções · **F** tela cheia · **Q** QR Code gigante no telão · **Esc** sai.
- Tipografia maior, contraste mais alto, animações leves e menu e assistente ocultos.

**Simulador com a plateia:** na seção "Você é o gestor", clique em **Jogar com a plateia**. Leia a situação, peça para o público levantar a mão em cada alternativa e some os votos com as teclas **1 a 4** (ou os botões + e −). Depois clique em **Executar a mais votada**. Em caso de empate, o sistema pede desempate.

---

## 10. Informações pendentes (precisam ser fornecidas)

- [ ] Link do **Google Forms** (e teste do QR Code com celular real)
- [ ] Link de **inscrição** (opcional: sem ele, o botão usa o link do Google Forms)
- [ ] **Projetos reais** da turma (nomes, integrantes, imagens)
- [ ] **Programação de palestras**: horários, palestrantes, local e fotos
- [ ] Conteúdos confirmados da **jornada dos dois anos** (as etapas atuais são genéricas)
- [ ] Confirmação das **áreas de conhecimento** com a coordenação
- [ ] **Instituição, turma, data e local** da apresentação (Identidade e textos)
- [ ] Fotos para a **galeria** (opcional)
- [ ] Redes sociais e links externos (opcional)
- [ ] Definição da **hospedagem**

---

## 11. Relatório de testes

Testes automatizados executados no **Google Chrome** (Playwright), em telas desktop 1440×900 e 1366×900 e celular 390×844, com o site servido por HTTP e também aberto direto do arquivo (`file://`). **75 de 75 verificações passaram.**

**Painel (39/39):** link de inscrição salvo; projeto oculto não aparece no site; site sem selos de "Editável"/"Exemplo"; botão de inscrição abrindo o link cadastrado; criação de senha; senhas diferentes rejeitadas; senha guardada sem texto puro; senha errada bloqueada; login; campos obrigatórios; arquivo que não é imagem rejeitado; prévia de imagem; URL inválida rejeitada; cadastro, edição e exclusão de projeto (com cancelamento e confirmação); cadastro de 2 palestras; link do Forms sem "https" rejeitado; QR no painel; quiz com alternativa correta fora do intervalo rejeitado; adição de alternativa em desafio; JSON inválido do simulador rejeitado; persistência após recarregar; dashboard com últimas alterações; backup exportado com os dados; content.js gerado; projeto real, próxima palestra e instituição aparecendo no site; **QR Code do site lido por um leitor (OpenCV) e conferido com o link cadastrado**; modal de projeto; filtro por categoria; atualização ao vivo do site; restauração da demonstração; importação de backup; backup inválido rejeitado; nenhum erro de JavaScript.

**Site e experiências (36/36):** site padrão sem selos de "Editável"/"Exemplo"; inscrição sem link mostra "Inscrições em breve"; NEX responde sobre inscrição; as 6 rodadas do simulador com feedback; resultado final com pontuação e radar; modo plateia (votos por teclado, execução da mais votada, aviso de empate); quiz com feedback, resultado e reinício; desafio empresarial; descubra seu perfil com aviso de que não é avaliação; NEX respondendo 4 perguntas e levando até a seção; modo apresentação (ativar, avançar, ir ao fim, QR, sair); menu mobile; ausência de rolagem horizontal no celular; preferência por movimento reduzido; abertura por `file://` do site e do painel; nenhum erro de JavaScript.

**Gerador de QR Code:** 120 códigos de vários tamanhos gerados e lidos; todos os tamanhos usados por links de formulário (versões 1 a 11) foram lidos sem falha.

**Não testado (fazer antes do evento):**
- O `INICIAR-SITE.bat` / `servidor-local.ps1` em um Windows real (o ambiente de desenvolvimento não tinha PowerShell). Se ele falhar, use a opção B (abrir o `index.html`), que foi testada.
- Leitura do QR Code com a **câmera de um celular real** e no **telão** do evento.
- Safari (iPhone) e Firefox: o código usa apenas recursos padrão, mas os testes rodaram no Chrome.
- Fontes do Google: os testes rodaram sem elas (fallback do sistema).
