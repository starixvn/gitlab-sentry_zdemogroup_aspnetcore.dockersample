node {
    checkout scm
	
    def customImage = docker.build("aspnetapp:${env.BUILD_ID}")    
}