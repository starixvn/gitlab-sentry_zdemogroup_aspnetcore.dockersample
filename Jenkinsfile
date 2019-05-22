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
        bat label: "Prepare SonarQube", script: "\"${tool 'SonarScanner for MSBuild'}\\MSBuild.SonarQube.Runner.exe\" begin /k:AspNetCoreSample /n:\"Larry / AspNetCoreSample\" /v:%BUILD_NUMBER% /d:sonar.cs.opencover.reportsPaths=%WORKSPACE%\\CoverageReports\\*.xml /d:sonar.cs.vstest.reportsPaths=%WORKSPACE%\\TestResults\\*.trx"
        bat label: 'Restore nuget', script: "%JENKINS_HOME%\\tools\\commands\\nuget-restore.bat"
        bat label: "MsBuild", script: "MsBuild AspNetCoreSample.sln /t:Rebuild /p:DebugType=Full /nologo /v:minimal /l:XmlFileLogger,\"%JENKINS_HOME%\\tools\\MSBuild.ExtensionPack.Loggers.dll\";logfile=MsBuild.xml;encoding=UTF-8"        
      }    
    }

    stage("Test"){
      parallel{
        stage("C# Test"){
          steps{
            bat label: "Generate C# Coverage", script: "powershell -file \"%JENKINS_HOME%\\tools\\Commands\\NetCoreCoverage.ps1\" \"%WORKSPACE%\""
          }
        }

		    stage("TypeScript Test"){
          steps{
            echo "Generate TS Coverage"           
          }
        }

        stage("TSQL Test"){
          steps{
            echo "Deploy database project"
            echo "Deploy database test project"
            echo "Generate TSQL Coverage"
          }
        }
      }      
    }

    stage("SonarQube Analysis"){
      steps{
        bat label: "Run analysis", script: "\"${tool 'SonarScanner for MSBuild'}\\MSBuild.SonarQube.Runner.exe\" end"
      }     
    }

    stage("Deploy To Local"){
      steps{
        bat label: "Rocketor Publish", script: "\"%JENKINS_HOME%\\tools\\RocketorPublish\\Fanex.Rocketor.Publish.exe\" --locationids=11202 --branchname=\"%GIT_BRANCH%\" --commithash=%GIT_COMMIT% --workspace=\"%WORKSPACE%\" --token=1ced7d6b84824e49860e27ceb7f6efef"
      }     
    }
  }

  post{
    always{
      archiveArtifacts "*.xml"
    }
    unsuccessful{
      emailext body: '$DEFAULT_CONTENT', recipientProviders: [developers(), requestor()], subject: '$DEFAULT_SUBJECT', to: 'larry.tran@starixsoft.com'
    }
  }
}