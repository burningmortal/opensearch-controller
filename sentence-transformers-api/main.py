from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

class TextInput(BaseModel):
  text: str

@app.get("/")
def health():
  return {"health": "ok"}

@app.post("/encode")
async def encode_text(input: TextInput):
  embedding = model.encode(input.text)
  return {"embedding": embedding.tolist()}