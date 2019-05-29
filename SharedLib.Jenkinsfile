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
        //bat label: "Prepare SonarQube", script: "\"${tool 'SonarScanner for MSBuild'}\\MSBuild.SonarQube.Runner.exe\" begin /k:AspNetCoreSample /n:\"Larry / AspNetCoreSample\" /v:%BUILD_NUMBER% /d:sonar.cs.opencover.reportsPaths=%WORKSPACE%\\CoverageReports\\*.xml /d:sonar.cs.vstest.reportsPaths=%WORKSPACE%\\TestResults\\*.trx"
        script{
          pipelineLib.restoreNuget()
        }
        //bat label: "MsBuild", script: "MsBuild AspNetCoreSample.sln /t:Rebuild /p:DebugType=Full /nologo /v:minimal /l:XmlFileLogger,\"%JENKINS_HOME%\\tools\\MSBuild.ExtensionPack.Loggers.dll\";logfile=MsBuild.xml;encoding=UTF-8"        
      }    
    }   
    
  }
}