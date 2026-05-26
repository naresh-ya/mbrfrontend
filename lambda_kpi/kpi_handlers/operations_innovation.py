"""
Operations & Innovation Handler
Extracted from api_server.py line 1195-1232
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.s3_helper import get_kpi_from_s3
from utils.response_helper import success_response, error_response


def handle(event: dict) -> dict:
    """
    Handle operations & innovation request
    Returns 3 metrics in one response
    """
    try:
        params = event.get('queryStringParameters', {}) or {}
        month = params.get('month', 'December')
        year = params.get('year', '2025')

        print(f"📊 Fetching Operations & Innovation for {month} {year}")

        data = get_kpi_from_s3(year, month, 'operations_innovation_insights.json')

        # Return entire JSON (contains Customer_Fill_Rate, LOGD, Innovation_Index)
        return success_response(data if data else {})

    except Exception as e:
        print(f"[ERROR] Error in operations_innovation handler: {e}")
        return error_response(f"Failed to fetch operations & innovation: {str(e)}")
