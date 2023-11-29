import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { AppStage } from './app-stage';
import { Role, ServicePrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class PersonalWebsiteWithFlaskOnAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a custom IAM role for the pipeline
    const pipelineRole = new Role(this, 'PipelineRole', {
      assumedBy: new ServicePrincipal('codepipeline.amazonaws.com')
    });

    // Create the pipeline with the custom role
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'PersonalWebsiteWithFlaskOnAwsPipeline',
      role: pipelineRole,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Benjamintlj/personal-website-with-flask-on-aws', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    // Add stages to the pipeline
    pipeline.addStage(new AppStage(this, 'prod', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
    }));
  }
}
