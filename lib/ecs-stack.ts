import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ecr from "aws-cdk-lib/aws-ecr";

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
            desiredCapacity: 3,
            maxCapacity: 6,
        });

        const repository = ecr.Repository.fromRepositoryName(this, 'MyRepository', 'my-personal-website-repo');

        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'personalWebsiteTaskDef');

        taskDefinition.addContainer('personalWebsiteContainer', {
            image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
            memoryLimitMiB: 512,
        });

        // Instantiate an Amazon ECS Service
        const ecsService = new ecs.Ec2Service(this, 'Service', {
            cluster,
            taskDefinition,
        });
    }
}
