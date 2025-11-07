pipeline {
    agent any

    environment {
        CLIENT_IMAGE = 'urlshortener-client:latest'
        SERVER_IMAGE = 'urlshortener-server:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/PuneetKathpalia/Urlshortener.git'
            }
        }

        stage('Build Client') {
            steps {
                dir('client') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Server') {
            steps {
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
                bat "docker build -t %CLIENT_IMAGE% client"
                bat "docker build -t %SERVER_IMAGE% server"
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying containers..."
                // Add deployment steps here
            }
        }
    }
}
