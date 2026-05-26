"""
Main Lambda Function Handler
Routes requests to appropriate KPI handler based on path

API Gateway Integration: Lambda Proxy
"""

import json
from kpi_handlers import (
    driving_indicators,
    net_revenue,
    secondary_volume,
    operating_income,
    market_share,
    operations_innovation,
)
from utils.response_helper import not_found_response, error_response


# Route mapping
ROUTES = {
    '/api/kpi/driving-indicators': driving_indicators.handle,
    '/api/kpi/net-revenue': net_revenue.handle,
    '/api/kpi/secondary-volume': secondary_volume.handle,
    '/api/kpi/operating-income': operating_income.handle,
    '/api/kpi/market-share': market_share.handle,
    '/api/kpi/operations-innovation': operations_innovation.handle,
}


def lambda_handler(event, context):
    """
    Main Lambda handler

    Event structure from API Gateway (Lambda Proxy Integration):
    {
        'path': '/api/kpi/net-revenue',
        'httpMethod': 'GET',
        'queryStringParameters': {'month': 'November', 'year': '2025'},
        'headers': {...},
        'body': None
    }

    Returns:
        API Gateway response:
        {
            'statusCode': 200,
            'headers': {...},
            'body': '{"data": ...}'
        }
    """
    try:
        print(f"[INFO] Lambda invoked")
        print(f"   Path: {event.get('path')}")
        print(f"   Method: {event.get('httpMethod')}")
        print(f"   Query: {event.get('queryStringParameters')}")

        # Handle OPTIONS requests (CORS preflight)
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                },
                'body': ''
            }

        # Get path
        path = event.get('path', '')

        # Route to handler
        handler = ROUTES.get(path)

        if handler:
            print(f"[OK] Routing to handler: {handler.__module__}")
            return handler(event)
        else:
            print(f"[ERROR] No handler found for path: {path}")
            return not_found_response(f"Endpoint not found: {path}")

    except Exception as e:
        print(f"[ERROR] Unhandled error in Lambda: {e}")
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}")


# For local testing
if __name__ == '__main__':
    # Test event
    test_event = {
        'path': '/api/kpi/net-revenue',
        'httpMethod': 'GET',
        'queryStringParameters': {
            'month': 'November',
            'year': '2025'
        }
    }

    result = lambda_handler(test_event, None)
    print("\n" + "="*70)
    print("TEST RESULT:")
    print("="*70)
    print(json.dumps(result, indent=2))
