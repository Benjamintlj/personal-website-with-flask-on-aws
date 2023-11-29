# ECS running flask

## How to run the project locally
```bash
docker build -t personal-website-with-flask-on-aws-flask-ecs-image . 
docker run -p 4000:80 personal-website-with-flask-on-aws-flask-ecs-image
```
Open your browser and go to http://localhost:4000.
If running on an ECS you will still use port 4000 but the url will be different.

## How to release (carrying on from the main README.md)
```bash
docker build -t my-personal-website .
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 203163753194.dkr.ecr.eu-west-1.amazonaws.com
docker tag my-personal-website:latest 203163753194.dkr.ecr.eu-west-1.amazonaws.com/my-personal-website-repo:latest
docker push 203163753194.dkr.ecr.eu-west-1.amazonaws.com/my-personal-website-repo:latest
```