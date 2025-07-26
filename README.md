# Status Armazém

Dashboard em **Next.js 15** para visualização de estoque e programação de entradas/saídas de um armazém.  
Este projeto consome uma API interna que retorna dados do SQL Server, processa estatísticas (estoque total, compras, vendas internas e externas) e exibe gráficos de “bar do dia” e totais por mês.

---

## 📦 Tecnologias

- **Next.js 15** (App Router, Server & Client Components)  
- **React 19**  
- **TypeScript**  
- **Tailwind CSS 4**  
- **MSSQL** (pacote `mssql`)  
- **Lucide React** (ícones)  

---

## 🛠️ Pré-requisitos

- Node.js ≥ 18  
- Yarn ou npm  
- Instância SQL Server acessível (pode ser local ou remota)  

---

## 🚀 Instalação

1. Clone este repositório  
	git clone https://github.com/MiguelGFerreira/status-armazem.git
	cd status-armazem

2. Instale dependências
	npm install
	# ou
	yarn install

3. Crie um arquivo .env.local na raiz com as variáveis de ambiente:
	DB_USER=seu_usuario
	DB_PASSWORD=sua_senha
	DB_SERVER=seu_servidor_sql
	DB_DATABASE=seu_banco
	DB_PORT=1433
	DB_ENCRYPT=false
	DB_TRUST_SERVER_CERTIFICATE=true

4. Inicialize o servidor de desenvolvimento
	npm run dev
	# ou
	yarn dev

5. Abra http://localhost:3000 no navegador.