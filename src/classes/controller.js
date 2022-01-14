import { program } from "./program";
import Vector3 from "./vector3";

class Controller
{
    static m1 = null;
    static m2 = null;
    static m3 = null;

    static lastMousePos = new Vector3();

    static pressedKeys = {};

    static getAxis(){
        return new Vector3(
            0 + (Controller.pressedKeys["d"] ? 1 : 0) + (Controller.pressedKeys["a"] ? -1 : 0),
            0 + (Controller.pressedKeys["w"] ? 1 : 0) + (Controller.pressedKeys["s"] ? -1 : 0)
        );
    }

    static start(){
        this.setListeners();
        const doLoop = () => {
            this.inputLoops();
            requestAnimationFrame(doLoop);
        }
        requestAnimationFrame(doLoop);
    }

    static inputLoops(){
        const axis = this.getAxis();
        program.camera.translate(
            program.camera.direction.scale(axis.y)
                .scale(0.1)
        );
        program.camera.translate(
            Vector3.cross(program.camera.direction, new Vector3(0, 1, 0)).normalized().scale(-axis.x)
                .scale(0.1)
        );
        program.camera.translate(
            new Vector3(0, 1, 0).scale(0 + (Controller.pressedKeys["r"] ? 1 : 0) + (Controller.pressedKeys["f"] ? -1 : 0))
                .scale(0.1)
        );
    }

    static setListeners(){

        document.addEventListener("mousedown", function(e){
            switch (e.button) {
                case 0:
                    Controller.m1 = Date.now();
                    break;
                case 1:
                    Controller.m2 = Date.now();
                    break;
                case 2:
                    Controller.m3 = Date.now();
                    break;
                default:
                    break;
            }
        });

        document.addEventListener("click", function (e){
            if (Date.now() - Controller.m1 < 200){



            }

            Controller.m1 = null;
        });

        program.camera.renderer.canvas.addEventListener("click", function (){
            document.body.requestPointerLock();
        });

        document.addEventListener("mouseup", function(e){
            if (e.button == 1){
                Controller.m2 = null;
            }
        });

        // document.addEventListener("mouseup", function(e){
        //     if (e.button == 0){
        //         Controller.m1 = null;
        //     }
        // });

        document.addEventListener("mousemove", function(e){
            if (!document.pointerLockElement) return;
            const offset = new Vector3(-e.movementX, e.movementY)
            program.camera.mouseLook(offset);
        });

        document.addEventListener("wheel", function(e){
            if (e.wheelDeltaY < 1){
                program.camera.fov *= 1.1;
            } else {
                program.camera.fov /= 1.1;
            }
        });

        document.addEventListener("contextmenu", function(e){
            e.preventDefault();

            Controller.m3 = null;
        });

        document.addEventListener("keypress", (e) => {

        });

        document.addEventListener("mouseleave", (e) => {
            this.m1 = null;
            this.m2 = null;
            this.m3 = null;
        });

        document.addEventListener("keydown", (e) => {
            Controller.pressedKeys[e.key] = true;
        });

        document.addEventListener("keyup", (e) => {
            Controller.pressedKeys[e.key] = false;
        });

    }

}

export default Controller;

