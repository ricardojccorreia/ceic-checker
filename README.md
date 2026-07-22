# Preciso de aprovação da CEIC?

Aplicação web que ajuda a perceber se um projeto de investigação deve ser
submetido à **CEIC** (Comissão de Ética para a Investigação Clínica). O
utilizador responde a algumas perguntas, um algoritmo simples dá uma
orientação e, no fim, o resultado pode ser **descarregado** ou **enviado por
email**.

> ⚠️ Esta ferramenta fornece apenas orientação e não substitui o parecer da
> CEIC nem aconselhamento jurídico.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local em http://localhost:5173
npm run build    # build de produção para ./dist
npm run preview  # pré-visualizar o build
```

## Como editar as perguntas e a lógica

Todo o conteúdo clínico está em [`src/decision.ts`](src/decision.ts):

- `QUESTIONS` — a lista de perguntas apresentadas.
- `evaluate()` — as regras que produzem o veredito.

As regras atuais são um ponto de partida razoável e devem ser validadas/ajustadas
face ao enquadramento legal aplicável.

## Envio por email

O botão "Enviar por email" usa `mailto:`, abrindo o cliente de email do
utilizador com o resultado pré-preenchido. Para envio automático sem cliente de
email (ex.: para um endereço fixo), pode integrar-se um serviço como
[EmailJS](https://www.emailjs.com/) ou uma função serverless.

## Deploy

O `base` do Vite está definido como `./` (caminhos relativos), pronto para
GitHub Pages. Para publicar, faça build e sirva a pasta `dist/` (por exemplo,
com GitHub Actions ou a branch `gh-pages`).
