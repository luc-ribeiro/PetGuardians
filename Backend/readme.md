# Passo a passo para rodar a aplicação:
## SQL Server
Baixe o [SQL Server](https://go.microsoft.com/fwlink/?linkid=866662) edição de desenvolvedor com a instalação básica ([tutorial](https://www.guru99.com/download-install-sql-server.html)) e anote o nome do servidor criado (geralmente é `localhost`).

## appsettings.Development.json
Caso o servidor seja `localhost`, pule esta etapa. <br>
Abra o arquivo `appsettings.Development.json` localizado na raiz do projeto (backend). Adicione uma nova `string de conexão da seguinte maneira:`
```json
"ConnectionStrings": {
    "BDPetGuardiansStefen": "Server=localhost;Database=BDPetGuardians;Trusted_Connection=True;", // Separe por vírgula a conexão anterior
    "NOME_DA_CONEXAO": "Server=SEU_SERVIDOR;Database=BDPetGuardians;Trusted_Connection=True;" // Adcione sua própria conexão alterando o NOME_DA_CONEXAO e SEU_SERVIDOR
}
```

## Program.cs
Vá para o arquivo `Program.cs` localizado na raiz do projeto e procure a declaração da variável `strConn`, passe como parâmetro da função `GetConnectionString` o nome da sua conexão criada no arquivo `appsettings.Development.json`.

## dotnet ef
Instale o `Entity Framework` executando a função:
```shell
dotnet tool install --global dotnet-ef 
```
Atualize seu banco de dados com as últimas migrações feitas (fazer sempre que possível) executando no terminal:
```shell
dotnet ef database update
```

## dotnet run
Inicie a aplicação executando:
```shell
dotnet watch run --a
```

## Swagger
Acesse a documentação da API após rodar a aplicação, e indo para a rota `/swagger`. <br>
Exemplo: `https://localhost:7202/swagger`

# Comandos do Entity Framework
## Criar `Migrations`
Para criar uma nova *`migration`* (alterações no banco de dados), execute no terminal:
```shell
dotnet ef migrations add "{NOME_DA_VERSAO_DA_MIGRACAO}"
```

## Atualizar o Banco de Dados
Para executar as últimas alterações feitas pelas *`migrations`* execute:
```shell
dotnet ef database update
```

## Visualizar Script
Para gerar o script da migração mais recente utilize o comando:
```shell
dotnet ef migrations script # Gerar no console
dotnet ef migrations script > script.sql # Gerar em um arquivo separado
```

# Coamandos do `dotnet`
## Iniciar aplicação
Para iniciar a aplicação use:
```console
dotnet watch run --a
```

## Limpar compilação
Para limpar os arquivos desncessários antes de subir para o Git, execute:
```console
dotnet clean
```