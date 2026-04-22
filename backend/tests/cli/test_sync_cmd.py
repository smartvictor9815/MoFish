import unittest
from unittest.mock import patch

from cli.commands.sync_cmd import sync_placeholder_command


class SyncCmdTests(unittest.TestCase):
    def test_sync_placeholder_command_prints_source(self):
        with patch("builtins.print") as mock_print:
            exit_code = sync_placeholder_command(source="legacy")

        self.assertEqual(exit_code, 0)
        mock_print.assert_called_once_with("Sync task placeholder executed. source=legacy")


if __name__ == "__main__":
    unittest.main()
