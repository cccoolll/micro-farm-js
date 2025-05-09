import { URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from '../entity/armState';
import { ArmState, ArmCommand } from '../setup/enums';
import { Entity } from '../entity/entity';
import { ArmBaseHandle } from './armBaseHandle';
import { EntityCollection } from '../setup/entityCollection';
import { getSlideAngle, getSlideJoint } from './sliderUtils';

export class TableController {
    private static readonly SLIDE_SPEED = 1.0;
    private armFSM: ArmStateMachine;
    private table: Entity;
    private armBaseHandle: ArmBaseHandle;

    constructor(entities: EntityCollection) {
        this.table = entities.getActors().table;
        this.armFSM = new ArmStateMachine();
        this.armBaseHandle = new ArmBaseHandle(entities);
    }

    public handleArmCommand(newCommand: ArmCommand): void {
        this.armFSM.transition(newCommand);
    }

    public setArmBasePositionScaled(scaledPosition: number): void {
        this.armBaseHandle.setArmBasePositionScaled(scaledPosition);
        this.armFSM.transition(ArmCommand.STOP);
    }

    private getSlideTargetPosition(dt: number): number {
        const currentAngle = getSlideAngle(this.table);
        const targetAngle = this.armFSM.getTargetAngle();
        const angleDifference = targetAngle - currentAngle;
        if (Math.abs(angleDifference) < 0.01) return targetAngle;
        return currentAngle + Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), TableController.SLIDE_SPEED * dt);
    }

    private setSlidePosition(dt: number): void {
        const slideJoint: URDFJoint = getSlideJoint(this.table);
        slideJoint.setJointValue(this.getSlideTargetPosition(dt));
    }

    update(dt: number): void {
        if (this.armFSM.getState() == ArmState.Idle) {
            return;
        }
        this.setSlidePosition(dt);
        this.armBaseHandle.setArmPosition();
    }
}
