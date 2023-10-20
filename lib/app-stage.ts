import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {EcsStack} from "./ecs-stack";

export class AppStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // const storageStack = new StorageStack(this, 'storageStack');
        const ecsStack = new EcsStack(this, 'ecsStack');
    }
}