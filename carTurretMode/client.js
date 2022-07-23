//"use strict";

// Turret mode in Bobcat

addEvent("OnEnteredTurretMode", 2); // ped, car

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	bindKey(SDLK_g, KEYSTATE_UP, enterVehicleAsPassenger);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(SDLK_g);
});

// ----------------------------------------------------------------------------

var turretMode = false;
var turretCar;

//static ish
var bobcatOffset = new Vec3(0, -1.5, 0.8); // make it proper static readonly later !
//var rad2deg = 57.2957795; // make it proper static readonly later !

function enterVehicleAsPassenger() {

	//localPlayer.setProofs(false, false, false, true, true); // test line
	
	localPlayer.collisionsEnabled = true; // tmp debug fix
	
	
	if(localPlayer.vehicle == null) {
		let tempVehicle = getClosestVehicle(localPlayer.position);
		if(tempVehicle != null) {
			//localPlayer.enterVehicle(tempVehicle, false);
			//tempVehicle.setWheelStatus(3, 1);
			//tempVehicle.setWheelStatus(1, 1);
			//tempVehicle.handlingIndex = 2; // 2 = Stinger
			//localPlayer.bleeding = !localPlayer.bleeding;
			//localPlayer.collisionsEnabled = !localPlayer.collisionsEnabled;
			//message("car name: " + tempVehicle.name); // tempVehicle.name returns null for some reason
			//message("car model index: " + tempVehicle.modelIndex); //112 for bobcat
			
			
			//message("bobcatOffset = " + bobcatOffset.x + " " + bobcatOffset.y + " " + bobcatOffset.z);
			
			
			if(tempVehicle.modelIndex == 112){
				//message("It is a Bobcat!!!!!!!!!!");
				
				var carPos = tempVehicle.position;
				var carRot = tempVehicle.rotation;
				var playerPos = localPlayer.position;
				
				
				var fwd = new Vec3(0, 0, 0);
				/*fwd.x =  Math.cos(carRot.x) * Math.sin(carRot.z);
				fwd.y = -Math.sin(carRot.x);
				fwd.z =  Math.cos(carRot.x) * Math.cos(carRot.z);*/
				fwd.x =  -Math.cos(carRot.x) * Math.sin(carRot.z);
				fwd.z =  Math.sin(carRot.x);
				fwd.y =  Math.cos(carRot.x) * Math.cos(carRot.z);
				
				//message("car fwd = " + fwd.x + " " + fwd.y + " " + fwd.z);
				/*
				right.x =  cos(yaw);
				right.y =  0;
				right.z = -sin(yaw);
				*/
				var up = new Vec3(0, 0, 0);
				/*up.x = Math.sin(carRot.x) * Math.sin(carRot.z);
				up.y = Math.cos(carRot.x);
				up.z = Math.sin(carRot.x) * Math.cos(carRot.z);
				*/
				up.x = -Math.sin(carRot.x) * Math.sin(carRot.z);
				up.z = Math.cos(carRot.x);
				up.y = Math.sin(carRot.x) * Math.cos(carRot.z);
				
				//message("car fwd = " + fwd.x + " " + fwd.y + " " + fwd.z);
				//message("car rot = " + carRot.x * rad2deg + " " + carRot.y * rad2deg + " " + carRot.z * rad2deg);
				
				
				
				
				var targetPos = new Vec3(0, 0, 0);
				
				fwd.x = fwd.x * bobcatOffset.y;
				fwd.y = fwd.y * bobcatOffset.y;
				fwd.z = fwd.z * bobcatOffset.y;
				
				up.x = up.x * bobcatOffset.z;
				up.y = up.y * bobcatOffset.z;
				up.z = up.z * bobcatOffset.z;
				
				//targetPos = tempVehicle.position + (fwd * bobcatOffset.y) + (up * bobcatOffset.z);
				
				
				
				//targetPos = tempVehicle.position;
				targetPos.x = fwd.x + up.x;
				targetPos.y = fwd.y + up.y;
				targetPos.z = fwd.z + up.z;
				
				
				
				//message("offset = " + targetPos.x + " " + targetPos.y + " " + targetPos.z);
				
				
				targetPos.x = targetPos.x + tempVehicle.position.x;
				targetPos.y = targetPos.y + tempVehicle.position.y;
				targetPos.z = targetPos.z + tempVehicle.position.z;
				
				
				
				var distToTarget = localPlayer.position.distance(targetPos);
				if(distToTarget > 1){
					//player too far
					return;
				}
				
				//localPlayer.collisionsEnabled = false;
				localPlayer.setProofs(false, false, false, true, true);
				localPlayer.position = targetPos;

				message("You entered turret mode");
				localPlayer.duck();
				turretMode = true;
				turretCar = tempVehicle;
				//localPlayer.setData("BobcatTurret", turretCar);
				//triggerEvent("OnEnteredTurretMode", 123, 6969);
				triggerNetworkEvent("OnEnteredTurretMode", localPlayer.id, turretCar.id);
				//message("triggered events from client side");
				//message("got this far");
				//turretCar.collisionPower = turretCar.collisionPower * 2; // like bullion run
				//message("col pow = " + turretCar.collisionPower);
			}
		}
	}
}

// ----------------------------------------------------------------------------
function getTargetPos(veh) {
	
	var carRot = veh.rotation;
	
	var fwd = new Vec3(0, 0, 0);

	fwd.x =  -Math.cos(carRot.x) * Math.sin(carRot.z);
	fwd.z =  Math.sin(carRot.x);
	fwd.y =  Math.cos(carRot.x) * Math.cos(carRot.z);
	
	var up = new Vec3(0, 0, 0);

	up.x = -Math.sin(carRot.x) * Math.sin(carRot.z);
	up.z = Math.cos(carRot.x);
	up.y = Math.sin(carRot.x) * Math.cos(carRot.z);
	
	//message("car fwd = " + fwd.x + " " + fwd.y + " " + fwd.z);
	//message("car rot = " + carRot.x * rad2deg + " " + carRot.y * rad2deg + " " + carRot.z * rad2deg);
	
	
	var targetPos = new Vec3(0, 0, 0);
	
	fwd.x = fwd.x * bobcatOffset.y;
	fwd.y = fwd.y * bobcatOffset.y;
	fwd.z = fwd.z * bobcatOffset.y;
	
	up.x = up.x * bobcatOffset.z;
	up.y = up.y * bobcatOffset.z;
	up.z = up.z * bobcatOffset.z;
	
	targetPos.x = fwd.x + up.x;
	targetPos.y = fwd.y + up.y;
	targetPos.z = fwd.z + up.z;
	
	
	targetPos.x = targetPos.x + veh.position.x;
	targetPos.y = targetPos.y + veh.position.y;
	targetPos.z = targetPos.z + veh.position.z;
	
	
	return targetPos;
}
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

function getClosestVehicle(pos) {
    return getVehicles().reduce((i, j) => (i.position.distance(pos) < j.position.distance(pos)) ? i : j);
}

// ----------------------------------------------------------------------------
// Use this to run script every frame
//addEventHandler("OnEntityProcess", function(event, client) {
//addEventHandler("onCameraProcess", (event,client) => {
addEventHandler("OnBeforeProcessCamera", (event,client) => {
//addEventHandler("onPostRender2D", (event,client) => {
	
	changeOtherPlayersPos();
	
	//localPlayer.setProofs(false, false, false, true, true); // test line
	
	if(localPlayer.health <= 0 && turretMode) {
		/*turretMode = false;
		turretCar = null;
		localPlayer.setProofs(false, false, false, false, false);*/
		ExitTurretMode();
	}
	
	
	/*if(turretCar == null){
		//if(turretMode) ExitTurretMode();
	}else{
		if(turretCar.health <= 0 && turretMode){
			ExitTurretMode();
		}*/
		
	if(turretCar != null && turretMode){
		if(turretCar.health <= 0){
			ExitTurretMode();
		}
	}
	
	
	
	if(!turretMode) {
		triggerNetworkEvent("OnEnteredTurretMode", localPlayer.id, null);
		return;
	}
	
	triggerNetworkEvent("OnEnteredTurretMode", localPlayer.id, turretCar.id);
	
	//let tempVehicle = getClosestVehicle(localPlayer.position);
	
	//message(client.localPlayer.health);
	doStuff();
	
	//var targetPos = getTargetPos(getClosestVehicle(localPlayer.position)); // bad code
	
	//localPlayer.position = targetPos;
	
});

function ExitTurretMode(){
	turretMode = false;
	turretCar = null;
	localPlayer.setProofs(false, false, false, false, false);
}

/*addEventHandler("OnBeforeProcessCamera", (event,client) => {
	changeOtherPlayersPos(); // double trouble
});*/


// ----------------------------------------------------------------------------

function doStuff() {
    //message(localPlayer.health);
    //message("doStuff " + localPlayer.position.x);
   
   
	//var targetPos = getTargetPos();
	//localPlayer.position = targetPos;
	syncGunnerWithCar(localPlayer, turretCar, false); 
	
	if(localPlayer.jumping)
	{
		/*turretMode = false;
		localPlayer.collisionsEnabled = true;
		localPlayer.setProofs(false, false, false, false, false);*/
		ExitTurretMode();
		return;
	}
	
	
	//tossed
	if(turretCar.rotation.x > 0.7853981 
	|| turretCar.rotation.x < -0.7853981
	|| turretCar.rotation.y > 0.7853981 
	|| turretCar.rotation.y < -0.7853981 	
	){
		ExitTurretMode();
		/*turretMode = false;
		localPlayer.collisionsEnabled = true;
		localPlayer.setProofs(false, false, false, false, false);*/
		message("You were tossed out of the car");
		return;
	}
	
}

// ----------------------------------------------------------------------------
// loose = true when doing from other clients
function syncGunnerWithCar(gunner, veh, loose){
	
	/*var carRot = veh.rotation;
	
	var fwd = new Vec3(0, 0, 0);

	fwd.x =  -Math.cos(carRot.x) * Math.sin(carRot.z);
	fwd.z =  Math.sin(carRot.x);
	fwd.y =  Math.cos(carRot.x) * Math.cos(carRot.z);
	
	var up = new Vec3(0, 0, 0);

	up.x = -Math.sin(carRot.x) * Math.sin(carRot.z);
	up.z = Math.cos(carRot.x);
	up.y = Math.sin(carRot.x) * Math.cos(carRot.z);
	
	//message("car fwd = " + fwd.x + " " + fwd.y + " " + fwd.z);
	//message("car rot = " + carRot.x * rad2deg + " " + carRot.y * rad2deg + " " + carRot.z * rad2deg);
	
	
	var targetPos = new Vec3(0, 0, 0);
	
	fwd.x = fwd.x * bobcatOffset.y;
	fwd.y = fwd.y * bobcatOffset.y;
	fwd.z = fwd.z * bobcatOffset.y;
	
	up.x = up.x * bobcatOffset.z;
	up.y = up.y * bobcatOffset.z;
	up.z = up.z * bobcatOffset.z;
	
	targetPos.x = fwd.x + up.x;
	targetPos.y = fwd.y + up.y;
	targetPos.z = fwd.z + up.z;
	
	
	targetPos.x = targetPos.x + veh.position.x;
	targetPos.y = targetPos.y + veh.position.y;
	targetPos.z = targetPos.z + veh.position.z;
	*/
	
	var targetPos = getTargetPos(veh);
	
	var distToTarget = gunner.position.distance(targetPos);
	if(loose & distToTarget < 1) return;
	
	gunner.position = targetPos;
	
}

// ----------------------------------------------------------------------------




/*
bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	bindKey(SDLK_h, KEYSTATE_UP, changeOtherPlayersPos);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(SDLK_h);
});
*/

function changeOtherPlayersPos() {
	
	
	let clients = getClients();
	for(let i in clients) {

		//clients[i].player.setProofs(false, false, false, true, true); // test line
		
		var car = clients[i].player.getData("BobcatTurret");
		if(car == null){
			//message("null car");
		}else{
			if(car.health <= 0){
				//message("destroyed car");
			}else{
			    //message("car " + car + " with player " + i);
				syncGunnerWithCar(clients[i].player, car, false);
			//clients[i].player.collisionsEnabled = false;		
			}	
		}
		
	}
}