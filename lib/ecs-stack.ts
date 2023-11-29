import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a new VPC with a specific CIDR block
        const vpc = new ec2.Vpc(this, 'PersonalWebsiteVpc', {
            maxAzs: 2,
        });

        const cluster = new ecs.Cluster(this, 'PersonalWebsiteCluster', {
            vpc: vpc
        });


        // Create a load-balanced Fargate service and make it public
        new ecs_patterns.ApplicationLoadBalancedFargateService(this, "PersonalWebsiteFargateService", {
            cluster: cluster, // Required
            cpu: 256, // Default is 256
            desiredCount: 1,
            taskImageOptions: { image: ecs.ContainerImage.fromAsset('./src/ecs') }, // Set the image to be the docker file in 'src/ecs'
            memoryLimitMiB: 256,
        });
    }
}
