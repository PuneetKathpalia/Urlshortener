pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = ''
    CLIENT_IMAGE = 'urlshortener-client:latest'
    SERVER_IMAGE = 'urlshortener-server:latest'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

stage('Build') {
      steps {
        dir('client') {
          sh 'npm install'
          sh 'npm run build'
        }
        dir('server') {
          sh 'npm install'
        }
      }
    }

    stage('Test') {
      steps {
        dir('client') {
          sh 'npm test'
        }
        dir('server') {
          sh 'npm test'
        }
      }
    }

    stage('Dockerize') {
      steps {
        sh 'docker build -t ${CLIENT_IMAGE} client'
        sh 'docker build -t ${SERVER_IMAGE} server'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker compose pull || true'
        sh 'docker compose up -d --build'
      }
    }
  }
}
