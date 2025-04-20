#!/usr/bin/env python3

import psycopg2
import random
from datetime import datetime, timedelta
from loguru import logger
import os


def connect():
    DB_CONFIG = {
        "host": "localhost",
        "port": 5432,
        "dbname": os.environ["POSTGRES_DB"],
        "user": os.environ["POSTGRES_USER"],
        "password": os.environ["POSTGRES_PASSWORD"],
    }
    return psycopg2.connect(**DB_CONFIG)


def insert_random_records(conn):
    start_time = datetime.now() - timedelta(days=30)
    interval = timedelta(seconds=30)

    with conn.cursor() as cur:
        records = []
        current_time = start_time

        batch_size = 0
        now = datetime.now()
        while current_time < now:
            temperature = random.randint(16, 20)
            humidity = random.randint(20, 55)
            records.append((temperature, humidity, current_time))
            batch_size += 1

            if batch_size == 10_000:
                batch_size = 0
                logger.info(
                    "appending batch {}", records[len(records) - 1][2].isoformat()
                )
                cur.executemany(
                    f"INSERT INTO public.records (temperature, humidity, ts) VALUES (%s, %s, %s)",
                    records,
                )
                records.clear()
                conn.commit()
            current_time += interval

        # insert last records
        cur.executemany(
            f"INSERT INTO public.records (temperature, humidity, ts) VALUES (%s, %s, %s)",
            records,
        )
        conn.commit()
        logger.success("all done")


if __name__ == "__main__":
    conn = connect()
    try:
        insert_random_records(conn)
    finally:
        conn.close()
