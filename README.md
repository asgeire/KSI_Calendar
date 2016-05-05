KSI_Calendar
===========

Forrit sem að sækir alla leiki sumarsins til KSÍ og býr til Google calendar events.


Description
===========

Byrjað er á því að sækja alla leiki sumarsins í SOAP vefþjónustu KSÍ.
Leikir eru filteraðir miðað við lið notanda og eingöngu leikir fram í tímann eru notaðir. Bæði heima og útileikir eru notaðir.
Loks er insert fallið í Google Calendar API notað til að búa til calendar events.

Installation
============

Keyra "npm install".

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