resource "aws_iam_role" "eventbridge" {
  name               = "nps-api-destination-invoke-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "events.amazonaws.com"
        }
      },
    ]
  })
}
resource "aws_iam_role_policy" "test_policy" {
  name = "nps-api-destination-invoke-role-policy"
  role = aws_iam_role.eventbridge.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "events:InvokeApiDestination"
        Effect   = "Allow"
        Resource = "arn:aws:events:${data.aws_region.current.name}:${local.account_id}:api-destination/${aws_cloudwatch_event_api_destination.nps_destination.name}/*"
      },
    ]
  })
}

resource "aws_cloudwatch_event_api_destination" "nps_destination" {
  name                             = "nps-appsync-api-destination"
  description                      = "An API Destination"
  invocation_endpoint              = aws_appsync_graphql_api.nps.uris.GRAPHQL
  http_method                      = "POST"
  invocation_rate_limit_per_second = 200
  connection_arn                   = aws_cloudwatch_event_connection.nps.arn
}

resource "aws_cloudwatch_event_connection" "nps" {
  name = "nps-example-connection"
  authorization_type = "API_KEY"

  auth_parameters {
    api_key {
      key   = "x-api-key"
      value = aws_appsync_api_key.nps_api_key.key
    }
  }
}

resource "aws_cloudwatch_event_bus" "nps_event_bus" {
  name = "nps-event-bus"
}

resource "aws_cloudwatch_event_rule" "nps_event_rule" {
  name        = "capture-nps-changes"
  event_bus_name = aws_cloudwatch_event_bus.nps_event_bus.name

  event_pattern = <<EOF
{
  "detail-type": ["Order Status Update"],
  "source": ["nps-event-bus.system"]
}
EOF
}

resource "aws_cloudwatch_event_target" "api_destination" {
  rule      = aws_cloudwatch_event_rule.nps_event_rule.name
  arn       = aws_cloudwatch_event_api_destination.nps_destination.arn
  event_bus_name = aws_cloudwatch_event_bus.nps_event_bus.name
  role_arn = aws_iam_role.eventbridge.arn

  input_transformer {
    input_paths = {
      "orderId": "$.detail.order-id",
      "prevStatus": "$.detail.previous-status",
      "status": "$.detail.status",
      "updatedAt": "$.time"
    }
    input_template = <<EOF
    {
      "query": "mutation PublishStatusUpdate($orderId:ID!, $status:Status!, $prevStatus:Status, $updatedAt:AWSDateTime!) { publishStatusUpdate(orderId:$orderId, status:$status, prevStatus:$prevStatus, updatedAt:$updatedAt) { orderId status prevStatus updatedAt } }",
      "operationName": "PublishStatusUpdate",
      "variables": {
        "orderId": "<orderId>",
        "status": "<status>",
        "prevStatus": "<prevStatus>",
        "updatedAt": "<updatedAt>"
      }
    }
    EOF
  }

}
