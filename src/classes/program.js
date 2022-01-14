import Camera from "./camera";
import Controller from "./controller";
import Vector3 from "./vector3";

class Program
{

    constructor(canvas){
        program = this;

        this.camera = new Camera(canvas, new Vector3(0, 0, -1));

        Controller.start();

        this.start();
        const frameLoop = () => {
            this.update();
            requestAnimationFrame(frameLoop);
        }
        requestAnimationFrame(frameLoop);
    }

    start(){
        window.onbeforeunload = () => {
            localStorage.setItem("camera", JSON.stringify({position: this.camera.position, direction: this.camera.direction}));
        }
        let cameraPos = localStorage.getItem("camera");
        if (cameraPos){
            cameraPos = JSON.parse(cameraPos);
            this.camera.position = new Vector3(cameraPos.position.x, cameraPos.position.y, cameraPos.position.z);
            this.camera.direction = new Vector3(cameraPos.direction.x, cameraPos.direction.y, cameraPos.direction.z);
            this.camera.calculateUpDirection();
        }
    }
    
    update(){

    }

}

export default Program;
/** @type {Program} */
export let program = null;
