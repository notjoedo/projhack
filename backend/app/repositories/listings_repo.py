# import psycopg, os
# from typing import List, Dict, Any

# _conn = None
# def get_conn():
#     global _conn
#     if not _conn:
#         _conn = psycopg.connect(os.getenv("SUPABASE_PG_URL"))
#     return _conn

# def search_hybrid(hard: dict, qvec: list[float], k: int) -> List[Dict[str, Any]]:
#     sql = """
#     SELECT id, title, price, lat, lon, dist_km, safety_score, walk_score, feature_match_rate,
#            1 - (vec_desc <=> %(qvec)s) AS cos_sim
#     FROM public.listings
#     WHERE (%(max_price)s IS NULL OR price <= %(max_price)s)
#     ORDER BY vec_desc <=> %(qvec)s
#     LIMIT %(k)s;
#     """
#     with get_conn().cursor(row_factory=psycopg.rows.dict_row) as cur:
#         cur.execute(sql, {"qvec": qvec, "max_price": hard.get("max_price"), "k": k})
#         return list(cur.fetchall())