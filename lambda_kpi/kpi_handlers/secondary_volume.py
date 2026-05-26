"""
Secondary Volume Handler
Extracted from api_server.py line 1039-1089
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.s3_helper import get_kpi_from_s3
from utils.response_helper import success_response, error_response


def handle(event: dict) -> dict:
    """
    Handle secondary volume request
    """
    try:
        params = event.get('queryStringParameters', {}) or {}
        month = params.get('month', 'December')
        year = params.get('year', '2025')

        print(f"📊 Fetching Secondary Volume for {month} {year}")

        card = get_kpi_from_s3(year, month, 'secondary_sales_card.json')
        insights = get_kpi_from_s3(year, month, 'secondary_structured_insights.json')

        return success_response({
            "card": card,
            "insights": insights,
            "status": "success"
        })

    except Exception as e:
        print(f"[ERROR] Error in secondary_volume handler: {e}")
        return error_response(f"Failed to fetch secondary volume: {str(e)}")
