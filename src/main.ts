import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';
import { RoomObjectFactory } from './setup/roomObjectFactory';
import ammo from "ammo.js";


async function initiAmmo() {
    try {
        const Ammo = await ammo.bind(window)();
        console.log(new Ammo.btVector3(12, 2, 3).x());
    } catch (error) {
        console.error('Error initializing Ammo.js:', error);
    }
}


async function initializeApp() {

    await initiAmmo();

    await Assets.init();
    let room = new RoomObjectFactory().createRoom();
    let actors = new ActorFactory().createActors();
    let scene = new SceneFactory(room, actors).createScene();

    new SceneSystem(room, actors, scene).runSimulationLoop();
}

initializeApp();
