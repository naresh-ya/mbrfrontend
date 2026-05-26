"""
Driving Indicators Handler
Extracted from api_server.py line 850-897
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.s3_helper import get_kpi_from_s3
from utils.response_helper import success_response, error_response


def handle(event: dict) -> dict:
    """
    Handle driving indicators request

    Args:
        event: API Gateway event
        {
            'queryStringParameters': {
                'month': 'November',
                'year': '2025'
            }
        }

    Returns:
        API Gateway response
    """
    try:
        # Extract parameters
        params = event.get('queryStringParameters', {}) or {}
        month = params.get('month', 'December')
        year = params.get('year', '2025')

        print(f"📊 Fetching Driving Indicators for {month} {year}")

        # Fetch sales KPI data (7 cards)
        sales_data = get_kpi_from_s3(year, month, 'sales_kpi_insights.json')

        # Fetch Nielsen data (4 cards - PHILIP MORRIS only)
        nielsen_data = get_kpi_from_s3(year, month, 'nielsen_insights.json')

        return success_response({
            "sales": sales_data,
            "nielsen": nielsen_data,
            "month": month,
            "year": year,
            "status": "success"
        })

    except Exception as e:
        print(f"[ERROR] Error in driving_indicators handler: {e}")
        return error_response(f"Failed to fetch driving indicators: {str(e)}")
