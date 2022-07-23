//"use strict";

addEvent("OnEnteredTurretMode", 2); // ped, car

// ----------------------------------------------------------------------------
addEventHandler("OnPlayerJoined", function(event, client) {
	//client.setData("BobcatTurret", getRandomColour(), true);
	/*
	let clients = getClients();
	clients[0].player.setData("testvar", 123, true);
	
	updatePlayerCarTurretData();
	
	triggerEvent("OnEnterTurretMode", 6969);*/
	//client.player.money = 999999;
});

// ----------------------------------------------------------------------------
function updatePlayerCarTurretData() {
	
	let clients = getClients();
	for(let i in clients) {
		
		
		/*var car = clients[i].player.getData("BobcatTurret");
		if(car == null){
			message("null car");
		}else{
			message("car x = " + car.position.x);
		}*/
		
		var testvar = clients[i].player.getData("testvar");
		if(testvar == null){
			message("null var");
		}else{
			message("var = " + testvar);
		}
	}
}

// ----------------------------------------------------------------------------

addNetworkHandler("OnEnteredTurretMode", function (client, pedId, vehId) {
	if(vehId == null){
		triggerEvent("OnEnteredTurretMode", getElementFromId(pedId), getElementFromId(pedId), null);
		return;
	}
	triggerEvent("OnEnteredTurretMode", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehId));
	//message("called this event yo!");
});

addEventHandler("OnEnteredTurretMode", function(event, ped, veh) {
	
	if(ped == null) return;
	
	if(veh == null){
		ped.setData("BobcatTurret", null);
		return;
	}
	
	//message("Ped in turret mode " + ped.health);
	ped.setData("BobcatTurret", veh);
});










