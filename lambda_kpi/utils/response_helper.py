"""
API Gateway Response Helper
Formats Lambda responses for API Gateway
"""

import json
from typing import Dict, Any


def success_response(data: Any, status_code: int = 200) -> Dict:
    """
    Format successful API Gateway response

    Args:
        data: Response data (dict, list, etc.)
        status_code: HTTP status code (default 200)

    Returns:
        API Gateway formatted response
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
        'body': json.dumps(data, default=str)
    }


def error_response(error_message: str, status_code: int = 500) -> Dict:
    """
    Format error API Gateway response

    Args:
        error_message: Error description
        status_code: HTTP status code (default 500)

    Returns:
        API Gateway formatted error response
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
        'body': json.dumps({
            'error': error_message,
            'status': 'error'
        })
    }


def not_found_response(message: str = "Resource not found") -> Dict:
    """
    Format 404 response
    """
    return error_response(message, status_code=404)
