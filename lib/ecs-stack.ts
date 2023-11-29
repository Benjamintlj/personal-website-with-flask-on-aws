import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ecr from "aws-cdk-lib/aws-ecr";

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a new VPC
        const vpc = new ec2.Vpc(this, 'PersonalWebsiteVpc', {
            maxAzs: 2,
        });

        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'PersonalWebsiteCluster', {
            vpc: vpc
        });

        // Define an Auto Scaling group with t4g.nano instances
        const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.NANO), // Corrected to T4G.NANO
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM),
            minCapacity: 1,
            maxCapacity: 2
        });

        // Create an ECS Capacity Provider using the Auto Scaling group
        const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
            autoScalingGroup: autoScalingGroup,
        });

        cluster.addAsgCapacityProvider(capacityProvider);

        // Get an existing ECR repository
        const repository = ecr.Repository.fromRepositoryName(this, 'MyRepository', 'my-personal-website-repo');

        // Create an ECS Task Definition
        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');

        // Add a container to the Task Definition
        const container = taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
            memoryLimitMiB: 512,
            cpu: 512,
        });

        // Map port 80 of the container to port 80 on the host
        container.addPortMappings({
            containerPort: 80,
            hostPort: 80
        });

        // Create an ECS Service using the EC2 launch type
        new ecs.Ec2Service(this, 'EC2Service', {
            cluster,
            taskDefinition,
        });
    }
}
