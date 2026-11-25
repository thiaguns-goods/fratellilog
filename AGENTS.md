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

---

<!-- NEXUS_GOAL_UNIVERSAL_V1_START -->
## NEXUS GOAL — Execução autônoma supervisionada (padrão 25/11/2026)

Aplicar o [protocolo universal](https://github.com/thiaguns-goods/nexus-knowledge/blob/main/NEXUS-GOAL-PROTOCOL.md) **somente ao objetivo/issue aprovado e às capacidades reais do agente**. As regras específicas deste repositório e as restrições de segurança prevalecem; isto não concede novas permissões, não ativa automações e não reabre projetos encerrados.

- **Retomar com evidências:** conferir issue, PR, branch/HEAD, testes, alterações locais, worktrees, checkpoints e concorrência; não repetir trabalho já comprovado.
- **Executar até o resultado verificável:** investigar → planejar → implementar (se autorizado) → testar → corrigir → validar integração → registrar; Superpowers/TDD quando disponíveis e pertinentes.
- **Sem microconfirmações:** avançar em blocos completos dentro do mandato existente, sem exigir “continue”; escalar apenas bloqueio real, risco ou decisão fora do escopo.
- **Persistência:** preservar e documentar trabalho local não publicado, decisões, diffs, testes e próximo passo; nunca apagar dados, worktrees ou histórico de outros agentes.
- **Verdades separadas:** VERIFICADO AGORA / HISTÓRICO / SIMULADO / PENDENTE / BLOQUEADO; SKIP, HOLD e testes sintéticos não comprovam E2E produtivo.
- **Proteção:** sem gasto, merge/deploy sensível, mudança produtiva, ação financeira/destrutiva, secrets ou ampliação de grants sem gates e autorização próprios; nenhum segundo executor/worker/scheduler.
- **Limite da função:** agentes read-only continuam read-only; este texto não faz a sessão trabalhar em background. O coordenador global é o chat central 03 — Nexus AI Lab.

<!-- NEXUS_GOAL_UNIVERSAL_V1_END -->
