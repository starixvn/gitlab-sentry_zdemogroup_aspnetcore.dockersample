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
        //bat label: "Prepare SonarQube", script: "\"${tool 'SonarScanner for MSBuild'}\\MSBuild.SonarQube.Runner.exe\" begin /k:Up /n:\"NexOps / Up\" /v:%BUILD_NUMBER% /d:sonar.cs.opencover.reportsPaths=%WORKSPACE%\\coverage.xml /d:sonar.cs.xunit.reportsPaths=%WORKSPACE%\\UnitTest.xml"
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
  }
}