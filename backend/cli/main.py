import argparse

from app.db.session import SessionLocal
from cli.commands.auth_cmd import login_command, whoami_command
from cli.commands.log_cmd import list_logs_command
from cli.commands.sync_cmd import sync_placeholder_command
from cli.commands.user_cmd import list_users_command


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="HappyWork backend CLI")
    subparsers = parser.add_subparsers(dest="command")

    users_parser = subparsers.add_parser("users", help="User related commands")
    users_subparsers = users_parser.add_subparsers(dest="users_command")
    users_list = users_subparsers.add_parser("list", help="List users")
    users_list.add_argument("--query", type=str, default=None, help="Username fuzzy query")

    logs_parser = subparsers.add_parser("logs", help="Access log related commands")
    logs_subparsers = logs_parser.add_subparsers(dest="logs_command")
    logs_list = logs_subparsers.add_parser("list", help="List access logs")
    logs_list.add_argument("--query", type=str, default=None, help="Log fuzzy query")
    logs_list.add_argument("--limit", type=int, default=20, help="Max log count")

    auth_parser = subparsers.add_parser("auth", help="Authentication commands")
    auth_subparsers = auth_parser.add_subparsers(dest="auth_command")
    auth_login = auth_subparsers.add_parser("login", help="Login and print JWT token")
    auth_login.add_argument("--username", required=True, type=str, help="Username")
    auth_login.add_argument("--password", required=True, type=str, help="Password")
    auth_whoami = auth_subparsers.add_parser("whoami", help="Decode token and print user")
    auth_whoami.add_argument("--token", required=True, type=str, help="JWT access token")

    sync_parser = subparsers.add_parser("sync", help="Data sync commands")
    sync_subparsers = sync_parser.add_subparsers(dest="sync_command")
    sync_run = sync_subparsers.add_parser("run", help="Run placeholder sync task")
    sync_run.add_argument("--source", default="legacy", type=str, help="Source name")

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        return 0

    db = SessionLocal()
    try:
        if args.command == "users" and args.users_command == "list":
            return list_users_command(db, query=args.query)
        if args.command == "logs" and args.logs_command == "list":
            return list_logs_command(db, query=args.query, limit=args.limit)
        if args.command == "auth" and args.auth_command == "login":
            return login_command(db, username=args.username, password=args.password)
        if args.command == "auth" and args.auth_command == "whoami":
            return whoami_command(db, token=args.token)
        if args.command == "sync" and args.sync_command == "run":
            return sync_placeholder_command(source=args.source)

        parser.print_help()
        return 1
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
