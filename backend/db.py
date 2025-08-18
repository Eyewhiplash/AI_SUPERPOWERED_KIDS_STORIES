import psycopg2
from contextlib import contextmanager
from config import settings


def get_connection():
    return psycopg2.connect(
        host=settings.db_host,
        database=settings.db_name,
        user=settings.db_user,
        password=settings.db_pass,
    )


@contextmanager
def db_cursor():
    conn = get_connection()
    try:
        cur = conn.cursor()
        yield conn, cur
        conn.commit()
    finally:
        try:
            conn.close()
        except Exception:
            pass


