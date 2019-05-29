@Library("JenkinsPipelineLibrary") _

pipeline {
  agent {
    label "master"
  }

  options{
    buildDiscarder(logRotator(numToKeepStr: '5'))    
    disableConcurrentBuilds()
  }

  stages {
    stage('Build') {
      steps {        
        script{
          pipelineLib.beginSonarQubeForMsBuild("AspNetCoreSample","Larry / AspNetCoreSample","/d:sonar.cs.opencover.reportsPaths=%WORKSPACE%\\CoverageReports\\*.xml /d:sonar.cs.vstest.reportsPaths=%WORKSPACE%\\TestResults\\*.trx")

          pipelineLib.restoreNuget()

          pipelineLib.msBuild("AspNetCoreSample.sln")
        }
      }
    }
    
    stage("Unit Test"){
      parallel{
        stage("TypeScript Test"){
          steps{
            echo "Generate TS Coverage"
            sleep 2
          }
        }

        stage("TSQL Test"){
          steps{
            echo "Deploy database project"
            echo "Deploy database test project"
            echo "Generate TSQL Coverage"
            sleep 2
          }
        }

        stage("C# Test"){
          steps{
            script{
              pipelineLib.generateCoverageForNetCore()
            }
          }
          post{
            always{
              mstest failOnError: false, testResultsFile: 'TestResults/*.trx'
            }
          }
        }
      }
    }
  }
}