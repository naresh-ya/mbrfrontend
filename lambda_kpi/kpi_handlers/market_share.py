"""
Market Share Handler
Extracted from api_server.py line 1143-1193
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.s3_helper import get_kpi_from_s3
from utils.response_helper import success_response, error_response


def handle(event: dict) -> dict:
    """
    Handle market share request
    """
    try:
        params = event.get('queryStringParameters', {}) or {}
        month = params.get('month', 'December')
        year = params.get('year', '2025')

        print(f"📊 Fetching Market Share for {month} {year}")

        card = get_kpi_from_s3(year, month, 'market_share_card.json')
        insights = get_kpi_from_s3(year, month, 'market_share_insights.json')

        return success_response({
            "card": card,
            "insights": insights,
            "status": "success"
        })

    except Exception as e:
        print(f"[ERROR] Error in market_share handler: {e}")
        return error_response(f"Failed to fetch market share: {str(e)}")
