# from sentence_transformers import SentenceTransformer
# from app.core.config import settings

# _model = None
# def get_model():
#     global _model
#     if _model is None:
#         _model = SentenceTransformer(settings.EMBED_MODEL)
#     return _model

# def embed_text(text: str) -> list[float]:
#     v = get_model().encode([text], normalize_embeddings=True)[0]
#     return [float(x) for x in v]  # length 384 for MiniLM-L6