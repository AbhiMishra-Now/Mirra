import sys
from pathlib import Path

# Add backend directory to sys.path to support imports from any working directory
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from lib.dsql_client import dsql

def run_test():
    print("🔄 Initializing connection check to Amazon Aurora DSQL...")
    conn = None
    cur = None
    try:
        # Establish connection using the client instance
        conn = dsql.get_connection()
        cur = conn.cursor()

        # 1. Connection Test
        print("⚡ Executing database version check...")
        cur.execute("SELECT version();")
        db_version = cur.fetchone()[0]
        print("✅ Connection successful!")
        print(f"   Database Version: {db_version}\n")

        # 2. Schema Verification
        print("🔍 Scanning public schema tables...")
        query = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """
        cur.execute(query)
        rows = cur.fetchall()
        
        found_tables = {row[0] for row in rows}
        expected_tables = {"users", "products", "try_on_sessions"}
        
        print(f"📋 Found {len(found_tables)} table(s) in public schema:")
        for table in sorted(found_tables):
            print(f"   - {table}")

        # Check for missing tables
        missing_tables = expected_tables - found_tables
        if missing_tables:
            for table in missing_tables:
                print(f"⚠️ Warning: Expected table '{table}' is missing from the database.")
            print("\n❌ Schema verification incomplete. Please run 'db/apply_schema.py' first.")
            sys.exit(1)
        else:
            print("\n🚀 Database is fully ready for the MIRRA backend!")

    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        sys.exit(1)
        
    finally:
        if cur:
            try:
                cur.close()
            except Exception:
                pass
        if conn:
            try:
                conn.close()
            except Exception:
                pass
            print("🔒 Connection properly closed.")

if __name__ == "__main__":
    run_test()
