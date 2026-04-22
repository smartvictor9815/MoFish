import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.api.v1.auth import bootstrap_admin, bootstrap_status
from app.schemas.auth import BootstrapAdminRequest


class _FakeQuery:
    def __init__(self, count_value: int):
        self._count_value = count_value

    def count(self) -> int:
        return self._count_value


class _FakeSession:
    def __init__(self, count_value: int = 0, raise_on_commit: bool = False):
        self.count_value = count_value
        self.raise_on_commit = raise_on_commit
        self.added_objects = []
        self.rollback_called = False

    def query(self, _model):
        return _FakeQuery(self.count_value)

    def add(self, obj):
        self.added_objects.append(obj)

    def commit(self):
        if self.raise_on_commit:
            raise IntegrityError("duplicate", params={}, orig=Exception("duplicate"))
        self.count_value = 1

    def refresh(self, obj):
        obj.id = 1
        now = datetime.now(timezone.utc)
        obj.created_at = now
        obj.last_visit = now

    def rollback(self):
        self.rollback_called = True


class BootstrapAuthTests(unittest.TestCase):
    def test_bootstrap_status_when_no_users(self):
        response = bootstrap_status(db=_FakeSession(count_value=0))
        self.assertTrue(response.needs_bootstrap)

    def test_bootstrap_status_when_has_user(self):
        response = bootstrap_status(db=_FakeSession(count_value=2))
        self.assertFalse(response.needs_bootstrap)

    def test_bootstrap_admin_success(self):
        request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
        db = _FakeSession(count_value=0)
        payload = BootstrapAdminRequest(password="secret123")

        with patch("app.api.v1.auth.create_access_token", return_value="token-123"), patch(
            "app.api.v1.auth.create_access_log"
        ):
            response = bootstrap_admin(payload=payload, request=request, db=db)

        self.assertEqual(response.access_token, "token-123")
        self.assertEqual(response.user.username, "admin")
        self.assertEqual(db.added_objects[0].username, "admin")

    def test_bootstrap_admin_rejects_after_initialized(self):
        request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
        db = _FakeSession(count_value=1)
        payload = BootstrapAdminRequest(password="secret123")

        with self.assertRaises(HTTPException) as context:
            bootstrap_admin(payload=payload, request=request, db=db)

        self.assertEqual(context.exception.status_code, 409)

    def test_bootstrap_admin_handles_concurrent_init(self):
        request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
        db = _FakeSession(count_value=0, raise_on_commit=True)
        payload = BootstrapAdminRequest(password="secret123")

        with self.assertRaises(HTTPException) as context:
            bootstrap_admin(payload=payload, request=request, db=db)

        self.assertEqual(context.exception.status_code, 409)
        self.assertTrue(db.rollback_called)


if __name__ == "__main__":
    unittest.main()
