node {
	properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')), disableConcurrentBuilds(), gitLabConnection(''), pipelineTriggers([pollSCM('H/15 * * * *')])])
	
	stage("SCM Checkout"){
		checkout scm
	}
	
	def imageName = "larry/aspnetapp:${env.BUILD_ID}"
	def image
	
	stage("Build Image"){
		image = docker.build(imageName)
	}
	
	stage("Push Image to Registry"){
		docker.withRegistry("http://regdocker.nexdev.net","shipper"){
			image.push()
		}
	}
}