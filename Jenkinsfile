pipeline {
  agent any
  environment {
    AWS_REGION = 'us-east-2'
    ECR_REPO = '775253283993.dkr.ecr.us-east-2.amazonaws.com/helloearth/helloearth.io/notdeviantart'
    IMAGE_TAG = 'latest'
    AWS_ACCESS_KEY_ID = credentials('JENKINS_ACCESS_KEY')
    AWS_SECRET_ACCESS_KEY = credentials('JENKINS_SECRET_ACCESS_KEY')
    APP_NAME = 'helloearth-io-notdeviantart'
    GIT_URL = 'git@github.com:somauser/devart-application.git'
    PORT = 7098
  }
  triggers {
    githubPush()
  }
  stages {
    stage('Git Checkout') {
      steps {
        git(
          credentialsId: 'git',
          branch: 'main',
          url: "${env.GIT_URL}"
        )
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t ${ECR_REPO}:${IMAGE_TAG} ."
        }
      }
    }

    stage('Push to ECR') {
      steps {
        script {
          def timestamp = new Date().format("yyyyMMddHHmmss")
          sh """
            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin ${ECR_REPO}
            docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_REPO}:${timestamp}
            docker push ${ECR_REPO}:${IMAGE_TAG}
            docker push ${ECR_REPO}:${timestamp}
          """
        }
      }
    }

stage('Deploy to EC2') {
  steps {
    withCredentials([sshUserPrivateKey(credentialsId: 'ec2-private-key', keyFileVariable: 'KEYFILE', usernameVariable: 'SSH_USER')]) {
      script {
        sh """
          ssh -i $KEYFILE -o StrictHostKeyChecking=no $SSH_USER@18.218.254.126 '
            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin ${ECR_REPO} &&
            docker pull ${ECR_REPO}:${IMAGE_TAG} &&
            docker stop "${APP_NAME}" || true &&
            docker rm "${APP_NAME}" || true &&
            docker run --env-file ~/env/notdeviantart/.env -d --name helloearth-io-notdeviantart -p 7098:7098 775253283993.dkr.ecr.us-east-2.amazonaws.com/helloearth/helloearth.io/notdeviantart pm2-runtime server.js
          '
        """
      }
    }
  }
}
// docker run -d --env ~/env/notdeviantart/.env --name "${APP_NAME}" -p ${PORT}:${PORT} ${ECR_REPO}:${IMAGE_TAG} pm2-runtime server.js
stage('Cleanup Old Docker Images') {
  steps {
    withCredentials([sshUserPrivateKey(credentialsId: 'ec2-private-key', keyFileVariable: 'KEYFILE', usernameVariable: 'SSH_USER')]) {
      script {
        sh """
          ssh -i $KEYFILE -o StrictHostKeyChecking=no $SSH_USER@18.218.254.126 '
            docker image prune -a -f --filter "until=24h"
            docker system prune -af
            docker volume prune -f
          '
        """
      }
    }
  }
}
  }
}