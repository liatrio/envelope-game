pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        label "lead-toolchain-skaffold"
      }
      steps {
        container('skaffold') {
          sh "skaffold build --file-output=image.json"
          stash includes: 'image.json', name: 'build'
          sh "rm image.json"
        }
      }
    }

    stage("Deploy to Staging") {
      agent {
        label "lead-toolchain-skaffold"
      }
      when {
          branch 'master'
      }
      environment {
        NAMESPACE = "${env.stagingNamespace}"
        INGRESS_HOST = "envelope-game.${env.stagingDomain}"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "helm repo add bitnami https://charts.bitnami.com/bitnami"
          sh "skaffold deploy -a image.json -n ${NAMESPACE}"
        }
        stageMessage "Successfully deployed to staging:\n${INGRESS_HOST}"
      }
    }

    stage ('Manual Ready Check') {
      agent none
      when {
        branch 'master'
      }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        input message: 'Deploy to Production? (Click "Proceed" to continue)'
      }
    }

    stage("Deploy to Production") {
      agent {
        label "lead-toolchain-skaffold"
      }
      when {
          branch 'master'
      }
      environment {
        NAMESPACE = "${env.productionNamespace}"
        INGRESS_HOST = "envelopegame.com"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "helm repo add bitnami https://charts.bitnami.com/bitnami"
          sh "skaffold deploy -a image.json -n ${NAMESPACE} -p prod"
        }
        stageMessage "Successfully deployed to production:\n${env.INGRESS_HOST}/"
      }
    }
  }
}
