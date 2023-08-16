import * as cdk from 'aws-cdk-lib';
import { AttributeType, Table, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, 'BlogTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // GSI for User Metrics
    dynamoTable.addGlobalSecondaryIndex({
      indexName: 'UserMetricsIndex',
      partitionKey: {
        name: 'GSI_PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI_SK',
        type: AttributeType.STRING,
      },
    });

    // GSI for All Posts
    dynamoTable.addGlobalSecondaryIndex({
      indexName: 'AllPostsIndex',
      partitionKey: {
        name: 'GSI_PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI_SK',
        type: AttributeType.STRING,
      },
    });

    // Retrieve User Profile: PK/SK: USER#UserId / PROFILE#UserId
    // Latest Posts: GSI: ALL_POSTS / PostTimestamp
    // Posts By User: PK/SK: USER#UserId / POST#Timestamp
    // Comments On Post: PK/SK: POST#PostId / COMMENT#Timestamp
    // Metrics For User: GSI: USER#UserId / METRIC#YYYY-MM-DD

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(process.cwd(), 'package-lock.json'),
      environment: {
        USER_PROFILE_PK: 'USER#UserId',
        USER_PROFILE_SK: 'PROFILE#UserId',
        POST_PK: 'USER#UserId',
        POST_SK: 'POST#Timestamp',
        COMMENT_PK: 'POST#PostId',
        COMMENT_SK: 'COMMENT#Timestamp',
        METRIC_GSI_PK: 'USER#UserId',
        METRIC_GSI_SK: 'METRIC#YYYY-MM-DD',
        ALL_POSTS_GSI_PK: 'ALL_POSTS',
        ALL_POSTS_GSI_SK: 'PostTimestamp',
        TABLE_NAME: dynamoTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
    };

    const getUserProfileLambda = new NodejsFunction(
      this,
      'getUserProfileLambda',
      {
        entry: join(process.cwd(), 'apps', 'lambdas', 'get-user-profile.ts'),
        ...nodeJsFunctionProps,
      }
    );

    dynamoTable.grantReadData(getUserProfileLambda);
  }
}
