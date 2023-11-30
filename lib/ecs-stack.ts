import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'; // Import ELBv2 for Application Load Balancer

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'PersonalWebsiteVpc', {
            maxAzs: 2,
        });

        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'personalWebsiteCluster', {
            vpc
        });

        // Add capacity to it
        cluster.addCapacity('personalWebsiteAutoScalingGroupCapacity', {
            instanceType: new ec2.InstanceType("t2.small"),
            desiredCapacity: 1,
            minCapacity: 1,
            maxCapacity: 2,
        });

        const repository = ecr.Repository.fromRepositoryName(this, 'MyRepository', 'my-personal-website-repo');

        // Create a task definition and expose port 80
        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'personalWebsiteTaskDef');

        const container = taskDefinition.addContainer('personalWebsiteContainer', {
            image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
            memoryLimitMiB: 512,
        });

        container.addPortMappings({
            containerPort: 80,
            hostPort: 80,
            protocol: ecs.Protocol.TCP
        });

        // Instantiate an Amazon ECS Service
        const ECSService = new ecs.Ec2Service(this, 'personalWebsiteService', { cluster, taskDefinition });

        // Add a load balancer and expose the service on port 80
        const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'personalWebsiteLoadBalancer', {
            vpc,
            internetFacing: true
        });
        const listener = loadBalancer.addListener('Listener', {port: 80});
        const TargetGroup = listener.addTargets('personalWebsiteECSServiceTargetGroup', {
            port: 80,
            targets: [ECSService.loadBalancerTarget({
                containerName: 'personalWebsiteContainer',
                containerPort: 80
            })]
        });
    }
}
