# Harbor — AI Housing Compatibility Agent | VTHacks 13 - Virginia Tech Hackathon 2025
https://devpost.com/software/harbor-dc63ey

An AI-powered housing compatibility agent for Virginia Tech students.  
It blends **hybrid retrieval, geospatial intelligence, and LLM reasoning** to help students find the best-fit housing, understand *why it matches*, and draft a natural inquiry message to the owner.

---

## Inspiration
Housing search is fragmented and stressful. Students don’t just need listings—they need **fit**: budget, safety, walkability, lifestyle, and compatibility with roommates.  

---

## What it does
- **Search & Match** → Ranks listings by a compatibility score (0–100) using both structured filters and semantic embeddings.  
- **Explainability** → Generates one-line rationales (“why this match”) for each result.  
- **Heatmaps** → Displays H3-based visualizations (price, safety, compatibility, count) across Blacksburg.  
- **Personalized Outreach** → Drafts contact messages to owners with “make it casual” and “make it shorter” rewrites.  

---

## How we built it
- **Figma-first prototyping** → clear user flows and UI specs guided the entire stack.  
- **Retrieval & Ranking** → Supabase Postgres with pgvector for hybrid search (SQL filters + kNN).  
- **Scoring** → Budget, distance, safety, and walkability combined with MMR diversification.  
- **LLM Reasoning** → Gemini API for prompt rewrites, rationales, and inquiry drafting.  
- **Geospatial Intelligence** → H3 aggregation + deck.gl (H3HexagonLayer) for interactive heatmaps.  
- **ETL & Embeddings** → Databricks (Delta + PySpark/Pandas + sentence-transformers) pipeline to clean, enrich, and vectorize listings.  
- **Backend** → FastAPI (Uvicorn) with endpoints:  
  - `/api/match` (search → rank → hexes)  
  - `/api/contact/*` (compose, rewrite)  
- **Frontend** → Vanilla JS + HTML/CSS UI:  
  - Listing cards with compatibility badges  
  - Interactive map with heatmap + top-3 bubbles  
  - Contact modal with live typing effect, copy-to-clipboard, and style rewrites  
- **Data** → Supabase Postgres (listings, vectors), Supabase Storage (images).  

---

## Challenges
- Balancing structured filters with semantic intent.  
- Rendering responsive H3 heatmaps without heavy GIS overhead.  
- Keeping Gemini outputs consistent and fast under hackathon constraints.  

---

## Accomplishments
- **End-to-end pipeline:** search → explain → visualize → contact.  
- **Pixel-to-production fidelity:** translated Figma flows directly into the working UI.  
- Databricks pipeline powering embeddings, geo features, and nightly refresh-ready data.  
- Personalized, natural-sounding contact messages and rewrites.  

---

## What we learned
- **Practical RAG + hybrid search** beats LLM-only pipelines for housing queries.  
- **H3 + deck.gl** deliver city-scale intuition in a lightweight way.  
- UX clarity (“why this match?”) builds trust and adoption.  
- Figma-driven prototyping accelerates development and ensures cohesion.  

---

## What’s next
- Landlord dashboard + **group application packages**.  
- Verified **safety/accessibility layers**, notifications, and waitlists.  
- Full **Databricks job orchestration** for nightly refresh.  
- Expand beyond Virginia Tech → **multi-campus deployment**.  

---

## Tech Stack
- **Design** → Figma  
- **Frontend** → Vite, Vanilla JS, HTML, CSS, deck.gl, h3-js  
- **Backend** → Python, FastAPI, Uvicorn  
- **Database & Search** → Supabase Postgres + pgvector  
- **ETL & Embeddings** → Databricks (Delta, PySpark, Pandas, sentence-transformers)  
- **LLM** → Gemini API  
- **Storage** → Supabase Storage (images)  
- *(Optional)* → Upstash Redis (cache), Supabase Realtime (live updates)  

