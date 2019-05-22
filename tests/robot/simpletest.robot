*** Settings ***
Library			Selenium2Library

*** Variables ***
${BROWSER}		Firefox

*** Test Cases ***
Visit Home
	Open Browser			http://10.18.200.213:8089/		${BROWSER}
	Capture Page Screenshot
	[Teardown]    Close Browser

Visit About
	Open Browser			http://10.18.200.213:8089/Home/About		${BROWSER}
	Capture Page Screenshot
	[Teardown]    Close Browser

Visit Contact
	Open Browser			http://10.18.200.213:8089/Home/Contact		${BROWSER}
	Capture Page Screenshot
	[Teardown]    Close Browser