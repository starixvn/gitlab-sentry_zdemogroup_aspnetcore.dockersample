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
          pipelineLib.beginSonarQubeForMsBuild("AspNetCoreSample", "Larry / AspNetCoreSample", "/d:sonar.cs.opencover.reportsPaths=%WORKSPACE%\\CoverageReports\\*.xml /d:sonar.cs.vstest.reportsPaths=%WORKSPACE%\\TestResults\\*.trx")

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
              pipelineLib.xUnitForNetCore()
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

    stage("SonarQube Analysis"){
      steps{
        script{
          pipelineLib.endSonarQubeForMsBuild()
        }
      }
    }

    stage("Deploy To Local"){
      steps{       
        script{
          pipelineLib.deployByRocketor("11202","%GIT_BRANCH%","%GIT_COMMIT%","","1ced7d6b84824e49860e27ceb7f6efef")
        }
      }     
    }

    stage("Run Automation Test"){
      parallel{
        stage("Smock Test"){
          steps{
            bat label: "Prepare folder", script: "IF NOT EXIST \"%WORKSPACE%\\SeleniumReport\" mkdir SeleniumReport"
            bat label: "RobotFramework", script: "robot --outputDir SeleniumReport tests/robot/simpletest.robot"
          }
          post{
            always{
              publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'SeleniumReport', reportFiles: 'report.html', reportName: 'Selenium Report', reportTitles: ''])		
            }
          }
        }

        stage("Integration Test"){
          steps{
            echo "Run Integration Test"   
            sleep 2        
          }
        }

        stage("Functional Test"){
          steps{
            echo "Run Functional Test"           
            sleep 2
          }
        }

        stage("Acceptance Test"){
          steps{
            echo "Generate Acceptance Test"           
            sleep 2
          }
        }

        stage("Performance Test"){
          steps{
            echo "Run Performance Test"           
            sleep 2
          }
        }
      }      
    }

    stage("Deploy to Staging"){
      steps{
        echo "Deploy to Staging"
        sleep 3
      }
    }

    stage("Re-Run Automation Test"){
      steps{
        echo "Run Automation Test"
        sleep 3
      }
    }

    stage("Deploy to Production"){
      steps{
        echo "Deploy to Production"
        sleep 3
      }
    }
  }
  post{   
    unsuccessful{
      emailext body: '$DEFAULT_CONTENT', recipientProviders: [developers(), requestor()], subject: '$DEFAULT_SUBJECT', to: 'larry.tran@starixsoft.com'
    }
  }
}