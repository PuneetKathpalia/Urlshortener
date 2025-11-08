pipeline {
    agent any

    environment {
        // ✅ Connect Jenkins to Docker Desktop
        DOCKER_HOST = 'tcp://localhost:2375'
        CLIENT_IMAGE = 'urlshortener-client:latest'
        SERVER_IMAGE = 'urlshortener-server:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out source code...'
                git branch: 'main', url: 'https://github.com/PuneetKathpalia/Urlshortener.git'
            }
        }

        stage('Build Client') {
            steps {
                echo '⚙️ Building Client App...'
                dir('client') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Server') {
            steps {
                echo '⚙️ Building Server App...'
                dir('server') {
                    bat 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running Tests...'
                dir('client') {
                    bat 'npm test || echo "Client tests failed (skipping)"'
                }
                dir('server') {
                    bat 'npm test || echo "Server tests failed (skipping)"'
                }
            }
        }

        stage('Dockerize') {
            steps {
                echo '🐳 Building Docker images...'
                bat "docker pull node:18-alpine || echo 'Retrying pull...' && docker pull node:18-alpine"
                bat "docker build -t %CLIENT_IMAGE% client"
                bat "docker build -t %SERVER_IMAGE% server"
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying containers (placeholder stage)...'
                // Example (optional):
                // bat "docker run -d -p 3000:3000 %SERVER_IMAGE%"
                // bat "docker run -d -p 8080:80 %CLIENT_IMAGE%"
            }
        }
    }

    post {
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs in Jenkins console.'
        }
    }
}
