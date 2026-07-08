```bash
PROJECT=ratiou

git clone git@github.com:RaeII/base_vite.git "$PROJECT"
cd "$PROJECT" || exit 1

# Começar um histórico git limpo
rm -rf .git
git init -b main
git add .
git commit -m "feat: init"

# Criar o repositório no GitHub usando o mesmo nome da pasta atual
gh repo create "$(basename "$PWD")" --private --source=. --push

# Instalar dependências
bun install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar em desenvolvimento
bun dev
```