# Sistema Comercial Multiplataforma - Projeto Base

Este é um projeto base de alta qualidade projetado para evoluir para um ERP completo, utilizando Clean Architecture, SOLID, e DRY. O sistema oferece suporte para Web, Desktop e Mobile consumindo uma mesma API RESTful.

## Estrutura de Diretórios

```
/
├── backend/            # API REST (Laravel 12 + PostgreSQL)
├── frontend-web/       # Aplicação Web (React + TypeScript + Vite)
├── desktop/            # Aplicação Desktop (Electron + empacota o React)
├── mobile/             # Aplicativo Mobile (Python + Kivy)
└── README.md           # Este arquivo
```

## Requisitos
- PHP 8.3+ e Composer
- Node.js 20+ e NPM/Yarn
- Python 3.10+
- PostgreSQL 15+

## Passos para Instalação e Execução

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
# Configure o banco de dados no .env e execute:
php artisan migrate --seed
php artisan serve
```

### 2. Frontend Web (React)
```bash
cd frontend-web
npm install
npm run dev
```

### 3. Desktop (Electron)
```bash
cd desktop
npm install
npm start
# Para gerar a build:
npm run build
```

### 4. Mobile (Kivy)
```bash
cd mobile
python -m venv venv
# ative o venv (Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
python main.py
# Para build em APK (necessário Buildozer via WSL ou Linux):
buildozer android debug
```

## Detalhes da Arquitetura (Backend)
- **Repository Pattern:** Abstração de acesso a dados.
- **Service Layer:** Regras de negócio isoladas dos controllers.
- **DTOs / Form Requests:** Validação e transferência de dados limpa.
- **Policies:** Autorização baseada no nível do usuário (Admin, Gerente, Comum).
- **Global Exception Handling:** Retornos em JSON padronizados.
