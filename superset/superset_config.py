"""
Configuração customizada do Superset, montada dentro do container via
docker-compose.yml (/app/pythonpath/superset_config.py). Valores sensíveis
vêm de variáveis de ambiente, nunca hardcoded aqui.
"""

import os

from superset.config import TALISMAN_CONFIG as TALISMAN_DEFAULTS

SECRET_KEY = os.environ["SUPERSET_SECRET_KEY"]

# Metadados do Superset (dashboards, usuários, permissões) ficam nessa
# database Postgres — separada da database "owid_data" com os dados públicos
# (ver superset/seed/).
SQLALCHEMY_DATABASE_URI = (
    f"postgresql+psycopg2://{os.environ['POSTGRES_USER']}:{os.environ['POSTGRES_PASSWORD']}"
    f"@postgres:5432/{os.environ['POSTGRES_DB']}"
)

FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True,
}

# --- Guest token (embed) ---
# Papel atribuído ao usuário sintético do guest token: "Gamma" é o papel de
# leitura padrão do Superset — sem acesso admin. O escopo real de "o que esse
# guest token pode ver" vem do parâmetro `resources` na criação do token
# (feito pelo backend), que restringe ao dashboard embedado específico.
GUEST_ROLE_NAME = "Gamma"
GUEST_TOKEN_JWT_SECRET = os.environ["GUEST_TOKEN_JWT_SECRET"]
GUEST_TOKEN_JWT_ALGO = "HS256"
GUEST_TOKEN_JWT_EXP_SECONDS = int(os.environ.get("GUEST_TOKEN_JWT_EXP_SECONDS", 300))

# --- CORS ---
# Necessário pro frontend (origin diferente da do Superset) conseguir
# carregar os assets/API do dashboard embedado.
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

ENABLE_CORS = True
CORS_OPTIONS = {
    "supports_credentials": True,
    "origins": [FRONTEND_ORIGIN],
}

# --- Permitir que o dashboard seja carregado dentro de um <iframe> ---
# Por padrão o Talisman do Superset envia frame-ancestors 'none' (bloqueia
# qualquer framing). Aqui liberamos só a origin do frontend, mantendo o resto
# da política de segurança padrão do Superset intacta.
merged_csp = dict(TALISMAN_DEFAULTS.get("content_security_policy", {}))
merged_csp["frame-ancestors"] = ["'self'", FRONTEND_ORIGIN]

TALISMAN_ENABLED = True
TALISMAN_CONFIG = {
    **TALISMAN_DEFAULTS,
    "content_security_policy": merged_csp,
    "frame_options": None,
}
