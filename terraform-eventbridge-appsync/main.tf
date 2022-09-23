data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
    account_id = data.aws_caller_identity.current.account_id
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.50.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
  profile = "digital-sandbox-limited-admin"
}

# resource "aws_s3_bucket" "example_nps_test" {
#   bucket = "example-nps-test-23092022"
#   acl    = "private"
# }

resource "aws_appsync_graphql_api" "nps" {
  authentication_type = "API_KEY"
  name                = "nps-example"

  schema = <<EOF
    schema {
      mutation: Mutation
      subscription: Subscription
      query: Query
    }
    type StatusUpdate {
      orderId: ID!
      status: Status!
      prevStatus: Status
      updatedAt: AWSDateTime!
    }

    enum Status {
      PENDING
      IN_PROGRESS
      SHIPPED
      DELIVERED
      COMPLETE
    }

    type Query {
      test: Int
    }

    type Mutation {
      publishStatusUpdate(orderId: ID!,status: Status!,prevStatus: Status,updatedAt: AWSDateTime!): StatusUpdate
    }

    type Subscription {
      onStatusUpdate(orderId: ID!): StatusUpdate  @aws_subscribe(mutations: [ "publishStatusUpdate" ])
    }
  EOF
}

resource "aws_appsync_api_key" "nps_api_key" {
  api_id  = aws_appsync_graphql_api.nps.id
}


resource "aws_appsync_datasource" "nps_none" {
  api_id = aws_appsync_graphql_api.nps.id
  name   = "NoneDataSource"
  type   = "NONE"
}

# UNIT type resolver (default)
resource "aws_appsync_resolver" "nps_none_resolver" {
  api_id      = aws_appsync_graphql_api.nps.id
  field       = "publishStatusUpdate"
  type        = "Mutation"
  data_source = aws_appsync_datasource.nps_none.name

  request_template = <<EOF
{
  "version": "2018-05-29",
  "payload": $util.toJson($ctx.args)
}

EOF

  response_template = <<EOF
$util.toJson($ctx.result)
EOF
}
