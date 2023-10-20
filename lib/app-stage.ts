import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {StorageStack} from "./storage-stack"

export class AppStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const storageStack = new StorageStack(this, 'storageStack');
    }
}