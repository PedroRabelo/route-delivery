## FIXES
[x] Formatar o cabeçalho para ficar tudo minusculo no padrão
[x] Filtrar os pontos no mapa pela placa
[x] Ajustar as cores do projeto

## Features
[x] Criar uma tela de detalhes das entregas por caminhão
[x] Retirar o cluster do google maps
[x] Criar um rodapé na table com os somatórios do resultado(Qtd. veículos utilizados, peso entregue, valores, percentual da carga utilizada)
[x] Mostrar os pedidos não entregues no mapa
[x] Ao clicar numa placa para filtrar no mapa, ter a opção de limpar para mostrar todos novamente
[x] Aumentar a logo para preencher a altura do navbar
[x] Acrescentar rodapé nos não entregues
[x] Cadastro de veículo(placa, capacidade, ativo)
[] Editar e excluir veículo
[] Ordenar colunas
[] Acrescentar opção para ativar/desativar todos veículos
[] Agrupar pedidos não entregues
  select  id_pedidos_locais,cliente,count(*) pedidos
  ,sum(bruto) carga,sum(total) Valor,obs
  from pedidos
  where roteiroid = 33
  and ID_VEICULO is null
  group by id_pedidos_locais,cliente,obs
  order by cliente
[] Pedidos não entregues sem lat/long, colorir linha de vermelho
[] Filtrar no mapa por pedido ao clicar
[] Validar a estrutura do cep antes de importar o arquivo
[] Colocar uma cor para cada caminhão no mapa