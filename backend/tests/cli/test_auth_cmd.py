import unittest
from types import SimpleNamespace
from unittest.mock import patch

from cli.commands import auth_cmd


class _FakeQuery:
    def __init__(self, result):
        self._result = result

    def filter(self, *args, **kwargs):
        _ = (args, kwargs)
        return self

    def first(self):
        return self._result


class _FakeSession:
    def __init__(self, result):
        self._result = result

    def query(self, model):
        _ = model
        return _FakeQuery(self._result)


class AuthCmdTests(unittest.TestCase):
    def test_login_command_success(self):
        user = SimpleNamespace(username="admin", status="活跃")
        with patch.object(auth_cmd, "authenticate_user", return_value=user), patch.object(
            auth_cmd, "create_access_token", return_value="token-123"
        ), patch("builtins.print") as mock_print:
            exit_code = auth_cmd.login_command(db=object(), username="admin", password="pw")

        self.assertEqual(exit_code, 0)
        mock_print.assert_called_once_with("token-123")

    def test_login_command_invalid_credentials(self):
        with patch.object(auth_cmd, "authenticate_user", return_value=None), patch(
            "builtins.print"
        ) as mock_print:
            exit_code = auth_cmd.login_command(db=object(), username="admin", password="bad")

        self.assertEqual(exit_code, 1)
        mock_print.assert_called_once_with("Login failed: invalid username or password.")

    def test_login_command_disabled_user(self):
        user = SimpleNamespace(username="admin", status="禁用")
        with patch.object(auth_cmd, "authenticate_user", return_value=user), patch(
            "builtins.print"
        ) as mock_print:
            exit_code = auth_cmd.login_command(db=object(), username="admin", password="pw")

        self.assertEqual(exit_code, 1)
        mock_print.assert_called_once_with("Login failed: user 'admin' is disabled.")

    def test_whoami_command_invalid_token(self):
        with patch.object(auth_cmd, "decode_access_token", return_value=None), patch(
            "builtins.print"
        ) as mock_print:
            exit_code = auth_cmd.whoami_command(db=_FakeSession(None), token="bad-token")

        self.assertEqual(exit_code, 1)
        mock_print.assert_called_once_with("Invalid token.")

    def test_whoami_command_user_not_found(self):
        with patch.object(auth_cmd, "decode_access_token", return_value="ghost"), patch(
            "builtins.print"
        ) as mock_print:
            exit_code = auth_cmd.whoami_command(db=_FakeSession(None), token="token")

        self.assertEqual(exit_code, 1)
        mock_print.assert_called_once_with("User in token does not exist.")

    def test_whoami_command_success(self):
        user = SimpleNamespace(id=1, username="admin", role="管理员", status="活跃")
        with patch.object(auth_cmd, "decode_access_token", return_value="admin"), patch(
            "builtins.print"
        ) as mock_print:
            exit_code = auth_cmd.whoami_command(db=_FakeSession(user), token="token")

        self.assertEqual(exit_code, 0)
        mock_print.assert_called_once_with("id=1 username=admin role=管理员 status=活跃")


if __name__ == "__main__":
    unittest.main()
