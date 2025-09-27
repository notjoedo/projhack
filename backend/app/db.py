from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import DATABASE_URL

# Create engine first
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Register pgvector adapter for psycopg connections
try:
    from pgvector.psycopg import register_vector

    @event.listens_for(engine, "connect")
    def _on_connect(dbapi_connection, connection_record):
        try:
            register_vector(dbapi_connection)
        except Exception:
            pass  # ok on SQLite or if already registered
except Exception:
    pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()