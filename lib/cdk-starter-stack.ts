import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'api', {
      deployOptions: {stageName: 'dev'},
    });

    // 👇 create a lambda function for API integration
    const getTasksLambda = new lambda.Function(this, 'get-tasks-lambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/get-tasks')),
    });

    // 👇 add a /tasks resource
    const tasks = api.root.addResource('tasks');

    // 👇 add a GET method and integrate it with the Lambda function
    tasks.addMethod('GET', new apigateway.LambdaIntegration(getTasksLambda));

    new cdk.CfnOutput(this, 'apiUrl', {value: api.url});
  }
}
