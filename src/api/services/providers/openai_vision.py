import os
import json
import re
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def _extract_json(text: str):
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except Exception:
        return None
    
def classify_image(image_url, categories):

    allowed = [
        {"id": c.id, "name": c.name}
        for c in categories
        if c.name.strip().lower() != "otros"
    ]


    prompt = f"""
Eres un sistema experto en clasificación de productos a partir de imágenes.

Analiza la imagen y devuelve un JSON ESTRICTO.

1) Identifica el objeto principal.
2) Genera un título corto (2-6 palabras).
3) Genera una descripción breve (1-2 frases) basada SOLO en lo que se ve.
4) Debes elegir SOLO una categoría válida, la categoría MÁS adecuada de esta lista (SOLO IDs permitidos):
{json.dumps(allowed, ensure_ascii=False)}

Reglas IMPORTANTES:
- No elijas "Otros" (no está permitido). Si no encaja claramente, elige la más cercana por uso/función.
- Electrónica: auriculares, altavoces, cargadores, dispositivos, gadgets.
- Herramientas: arrancadores de coche, herramientas manuales/eléctricas, útiles.
- Hogar: objetos domésticos, almacenamiento, menaje, decoración.
- Deporte: material deportivo.
- Ropa: prendas, accesorios textiles.
- Si es LEGO, figura, muñeco, set de construcción o juguete → Juguetes.

Devuelve estrictamente este JSON:
{{
  "title": "string",
  "description": "string",
  "category_id": number,
  "confidence": number
}}

""".strip()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url}
                    }
                ],
            }
        ],
    )

    raw = response.choices[0].message.content or ""
    print("OPENAI RAW:", raw)

    try:
        return json.loads(raw)
    except Exception:
        return _extract_json(raw)