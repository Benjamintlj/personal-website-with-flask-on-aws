# Personal Website with Flask on AWS
## Introduction

## How to release
1. Push to main branch
2. The aws codePipeline will automatically deploy the code 
3. The asset stage will fail because there are two assets and only one is allowed to run at a time, to fix this press 
`run failed jobs`. This does tend to be temperamental so it may take a few tries to work. 
