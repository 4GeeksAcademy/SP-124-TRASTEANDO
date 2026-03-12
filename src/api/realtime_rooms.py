def user_key(user_id: int, role: str) -> str:
    return f"{role}:{user_id}"


def conversation_room(my_id: int, my_role: str, target_id: int, target_role: str) -> str:
    a = user_key(my_id, my_role)
    b = user_key(target_id, target_role)
    left, right = sorted([a, b])
    return f"conv{left}__{right}"
