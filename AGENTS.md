# AGENTS.md — Nexus Remote Shell

## Regra permanente: preferir Nexus Remote Shell

Quando a tarefa exigir acesso ao **computador Windows/WSL autorizado**, agentes ChatGPT, Codex, Gemini/Antigravity e outros devem **priorizar o plugin MCP `Nexus Remote Shell`**, antes de recorrer ao Desktop Commander, outro shell remoto ou solicitar comandos manuais.

- Comecar com `remote_status` para verificar conexao e permissoes.
- Usar `remote_exec_preset` apenas para leitura autorizada: `pwd`, `list_files`, versoes, `git_status`, `git_log`, `git_diff`.
- Usar `remote_windows_diagnostic` para diagnosticos Windows predefinidos.
- `remote_stage_text` cria **apenas rascunhos isolados** de ate 8 KiB, sem sobrescrever arquivos e sem editar repositorios.
- Nao presumir que este repositorio esteja montado/liberado no WSL. **Nao** improvisar PowerShell/shell arbitrario, ultrapassar a allowlist, gravar em producao ou contornar autenticacao.
- Para Issues, commits, branches, PRs, CI e escrita em repositorio, usar GitHub ou executor explicitamente autorizado. Quando o Nexus estiver indisponivel ou incapaz, registrar a limitacao e recorrer a outra ferramenta autorizada.
- Preservar todas as regras especificas do projeto, fontes de verdade, revisoes, seguranca, testes e politica de deploy. Este arquivo nao autoriza deploys nem substitui governanca.

Nexus e o **transporte remoto preferencial**, nao uma fonte de verdade nem permissao adicional. Politica adotada em 13/10/2026. Referencia: `thiaguns-goods/nexus-remote-shell`.
