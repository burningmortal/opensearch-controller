from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

model = SentenceTransformer("intfloat/multilingual-e5-large")

class TextInput(BaseModel):
  text: str

@app.get("/")
def health():
  return {"health": "ok"}

@app.post("/encode")
async def encode_text(input: TextInput):
  print(input)
  embedding = model.encode(input.text)
  return {"title_embedding": embedding.tolist()}
