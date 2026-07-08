```bash
# 1. Clonar o template em uma nova pasta
git clone git@github.com:RaeII/base_vite.git $NOME_PROJETO
cd meu-projeto

# 2. Começar um histórico git limpo
rm -rf .git && git init -b main && git add . && git commit -m "feat: init"

# 3. Criar o repositório no GitHub e subir automaticamente
gh repo create $NOME_PROJETO --private --source=. --push

# 5. Instalar dependências
bun install

# 6. Configurar variáveis de ambiente
cp .env.example .env      # preencha PORT, JWT_SECRET, DB_* etc.

# 7. Rodar em desenvolvimento (hot-reload)
bun dev
```