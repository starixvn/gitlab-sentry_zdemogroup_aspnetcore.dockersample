*** Settings ***
Library			SeleniumLibrary
Library  String
Library  RequestsLibrary

*** Variables ***
${BROWSER}		%{BROWSER}

*** Test Cases ***
Visit Home
	Open Browser			http://192.168.56.111:4000/		${BROWSER}
	Capture Page Screenshot
	[Teardown]    Close Browser

Visit About
	Open Browser			http://192.168.56.111:4000/Home/About		${BROWSER}
	Capture Page Screenshot
	[Teardown]    Close Browser

Visit Contact
	Open Browser			http://192.168.56.111:4000/Home/Contact		${BROWSER}
	Capture Page Screenshot
	[Teardown]    Close Browser
	
Fail Test
    Create Session  contact  http://192.168.56.111:4000/Home/Contact
    ${resp}=  Get Request  contact  /
    Should Be Equal As Strings  ${resp.status_code}  404