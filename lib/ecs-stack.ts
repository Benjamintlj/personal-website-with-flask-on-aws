import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a new VPC with a specific CIDR block
        const vpc = new ec2.Vpc(this, 'MyVpc', {
            maxAzs: 2,
        });

        // Create an ecs cluster
        const cluster = new ecs.Cluster(this, 'Ec2Cluster', { vpc });

        // Add capacity to the cluster
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
        });

        // Specify the path to your Dockerfile
        const dockerfileDirectory = 'src/ecs/';

        // Create a task definition with a single container
        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
        const webContainer = taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromAsset(dockerfileDirectory),
            memoryLimitMiB: 512,
        });

        webContainer.addPortMappings({
            containerPort: 80,
        });

        // Create an EC2 service with a network load balancer
        const ec2Service = new ecs_patterns.NetworkLoadBalancedEc2Service(this, 'MyEc2Service', {
            cluster,
            taskDefinition,
            publicLoadBalancer: true,
        });

        // Output the DNS name of the load balancer
        new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: ec2Service.loadBalancer.loadBalancerDnsName });
    }
}
