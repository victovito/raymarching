import Camera from "./camera";
import Vector3 from "./vector3";

import vertexShader from "../shaders/vs.glsl";
import fragmentShader from "../shaders/fs.glsl";
import Light from "./light";
import Color from "./color";

class Renderer
{

    constructor(canvas, camera){

        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;

        this.webgl = {
            /** @type {WebGL2RenderingContext} */
            gl: null,
            /** @type {WebGLProgram} */
            program: null
        }

        this.startTime = Date.now();
        /** @type {Light[]} */
        this.lights = [
            new Light(new Vector3(10, 0, 0), 1, 5, new Color(1, 0.06, 0.06)),
            new Light(new Vector3(-10, 0, 0), 1, 5, new Color(0.06, 0.06, 1)),
            new Light(new Vector3(0, 0, 10), 1, 5, new Color(0.06, 1, 0.06)),
            new Light(new Vector3(0, 0, -10), 1, 5, new Color(1, 1, 0.06)),
            new Light(new Vector3(0, 10, 0), 0.5, 5, new Color(1, 1, 1)),
            new Light(new Vector3(0, -10, 0), 0.5, 5, new Color(1, 1, 1))
        ]

        this.uniforms = {};

        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());

        /** @type {Camera} */
        this.camera = camera;

        this.setupWebgl();

        const renderLoop = () => {
            this.render();
            requestAnimationFrame(renderLoop);
        }
        requestAnimationFrame(renderLoop);
    }

    setUniform(name, value, type){
        this.uniforms[name] = {
            name, value, type
        };
    }

    screenDimensions(){
        return new Vector3(window.innerWidth, window.innerHeight, 0);
    }

    resizeCanvas(){
        const dim = this.screenDimensions();
        const pixels = 200;
        const min = Math.min(dim.x, dim.y);
        this.canvas.width = dim.x / (min / pixels); this.canvas.height = dim.y / (min / pixels);
    }

    setupWebgl(){
        const gl = this.canvas.getContext("webgl2");

        gl.getExtension("EXT_frag_depth");

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertexShader);
        gl.compileShader(vs);

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragmentShader);
        gl.compileShader(fs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
            console.error("Vertex shader compile error: ", gl.getShaderInfoLog(vs));
            return;
        }
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
            console.error("Fragment shader compile error: ", gl.getShaderInfoLog(fs));
            return;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.error(
                "Shader program link error: ",
                gl.getShaderInfoLog(program)
            );
        }

        gl.useProgram(program);

        const vertexBuffer = gl.createBuffer();
        const vertices = [
            -1, 1,
            -1, -1,
            1, -1,

            -1, 1,
            1, 1,
            1, -1
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const vPosAttrib = gl.getAttribLocation(program, "vPos");
        gl.vertexAttribPointer(
            vPosAttrib,
            2, gl.FLOAT,
            false,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(vPosAttrib);

        this.webgl = {
            gl,
            program
        }

    }

    render(){

        this.setUniform("iResolution", [this.canvas.width, this.canvas.height], "vec2");
        this.setUniform("time", Date.now() - this.startTime, "float");

        this.setUniform("lightsCount", this.lights.length, "int");
        for (let i = 0; i < this.lights.length; i++){
            this.setUniform(`lights[${i}].position`, this.lights[i].position.toArray(), "vec3");
            this.setUniform(`lights[${i}].color`, this.lights[i].color.toArray(), "vec3");
            this.setUniform(`lights[${i}].intensity`, this.lights[i].intensity, "float");
            this.setUniform(`lights[${i}].range`, this.lights[i].range, "float");
        }

        const k = Number.parseFloat(document.querySelector("#kSlider").value);
        this.setUniform("k", k, "float");

        this.setUniform("camera.position", this.camera.position.toArray(), "vec3");
        this.setUniform("camera.direction", this.camera.direction.toArray(), "vec3");
        this.setUniform("camera.up", this.camera.up.toArray(), "vec3");
        this.setUniform("camera.vPlaneDistance", this.camera.vPlaneDistance * 0.5, "float");

        this.draw();
    }

    draw(){

        const { gl, program } = this.webgl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);

        for (let key of Object.keys(this.uniforms)){
            const u = this.uniforms[key];
            const location = gl.getUniformLocation(program, u.name);
            switch (u.type){
                case "float":
                    gl.uniform1f(location, u.value);
                    break;
                case "int":
                    gl.uniform1i(location, u.value);
                    break;
                case "vec3":
                    gl.uniform3fv(location, u.value);
                    break;
                case "vec2":
                    gl.uniform2fv(location, u.value);
                    break;
                default:
                    console.error(`Type "${u.type}" is not a valid type`);
                    break;
            }
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

}

export default Renderer;
