import os

from superset.config import TALISMAN_CONFIG as TALISMAN_DEFAULTS

SECRET_KEY = os.environ["SUPERSET_SECRET_KEY"]

SQLALCHEMY_DATABASE_URI = (
    f"postgresql+psycopg2://{os.environ['POSTGRES_USER']}:{os.environ['POSTGRES_PASSWORD']}"
    f"@postgres:5432/{os.environ['POSTGRES_DB']}"
)

FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True,
}

GUEST_ROLE_NAME = "Gamma"
GUEST_TOKEN_JWT_SECRET = os.environ["GUEST_TOKEN_JWT_SECRET"]
GUEST_TOKEN_JWT_ALGO = "HS256"
GUEST_TOKEN_JWT_EXP_SECONDS = int(os.environ.get("GUEST_TOKEN_JWT_EXP_SECONDS", 300))

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

ENABLE_CORS = True
CORS_OPTIONS = {
    "supports_credentials": True,
    "origins": [FRONTEND_ORIGIN],
}

merged_csp = dict(TALISMAN_DEFAULTS.get("content_security_policy", {}))
merged_csp["frame-ancestors"] = ["'self'", FRONTEND_ORIGIN]

TALISMAN_ENABLED = True
TALISMAN_CONFIG = {
    **TALISMAN_DEFAULTS,
    "content_security_policy": merged_csp,
    "frame_options": None,
}
