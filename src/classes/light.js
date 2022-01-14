import Color from "./color";
import Vector3 from "./vector3";

class Light
{

    constructor(position, intensity = 1, range = 1, color = new Vector3(0, 0, 0)){
        /** @type {Vector3} */
        this.position = position;
        /** @type {Number} */
        this.intensity = intensity;
        /** @type {Number} */
        this.range = range;
        /** @type {Color} */
        this.color = color;
    }

}

export default Light;
