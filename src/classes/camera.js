import Renderer from "./renderer";
import Vector3 from "./vector3";

class Camera
{

    /** @type {Vector3} */
    position = null;

    /** @type {Vector3} */
    direction = null;
    
    /** @type {Vector3} */
    up = null;

    vPlaneDistance = 1;

    lookSensitivity = 0.6;

    /**
     * @param {Vector3} position 
     */
    constructor(canvas, position = new Vector3(0, 0, 0), direction = new Vector3(0, 0, 1)){
        this.renderer = new Renderer(canvas, this);

        this.position = position;
        this.direction = direction;

        this.calculateUpDirection();
    }

    calculateUpDirection(){
        this.up = Vector3.cross(Vector3.cross(this.direction, new Vector3(0, 1, 0)), this.direction).normalized();
    }

    mouseLook(offset){
        this.direction = this.direction.rotate(new Vector3(0, 1, 0), offset.x * 0.01 * this.lookSensitivity);
        this.direction = this.direction.rotate(Vector3.cross(this.direction, new Vector3(0, 1, 0)).normalized(), offset.y * 0.01 * this.lookSensitivity);
        this.calculateUpDirection();
    }

    translate(offset){
        this.position = this.position.add(offset);
    }

}

export default Camera;
