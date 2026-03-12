import json
import re
from api.services.providers.openai_vision import classify_image
from flask import jsonify


def _fallback(categories):
    otros = next(
        (c for c in categories if c.name.strip().lower() == "otros"),
        None
    )

    chosen = otros or categories[0]

    return {
        "suggested_category_id": chosen.id,
        "suggested_category_name": chosen.name,
        "confidence": 0.0,
        "top": [
            {
                "category_id": chosen.id,
                "category_name": chosen.name,
                "score": 0.0
            }
        ],
        "provider": "fallback"
    }


def _build_prompt(categories):
    allowed = [{"id": c.id, "name": c.name} for c in categories]

    return f"""
Eres un clasificador de productos basado en imagen.
Debes elegir SOLO entre estas categorías permitidas:
{json.dumps(allowed, ensure_ascii=False)}

Devuelve estrictamente un JSON con:
{{
  "category_id": <int>,
  "confidence": <float 0..1>,
  "top": [
    {{"category_id": <int>, "score": <float>}}
  ]
}}
No añadas texto fuera del JSON.
""".strip()


def _extract_json(text: str):
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if not match:
        return None

    try:
        return json.loads(match.group(0))
    except Exception:
        return None


def suggest_category_from_image(image_url, categories):
    try:
        result = classify_image(image_url, categories)
        print("VISION RESULT:", result)

        if not result:
            return _fallback(categories)

        raw_id = result.get("category_id", None)
        if raw_id is None:
            raw_id = result.get("suggested_category_id", None)

        if raw_id is None:
            return _fallback(categories)

        chosen_id = int(raw_id)

        chosen = next((c for c in categories if c.id == chosen_id), None)
        if not chosen:
            return _fallback(categories)

        title = result.get("title") or result.get("suggested_title")
        description = result.get("description") or result.get("suggested_description")

        return {
            "suggested_category_id": chosen.id,
            "suggested_category_name": chosen.name,
            "confidence": float(result.get("confidence", 0.0)),
            "suggested_title": title,
            "suggested_description": description,
            "provider": result.get("provider", "openai"),
        }

    except Exception as e:
        # No ocultar errores en desarrollo (y no devolver fallback como si fuera OK)
        print("Vision error:", e)
        # Si prefieres seguir devolviendo 200, marca error explícito:
        return {
            "error": "vision_failed",
            "detail": str(e),
            "provider": "error"
        }