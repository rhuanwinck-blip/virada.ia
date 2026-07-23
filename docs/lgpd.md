# LGPD

Textos legais sao minutas operacionais e precisam de revisao profissional antes de campanha publica, trafego pago ou
uso financeiro em escala.

## Inventario minimo

- cadastro e contato;
- respostas do diagnostico;
- consentimentos separados;
- eventos de produto minimizados;
- pagamentos e webhooks;
- conexoes Open Finance autorizadas;
- extratos, categorias e saldos quando o usuario conecta banco;
- logs tecnicos de seguranca e erro.

## Direitos do titular

- exportacao de dados;
- exclusao de conta;
- revogacao de consentimento financeiro;
- descadastro de marketing;
- correcao de dados;
- registro de solicitacoes em trilha de auditoria.

## Open Finance

O app nao pede senha bancaria. A conexao deve ocorrer por Pluggy ou Belvo, com escopo de leitura, validade do
consentimento, webhook autenticado e opcao de revogacao. Dados financeiros usados por IA devem ser agregados,
normalizados, mascarados e minimizados.

## Rotas

- `/api/export`: registra pedido de exportacao.
- `/api/delete-account`: registra pedido de exclusao.
- `/api/finance/connections`: lista, cria, revoga e remove conexoes financeiras.

## Pendencias manuais

- validar textos com responsavel juridico;
- publicar canal oficial de privacidade/suporte;
- definir prazo formal de retencao;
- testar exclusao/exportacao com usuario piloto;
- registrar aprovacao antes do go-live amplo.
