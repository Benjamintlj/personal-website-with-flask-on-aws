import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a new VPC
        const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });

        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

        // Specify the path to your Dockerfile
        const dockerfileDirectory = 'src/ECS/';

        // Create a Fargate service with an application load balancer
        new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(dockerfileDirectory),
            },
            publicLoadBalancer: true,
        });
    }
}

