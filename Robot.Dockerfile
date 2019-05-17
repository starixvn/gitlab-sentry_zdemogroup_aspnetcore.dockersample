FROM ubuntu:bionic-20190424

USER root

RUN apt-get update && apt-get install firefox -y

RUN apt install python-pip -y

RUN pip install robotframework \
	robotframework-faker robotframework-pabot \
	robotframework-requests robotframework-seleniumlibrary \
	webdrivermanager

RUN webdrivermanager firefox --linkpath /usr/local/bin