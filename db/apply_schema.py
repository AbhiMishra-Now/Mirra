import os
import sys
from pathlib import Path

# Setup paths to import from backend
db_dir = Path(__file__).resolve().parent
project_root = db_dir.parent
sys.path.append(str(project_root))

from backend.lib.dsql_client import execute_query

def split_sql_statements(sql_content):
    """
    Splits SQL script into individual statements safely,
    respecting nested semicolons inside $$ (DO block) structures.
    """
    statements = []
    current_statement = []
    in_dollar_block = False

    for line in sql_content.splitlines():
        current_statement.append(line)
        # Check for block identifier $$
        if "$$" in line:
            in_dollar_block = not in_dollar_block
        
        # If we see a semicolon outside of a block, it marks the end of statement
        if not in_dollar_block and line.strip().endswith(";"):
            statements.append("\n".join(current_statement).strip())
            current_statement = []
            
    if current_statement:
        rem = "\n".join(current_statement).strip()
        if rem:
            statements.append(rem)
            
    return [s for s in statements if s]

def apply_schema():
    init_sql_path = db_dir / "migrations" / "init.sql"
    if not init_sql_path.exists():
        print(f"Error: Could not find schema file at {init_sql_path}")
        return

    print(f"Reading schema migrations from: {init_sql_path}")
    with open(init_sql_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    statements = split_sql_statements(sql_content)
    print(f"Found {len(statements)} SQL statements to execute.")

    for i, stmt in enumerate(statements, 1):
        # Truncate statement for printing
        short_stmt = stmt.split("\n")[0][:60] + "..." if len(stmt.split("\n")[0]) > 60 else stmt.split("\n")[0]
        print(f"[{i}/{len(statements)}] Executing: {short_stmt}")
        try:
            # Enums and Tables creation are write operations, so fetch=False (forces commit)
            execute_query(stmt, fetch=False)
            print(" -> Success")
        except Exception as e:
            print(f" -> Error executing statement: {e}")
            sys.exit(1)

    print("\nAll schema operations applied successfully!")

if __name__ == "__main__":
    apply_schema()
