pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
        nvm('8.16.1') {
          sh 'yarn install'
          sh 'yarn deploy'
        }
      }
    }
  }
}
