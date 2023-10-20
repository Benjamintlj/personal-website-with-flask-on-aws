import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import {aws_s3} from "aws-cdk-lib";

export class StorageStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new aws_s3.Bucket(this, 'MyFirstBucket2', {
            versioned: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
    }
}