node {
	stage("SCM Checkout"){
		checkout scm
	}
	
	def registryHost = 'regdocker.nexdev.net'
	def imageName = "aspnetapp:${env.BUILD_ID}"
	def tagName = "${registryHost}/larry/${imageName}"
	def customImage
	
	stage("Build Image"){
		customImage = docker.build(imageName)
	}
	
	stage("Push Image to Registry"){
		docker.withRegistry(registryHost) {
			customImage.tag(tagName)
			
			customImage.push(tagName)
		}
	}
}