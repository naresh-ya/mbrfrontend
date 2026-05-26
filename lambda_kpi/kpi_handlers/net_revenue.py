"""
Net Revenue Handler
Extracted from api_server.py line 964-1037
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.s3_helper import get_kpi_from_s3
from utils.response_helper import success_response, error_response


def handle(event: dict) -> dict:
    """
    Handle net revenue request
    Returns YTD card + Monthly card + insights
    """
    try:
        params = event.get('queryStringParameters', {}) or {}
        month = params.get('month', 'December')
        year = params.get('year', '2025')

        print(f"📊 Fetching Net Revenue for {month} {year}")

        # Fetch card data (may contain both YTD and Monthly)
        cards_data = get_kpi_from_s3(year, month, 'nor_kpi_card.json')

        ytd_card = None
        monthly_card = None

        if cards_data:
            # Check if it's an array containing both cards
            if isinstance(cards_data, list) and len(cards_data) >= 2:
                ytd_card = cards_data[0]
                monthly_card = cards_data[1]
                print("[OK] Extracted YTD and Monthly cards from array")
            else:
                ytd_card = cards_data
                # Try separate monthly card file
                monthly_card = get_kpi_from_s3(year, month, 'nor_monthly_card.json')

        # Fetch insights
        insights = get_kpi_from_s3(year, month, 'nor_structured_insights.json')

        return success_response({
            "ytdCard": ytd_card,
            "monthlyCard": monthly_card,
            "insights": insights,
            "status": "success"
        })

    except Exception as e:
        print(f"[ERROR] Error in net_revenue handler: {e}")
        return error_response(f"Failed to fetch net revenue: {str(e)}")
