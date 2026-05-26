"""
S3 Helper Functions for KPI Lambda
Extracted from api_server.py
"""

import json
import boto3
from typing import Optional, Dict

# S3 Configuration
S3_BUCKET = "mbr-data-lake"
s3_client = boto3.client('s3')


def get_kpi_from_s3(year: str, month: str, filename: str, country: str = "India") -> Optional[Dict]:
    """
    Fetch KPI data from S3

    Args:
        year: "2025"
        month: "December"
        filename: "sales_kpi_insights.json"
        country: "India"

    Returns:
        Dict with data if found, None otherwise
    """
    try:
        s3_key = f"metadata/dynamic/{country}/{year}/{month}/kpi/{filename}"

        print(f"[INFO] Fetching from S3: s3://{S3_BUCKET}/{s3_key}")

        response = s3_client.get_object(Bucket=S3_BUCKET, Key=s3_key)
        data = json.loads(response['Body'].read().decode('utf-8'))

        print(f"[OK] Successfully loaded {filename}")
        return data

    except s3_client.exceptions.NoSuchKey:
        print(f"[WARN]  File not found: {s3_key}")
        return None
    except Exception as e:
        print(f"[ERROR] Error reading from S3: {e}")
        return None
