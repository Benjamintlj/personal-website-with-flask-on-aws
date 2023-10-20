#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PersonalWebsiteWithFlaskOnAwsStack } from '../lib/personal-website-with-flask-on-aws-stack';

const app = new cdk.App();
new PersonalWebsiteWithFlaskOnAwsStack(app, 'PersonalWebsiteWithFlaskOnAwsStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    },
});

app.synth();