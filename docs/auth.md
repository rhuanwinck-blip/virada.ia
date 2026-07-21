# Autenticação

Produção deve usar Supabase Auth:

- sessão anônima para diagnóstico;
- vínculo de lead após contato;
- criação/login de conta após pagamento;
- autorização por recurso;
- admin restrito por allowlist em `ADMIN_EMAILS`.

Não confiar em ID recebido do frontend para liberar acesso.
