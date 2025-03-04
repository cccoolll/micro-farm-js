import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { PhysicsController } from '../ctrl/physicsController';


function createPhysicsController(entities: EntityCollection): PhysicsController {
    let room = entities.getRoom();
    let ctrl = new PhysicsController();
    ctrl.addObject(room.cube.object, 1.0);
    ctrl.addObject(room.floor.object, 0.0);
    ctrl.applyImpulse(new THREE.Vector3(4.5, 0, 0));
    return ctrl;
}

export class PhysicsSystem {
    private entities: EntityCollection;
    private world: PhysicsWorld;
    private physicsCtrl: PhysicsController;

    constructor(entities: EntityCollection, world: PhysicsWorld) {
        this.entities = entities;
        this.world = world;
        this.physicsCtrl = createPhysicsController(this.entities);
        this.world.addRigidBodies(this.physicsCtrl.getMeshRigidBodyPairs());
    }

    step(dt: number): void {
        let slowedDT = dt / 10.0;
        this.world.step(slowedDT);
        this.physicsCtrl.update();
    }
} 