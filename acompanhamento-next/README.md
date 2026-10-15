# Acompanhamento de estudos

Aplicação Next.js para acompanhar os estudos dos concursos PMPE Soldado e PCPE Agente.

## Executar localmente

```bash
cd acompanhamento-next
npm run dev
```

Abra http://localhost:3000 no navegador. O servidor precisa ficar ativo enquanto estiver usando o app; para encerrar, pressione `Ctrl+C` no terminal.

## Arquivos principais

- `src/app/page.tsx`: tela, navegação e interações.
- `src/app/globals.css`: identidade visual e responsividade.
- `src/app/layout.tsx`: idioma e metadados.

Para validar a versão de produção:

```bash
npm run lint
npm run build
npm run start
```

O `index.html` na raiz do workspace permanece disponível para abertura direta, mas não recebe automaticamente as alterações feitas nesta aplicação Next.js.