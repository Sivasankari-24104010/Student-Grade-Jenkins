pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                bat 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'Student Grade Calculator Build Successful!'
        }

        failure {
            echo 'Student Grade Calculator Build Failed!'
        }
    }
}