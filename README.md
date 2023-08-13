# Readership

This repository contains a fullstack application built using Nx. It includes a React frontend, AWS Lambda backend, and infrastructure code managed by AWS CDK.

> **Note:** All commands mentioned below should be executed from the root directory of the project.

### Setup

1. Make sure you have the AWS CLI installed and properly configured with the necessary AWS credentials: `aws configure`
2. Install the required packages: `npm install`

### Build & Deployment

#### Building the Application

Before deploying, you must build the respective parts of the application:

1. Build the infrastructure code: `nx build infra`
2. Build the backend (Lambda functions): `nx build backend`
3. Build the frontend (React app): `nx build frontend`

> **Note:** Before running cdk deploy, always ensure to run `nx build infra` to compile the latest infrastructure changes.

#### Deploying the Application

- Initialize the CDK app (only required once): `cdk bootstrap`
- Deploy the app using CDK: `cdk deploy`

#### Destroying the Application

- To remove all deployed resources: `cdk destroy`

### Extending the Application

- To add a new TypeScript library (e.g., shared configurations, utility functions): `nx generate @nrwl/ts:lib library-name`

- To add a new Node.js application (e.g., another Lambda function): `nx generate @nrwl/node:application app-name`
