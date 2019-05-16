node {
	properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')), disableConcurrentBuilds(), gitLabConnection(''), pipelineTriggers([pollSCM('H/15 * * * *')])])
	
	stage("SCM Checkout"){
		checkout scm
	}

	def regUser = "larrytran"
	def imageName = "larrytran/aspnetapp:${env.BUILD_ID}"
	def image	
	
	stage("Build Image"){
		image = docker.build(imageName)
	}
	
	stage("Run test"){
		image.withRun("-p 4000:80"){
			docker.image("larrytran/robbotframework:3.1.1").inside('-u root -e "BROWSER=firefox"'){
				sh "mkdir -p testReport/firefox"
				sh "xvfb-run --server-args='-screen 0 1920x1080x24 -ac' robot --outputDir testReport/firefox tests/robot/simpletest.robot"
			}
		}
	}

	stage("Push Image to Registry"){
		docker.withRegistry("", regUser){		
			image.push()
		}
	}
}