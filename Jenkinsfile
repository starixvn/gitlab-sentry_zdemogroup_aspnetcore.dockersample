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
	
	stage("Run App Container & Test"){
		image.withRun("-p 4000:80"){
			stage("Automation Test With Firefox"){
				sh "mkdir -p testReports/firefox"

				docker.image("larrytran/robbotfw:3.1.1").inside('-u root -e "BROWSER=firefox"'){				
					sh "xvfb-run --server-args='-screen 0 1920x1080x24 -ac' robot --outputDir testReports/firefox tests/robot/simpletest.robot"
				}
			}
		}
	}

	stage("Push Image To Registry"){
		docker.withRegistry("", regUser){		
			image.push()
		}
	}
}