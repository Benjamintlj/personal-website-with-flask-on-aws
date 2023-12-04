import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a new VPC
        const vpc = new ec2.Vpc(this, 'PersonalWebsiteVpc', {
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'public',
                    subnetType: ec2.SubnetType.PUBLIC,
                }
            ],
        });

        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'PersonalWebsiteCluster', {
            vpc: vpc
        });

        // Get an existing ECR repository
        const repository = ecr.Repository.fromRepositoryName(this, 'MyRepository', 'my-personal-website-repo');

        // Create a load-balanced Fargate service and make it public
        const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "PersonalWebsiteFargateService", {
            cluster: cluster, // Required
            desiredCount: 1,
            taskImageOptions: {
                image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
                containerPort: 80,
            },
        });

        const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 1 });

        // Retrieve the existing hosted zone
        const hostedZone = route53.HostedZone.fromLookup(this, 'PersonalWebsiteHostedZone', {
            domainName: 'benlewisjones.com',
        });

        // Create Records
        new route53.ARecord(this, 'AliasRecord', {
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new route53_targets.LoadBalancerTarget(fargateService.loadBalancer)),
        });

        new route53.CnameRecord(this, 'WwwRecord', {
            zone: hostedZone,
            domainName: fargateService.loadBalancer.loadBalancerDnsName,
            recordName: 'www',
        });
    }
}
