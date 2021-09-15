# Bot de votação (e informativo) da Semcomp

## Rodando o servidor
Para poder executar o servidor, o node deve estar instalado na máquina e também o gerenciador de pacotes yarn. É necessário ter o arquivo `.env` dentro da pasta server para realizar a conexão com o chat da twitch e com o bucket da AWS para salvar as imagens.

Os comandos para executar são:
```bash
yarn # instala todas as dependencias necessárias

yarn dev # roda o servidor localmente
```
*Obs:* O servidor não armazena dados, então se o servidor for fechado ou reiniciado irá perder os dados já registrados (opções de votação, votos e usuários que já votaram).

## Rodando a aplicação
Para a aplicação funcionar sem problemas o servidor já deve estar em execução localmente. Os comandos para executar são:
```bash
yarn # instala todas as dependencias necessárias

yarn start # inicia a aplicação no http://localhost:4200/
```

<br/>

*Qualquer dúvida só me chamar* 😬