*** Settings ***
Library			SeleniumLibrary

*** Variables ***
${BROWSER}		%{BROWSER}

*** Test Cases ***
Visit Home
	Open Browser			http://192.168.56.111:4000/		${BROWSER}
	Capture Page Screenshot

Visit About
	Open Browser			http://192.168.56.111:4000/Home/About		${BROWSER}
	Capture Page Screenshot

Visit Contact
	Open Browser			http://192.168.56.111:4000/Home/Contact		${BROWSER}
	Capture Page Screenshot