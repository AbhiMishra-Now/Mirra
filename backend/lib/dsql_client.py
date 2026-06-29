import os
import boto3
import psycopg2
from pathlib import Path
from dotenv import load_dotenv

# Locate and load the environment variables from backend/.env
lib_dir = Path(__file__).resolve().parent
backend_dir = lib_dir.parent
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

DSQL_CLUSTER_ENDPOINT = os.getenv("DSQL_CLUSTER_ENDPOINT")
DSQL_REGION = os.getenv("DSQL_REGION", "us-east-1")
DSQL_DATABASE = os.getenv("DSQL_DATABASE", "postgres")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

def get_dsql_connection():
    """
    Generates a temporary IAM database authentication token and connects
    to the Amazon Aurora DSQL cluster using psycopg2.
    """
    if not DSQL_CLUSTER_ENDPOINT:
        raise ValueError("DSQL_CLUSTER_ENDPOINT is not set in environment variables.")

    # Create a boto3 session with specified credentials if provided, otherwise fallback to defaults
    session_params = {}
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        session_params['aws_access_key_id'] = AWS_ACCESS_KEY_ID
        session_params['aws_secret_access_key'] = AWS_SECRET_ACCESS_KEY
    
    session = boto3.Session(**session_params)
    dsql_boto_client = session.client('dsql', region_name=DSQL_REGION)

    # Generate the IAM Database Authentication Token for user 'admin'
    db_user = "admin"
    token = dsql_boto_client.generate_db_connect_admin_auth_token(
        Hostname=DSQL_CLUSTER_ENDPOINT
    )

    # Connect to Aurora DSQL using psycopg2
    conn = psycopg2.connect(
        host=DSQL_CLUSTER_ENDPOINT,
        port=5432,
        database=DSQL_DATABASE,
        user=db_user,
        password=token,
        sslmode="require"
    )
    return conn

def execute_query(query, params=None, fetch=True):
    """
    Helper function that handles opening the connection, executing the query,
    committing changes (if write operation), and safely closing connection.
    """
    conn = None
    cur = None
    try:
        conn = get_dsql_connection()
        cur = conn.cursor()
        cur.execute(query, params)
        
        if fetch:
            result = cur.fetchall()
            return result
        else:
            conn.commit()
            return None
    except Exception as e:
        if conn and not fetch:
            conn.rollback()
        raise e
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

class AuroraDSQLClient:
    def get_connection(self):
        """Returns a raw psycopg2 connection to the DSQL cluster."""
        return get_dsql_connection()

    def execute_query(self, query, params=None, fetch=True):
        """Executes a query and automatically handles connection life cycle."""
        return execute_query(query, params, fetch)

# Singleton client instance
dsql = AuroraDSQLClient()

