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
          bat 'npm install'
          bat 'npm run build'
        }
        dir('server') {
          bat 'npm install'
        }
      }
    }

    stage('Test') {
      steps {
        dir('client') {
          bat 'npm test'
        }
        dir('server') {
          bat 'npm test'
        }
      }
    }

    stage('Dockerize') {
      steps {
        bat 'docker build -t ${CLIENT_IMAGE} client'
        bat 'docker build -t ${SERVER_IMAGE} server'
      }
    }

    stage('Deploy') {
      steps {
        bat 'docker compose pull || true'
        bat 'docker compose up -d --build'
      }
    }
  }
}
