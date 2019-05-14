node {
	properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')), disableConcurrentBuilds(), gitLabConnection(''), pipelineTriggers([pollSCM('H/15 * * * *')])])
	
	stage("SCM Checkout"){
		checkout scm
	}
	
	def registryHost = "http://regdocker.nexdev.net"
	def regUser = "shipper"
	def imageName = "larry/aspnetapp:${env.BUILD_ID}"
	def image
	def container
	
	stage("Build Image"){
		image = docker.build(imageName)
	}
	
	stage("Push Image to Registry"){
		docker.withRegistry(registryHost, regUser){
			image.push()
		}
	}

	stage("Pull & Run App Container"){
		docker.withRegistry(registryHost, regUser){
			container =	docker.image(imageName).run("-p 4000:80")
		}

		input message: 'Would you like to stop app and dispose container?', ok: 'Confirm', parameters: [booleanParam(defaultValue: true, description: '', name: 'StopApp')], submitter: 'admin'

		if(StopApp){
			container.stop()
		}
	}
}