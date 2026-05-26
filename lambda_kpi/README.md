# KPI Lambda Functions

Lambda functions for serving KPI data from S3.

## Structure

```
lambda_kpi/
├── lambda_function.py      # Main handler (router)
├── kpi_handlers/          # Individual KPI endpoint handlers
│   ├── driving_indicators.py
│   ├── net_revenue.py
│   ├── secondary_volume.py
│   ├── operating_income.py
│   ├── market_share.py
│   └── operations_innovation.py
├── utils/                 # Shared utilities
│   ├── s3_helper.py       # S3 operations
│   └── response_helper.py # API Gateway response formatting
└── requirements.txt       # Dependencies
```

## Endpoints

| Endpoint | Handler | S3 Files |
|----------|---------|----------|
| `/api/kpi/driving-indicators` | `driving_indicators.py` | sales_kpi_insights.json, nielsen_insights.json |
| `/api/kpi/net-revenue` | `net_revenue.py` | nor_kpi_card.json, nor_structured_insights.json |
| `/api/kpi/secondary-volume` | `secondary_volume.py` | secondary_sales_card.json, secondary_structured_insights.json |
| `/api/kpi/operating-income` | `operating_income.py` | operating_income_card.json, operating_income_insights.json |
| `/api/kpi/market-share` | `market_share.py` | market_share_card.json, market_share_insights.json |
| `/api/kpi/operations-innovation` | `operations_innovation.py` | operations_innovation_insights.json |

## Local Testing

```bash
python lambda_function.py
```

## Deployment

See main migration plan for deployment instructions.

## Configuration

- **S3 Bucket:** mbr-data-lake
- **S3 Path Pattern:** metadata/dynamic/{country}/{year}/{month}/kpi/{filename}
- **Lambda Memory:** 512MB recommended
- **Lambda Timeout:** 30 seconds
- **IAM Permissions:** S3 read access to mbr-data-lake bucket
