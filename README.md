# BolsaTech

Plataforma web que ajuda estudantes a se inscreverem em editais de bolsas de estudo, como o programa Universidade Gratuita. Com ela, o estudante encontra editais abertos, organiza os documentos exigidos, envia os arquivos com pré-análise e acompanha o resultado.

> Projeto acadêmico. Todas as instituições, editais e protocolos são fictícios. Nenhuma inscrição é enviada a instituições reais.

![Tela inicial](docs/screenshots/inicio-desktop.png)

## O problema

Estudantes que concorrem a bolsas muitas vezes não sabem quais documentos cada instituição exige, onde obtê-los e se os arquivos estão no formato correto. O resultado é perda de prazos, retrabalho e até desclassificação por documentação incompleta ou inválida.

A dor principal está resolvida quando o estudante envia a documentação completa e validada e recebe o protocolo da inscrição.

## Funcionalidades

- **Cadastro e login:** validação em tempo real, indicador de força da senha, aceite da LGPD, bloqueio temporário após 5 tentativas e recuperação de senha.
- **Busca de instituições:** filtros por nome, cidade e forma de ingresso, com selo de edital aberto, encerrado ou ainda não aberto.
- **Checklist de documentos:** lista por edital, separada entre obrigatórios e opcionais, com barra de progresso e prazo sempre visível.
- **Envio de documentos:** upload por seleção, arrastar e soltar ou câmera do celular, com validação de formato (PDF, JPG ou PNG) e de tamanho (até 5 MB).
- **Pré-análise documental:** detecta arquivo renomeado ou corrompido, PDF protegido por senha, quantidade de páginas incompatível, imagem em branco ou escura e resolução baixa.
- **Documentos faltantes:** reúne o que falta enviar e o que precisa de correção em todas as inscrições.
- **Assistente BolsaTech (IA):** resume o checklist do estudante, mostra os documentos faltantes e responde perguntas sobre eles.
- **União de PDFs:** combina vários arquivos em um só, na ordem escolhida.
- **Revisão final:** confirmação antes do envio definitivo, geração do protocolo e comprovante em PDF.
- **Acompanhamento:** linha do tempo do processo, pendências com reenvio apenas do documento solicitado e resultado final (deferido ou indeferido).
- **Estados da interface:** carregamento, erro, vazio, sucesso e sessão expirada.

| Checklist | Documentos faltantes | Celular |
|---|---|---|
| ![](docs/screenshots/checklist-desktop.png) | ![](docs/screenshots/faltantes-desktop.png) | ![](docs/screenshots/documento-mobile.png) |

## Como executar

O projeto é composto por arquivos estáticos (HTML, CSS e JavaScript), sem etapa de build.

1. Clone o repositório.
2. Abra o arquivo `index.html` no navegador.

Para publicar no **GitHub Pages**, acesse *Settings > Pages*, escolha a branch `main` e a pasta `/ (root)`. O site ficará disponível em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`.

É preciso ter conexão com a internet para carregar a fonte (Google Fonts) e a biblioteca [pdf-lib](https://pdf-lib.js.org/), usada na pré-análise de PDFs, na união de arquivos e no comprovante.

## Conta de demonstração

Na tela de login, clique em **"Entrar com a conta de demonstração"**. A conta da estudante Ana Souza já vem com:

- uma inscrição em preenchimento, com 3 de 7 documentos enviados e 1 com pendência;
- uma inscrição já enviada e em análise.

Na tela de acompanhamento, o painel **"Simular resposta da instituição"** permite demonstrar a análise, o pedido de reenvio, o deferimento e o indeferimento.

## Sobre o assistente de IA

O assistente foi feito para rodar como artefato publicado no Claude (claude.ai). Nesse ambiente, ele usa o recurso de IA da plataforma, com autorização do usuário.

Fora do Claude, por exemplo no GitHub Pages, a tela mostra o **resumo automático** do checklist, gerado por regras no próprio navegador, sem IA. Para ativar a IA fora do Claude, é preciso criar um pequeno back-end que chame uma API de IA. A chave da API nunca deve ficar no código do navegador. O ponto de integração é a função `getSample()` em `js/app.js`.

## Limitações da demonstração

- **Sem servidor:** os dados ficam salvos apenas no navegador (`localStorage`). Os arquivos enviados podem ser pré-visualizados só na mesma sessão.
- **Autenticação simulada:** a senha é guardada como hash no próprio navegador, o que serve apenas para demonstração e não é seguro para um sistema real.
- **Simulações:** o progresso do upload e as respostas da instituição são simulados.

## Estrutura

```
index.html                  Estrutura da página (HTML)
css/styles.css              Estilos (CSS)
js/app.js                   Lógica da aplicação (JavaScript)
docs/requisitos.md          Requisitos funcionais e não funcionais
docs/mapeamento-interface.md  Telas e pontos de mapeamento da interface
docs/fluxo-usuario.mmd      Diagrama de fluxo do usuário (Mermaid)
docs/screenshots/           Capturas de tela
```

O diagrama de fluxo pode ser visualizado em [mermaid.live](https://mermaid.live), colando o conteúdo de `docs/fluxo-usuario.mmd`.

## Tecnologias

HTML, CSS e JavaScript puro, em arquivos separados, com [pdf-lib](https://pdf-lib.js.org/) para manipulação de PDFs e a fonte Plus Jakarta Sans. A interface é responsiva (mobile-first), tem modo claro e escuro, navegação por teclado e status que combinam cor, ícone e texto.
