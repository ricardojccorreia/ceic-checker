# Percurso Ético — apreciação ética ou regulamentar?

Aplicação web que ajuda investigadores em Portugal a perceber se um projeto
poderá necessitar de **apreciação ética** e/ou **submissão regulamentar**. A
ferramenta distingue quatro questões frequentemente confundidas:

1. necessidade de apreciação ética;
2. parecer da **CEIC**;
3. parecer de uma **comissão de ética institucional**;
4. submissão regulamentar ao **INFARMED** (incl. **CTIS** para medicamentos).

O utilizador responde a um questionário ramificado (com opções "Não sei"), e o
resultado apresenta **duas dimensões**: a *necessidade de apreciação* e o
*circuito provável*. O relatório pode ser descarregado, copiado, impresso (PDF)
ou enviado por email. Nenhuma resposta é enviada nem armazenada.

> ⚠️ Ferramenta de orientação. Não substitui o parecer da comissão de ética
> competente, da CEIC ou do INFARMED, nem aconselhamento jurídico.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- Router por hash (sem dependências), pronto para GitHub Pages

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local em http://localhost:5173
npm run build    # build de produção para ./dist
npm run preview  # pré-visualizar o build
```

## Estrutura e edição de conteúdo

- [`src/decision.ts`](src/decision.ts) — questionário e regras:
  - `SECTIONS` / `QUESTIONS` — perguntas, opções e lógica de visibilidade
    (`visibleWhen`) que ramifica o fluxo;
  - `evaluate()` — regras que produzem a necessidade de apreciação + circuitos.
- [`src/brand.ts`](src/brand.ts) — marca, navegação, links úteis, **autores**,
  contactos e conteúdo da página "Sobre" (versão, legislação, changelog).
- [`src/pages/`](src/pages/) — páginas (Verificador, Sobre, Autores).

As regras são um orientador inicial e devem ser validadas/ajustadas face ao
enquadramento legal aplicável (que mudou em 2025/2026).

## Envio por email

O botão "Enviar por email" usa `mailto:` (abre o cliente do utilizador). Para
envio automático para um endereço fixo, pode integrar-se um serviço como
[EmailJS](https://www.emailjs.com/) ou uma função serverless.

## Deploy

`base` do Vite está em `./` (caminhos relativos). Cada push para `main` publica
automaticamente no GitHub Pages via GitHub Actions.
