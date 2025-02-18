import "./styles.css";

import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';
import { RoomObjectFactory } from './setup/roomObjectFactory';
import { AmmoSingleton } from './setup/ammoSingleton';
import { PhysicsWorld } from './system/physicsWorld';
import { EntityCollection } from "./setup/entityCollection";

async function init() {
    await AmmoSingleton.init();
    await Assets.init();
}

function createSceneSystem(): SceneSystem {
    let physicsWorld = new PhysicsWorld();
    let room = new RoomObjectFactory(physicsWorld).createRoom();
    let actors = new ActorFactory().createActors();
    const entities = new EntityCollection(room, actors);
    let scene = new SceneFactory(entities).createScene();
    return new SceneSystem(entities, scene, physicsWorld);
}

async function runApp() {
    await init();
    createSceneSystem().runSimulationLoop();
}


runApp();
