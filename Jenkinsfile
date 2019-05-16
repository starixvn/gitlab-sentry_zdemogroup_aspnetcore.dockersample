node {
	properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')), disableConcurrentBuilds(), gitLabConnection(''), pipelineTriggers([pollSCM('H/15 * * * *')])])
	
	stage("SCM Checkout"){
		checkout scm
	}	
	
	stage("Run test"){
		docker.image("larrytran/robbotframework:3.1.1").inside(){
			sh "xvfb-run --server-args='-screen 0 1920x1080x24 -ac' robot tests/robot/simpletest.robot"
		}
	}
}