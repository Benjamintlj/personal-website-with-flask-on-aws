import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import {AppStage} from './app-stage'

export class PersonalWebsiteWithFlaskOnAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'PersonalWebsiteWithFlaskOnAwsPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Benjamintlj/personal-website-with-flask-on-aws', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const prod = pipeline.addStage(new AppStage(this, 'prod', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
    }));
  }
}
