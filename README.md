KSI_Calendar
===========

Forrit sem að sækir alla leiki sumarsins til KSÍ og býr til Google calendar events.


Description
===========

Byrjað er á því að sækja alla leiki sumarsins í SOAP vefþjónustu KSÍ.
Leikir eru filteraðir miðað við lið notanda og eingöngu leikir fram í tímann eru notaðir. Bæði heima og útileikir eru notaðir.
Loks er insert fallið í Google Calendar API notað til að búa til calendar events.

Google Calendar API Info:
	https://developers.google.com/google-apps/calendar/quickstart/nodejs
	https://developers.google.com/google-apps/calendar/create-events#add_an_event

Installation
============

Step 1: Turn on the Google Calendar API
	a.	Use <a href="https://console.developers.google.com/start/api?id=calendar">this wizard</a> to create or select a project in the Google Developers Console and automatically turn on the API. Click Continue, then Go to credentials.
	b.	At the top of the page, select the OAuth consent screen tab. Select an Email address, enter a Product name if not already set, and click the Save button.
	c.	Select the Credentials tab, click the Create credentials button and select OAuth client ID.
	d.	Select the application type Other, enter the name "Google Calendar API Quickstart", and click the Create button.
	e.	Click OK to dismiss the resulting dialog.
	f.	Click the file_download (Download JSON) button to the right of the client ID.
	g.	Move this file to your working directory and rename it client_secret.json.

Step 2: Install dependencies
	npm install

Usage
=====

Það þarf að stilla myTeam breytuna fyrir liðið sem þú vilt fá events fyrir.

	var myTeam = "Stjarnan";


Breytan motNumer er harðkóðað á ID fyrir Pepsi deild karla 2016. 

	var motNumer = "35586";

Hægt er að breyta þessu ID og fá þannig aðrar deildir, bæði karla og kvenna. ID er hægt að finna hérna: http://www.ksi.is/mot/motalisti/

Í fyrsta skipti sem að forritið er keyrt þarf að auðkenna sig hjá Google. Það er gert með því að opna slóð sem að birtist í console og setja svo inn token.
Token er vistaður á disk þannig að það þarf ekki að endurtaka þetta skref.

TODO
=====
Bæta við virkni til að uppfæra events. 
Ég nota ID fyrir leikina frá KSÍ og set inn sem calendar eventId. 
Því ætti að vera hægt að gera UPSERT virkni og keyra forritið aftur seinna í sumar ef leikir riðlast.