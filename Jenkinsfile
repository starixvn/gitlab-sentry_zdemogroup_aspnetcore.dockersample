node {
	properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')), disableConcurrentBuilds(), gitLabConnection('')])
	
	stage("SCM Checkout"){
		checkout scm
	}

	def regUser = "larrytran"
	def imageName = "larrytran/aspnetapp:${env.BUILD_ID}"
	def image
	def imageId
	def container
	
	stage("Build App Image"){
		image = docker.build(imageName)
		imageId = image.id
	}
	
	stage("Run App Container &  Automation Test"){
		image.withRun("-p 4000:80"){
			stage("Run Automation Test"){
				sh "mkdir -p testReports/firefox"

				docker.image("larrytran/robotfw-firefox:3.1.1").inside('-u root -e "BROWSER=firefox"'){				
					sh "xvfb-run --server-args='-screen 0 1920x1080x24 -ac' robot --outputDir testReports/firefox tests/robot/simpletest.robot"
				}

				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'testReports/firefox', reportFiles: 'report.html', reportName: 'Selenium Report', reportTitles: ''])
			}
		}
	}

	stage("Push App Image To Registry"){
		docker.withRegistry("", regUser){		
			image.push()
		}
	}

	stage("Deploy"){
		sh "docker image rm ${imageId} -f"

		docker.withRegistry("", regUser){
			docker.image(imageId).withRun("-p 4000:80"){
				sleep 3

				sh "curl -I http://192.168.56.111:4000/Home/About"
			}
		}
	}
}