/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shaders/fs.glsl":
/*!*****************************!*\
  !*** ./src/shaders/fs.glsl ***!
  \*****************************/
/***/ ((module) => {

eval("module.exports = \"precision highp float;\\r\\n\\r\\n#define MAX_STEPS 100\\r\\n#define SURFACE_DIST 0.001\\r\\n#define MAX_DIST 10000.0\\r\\n#define MAX_LIGHTS 32\\r\\n\\r\\n#define PI 3.14159265\\r\\n\\r\\nstruct Camera\\r\\n{\\r\\n    vec3 position;\\r\\n    vec3 direction;\\r\\n    vec3 up;\\r\\n    float vPlaneDistance;\\r\\n};\\r\\n\\r\\nstruct Light\\r\\n{\\r\\n    vec3 position;\\r\\n    float intensity;\\r\\n    float range;\\r\\n    vec3 color;\\r\\n};\\r\\n\\r\\nuniform vec2 iResolution;\\r\\nuniform float time;\\r\\n\\r\\nuniform float k;\\r\\n\\r\\nuniform Camera camera;\\r\\n\\r\\nuniform int lightsCount;\\r\\nuniform Light lights[MAX_LIGHTS];\\r\\n\\r\\nstruct RayHit\\r\\n{\\r\\n    bool didHit;\\r\\n    float distance;\\r\\n    vec3 position;\\r\\n    vec3 normal;\\r\\n    int steps;\\r\\n};\\r\\n\\r\\n////\\r\\nfloat rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }\\r\\nfloat rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }\\r\\nfloat rand(vec3 co){ return rand(co.xy+rand(co.z)); }\\r\\n\\r\\nmat2 rotate(float a){\\r\\n    float s = sin(a);\\r\\n    float c = cos(a);\\r\\n    return mat2(c, -s, s, c);\\r\\n}\\r\\n\\r\\n\\r\\nfloat dot2( in vec2 v ) { return dot(v,v); }\\r\\nfloat dot2( in vec3 v ) { return dot(v,v); }\\r\\nfloat ndot( in vec2 a, in vec2 b ) { return a.x*b.x - a.y*b.y; }\\r\\n\\r\\nfloat sdSphere(vec3 p, float r) {\\r\\n\\treturn length(p) - r;\\r\\n}\\r\\n\\r\\nfloat sdBox(vec3 p, vec3 b) {\\r\\n\\tvec3 q = abs(p) - b;\\r\\n\\treturn length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);\\r\\n}\\r\\n\\r\\nfloat sdTorus(vec3 p, vec2 t) {\\r\\n\\tvec2 q = vec2(length(p.xz) - t.x, p.y);\\r\\n\\treturn length(q) - t.y;\\r\\n}\\r\\n\\r\\nfloat sdCappedCone( vec3 p, float h, float r1, float r2 )\\r\\n{\\r\\n  vec2 q = vec2( length(p.xz), p.y );\\r\\n  vec2 k1 = vec2(r2,h);\\r\\n  vec2 k2 = vec2(r2-r1,2.0*h);\\r\\n  vec2 ca = vec2(q.x-min(q.x,(q.y<0.0)?r1:r2), abs(q.y)-h);\\r\\n  vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot2(k2), 0.0, 1.0 );\\r\\n  float s = (cb.x<0.0 && ca.y<0.0) ? -1.0 : 1.0;\\r\\n  return s*sqrt( min(dot2(ca),dot2(cb)) );\\r\\n}\\r\\n\\r\\nfloat sdCappedCylinder( vec3 p, float h, float r )\\r\\n{\\r\\n  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);\\r\\n  return min(max(d.x,d.y),0.0) + length(max(d,0.0));\\r\\n}\\r\\n\\r\\nfloat sdCell(vec3 p, vec3 id) {\\r\\n\\tfloat cD = sdBox(p, vec3(1.0 * 10.0));\\r\\n\\tfloat sD = sdSphere(p, 1.25 * 10.0);\\r\\n\\r\\n\\tfloat obj = 9999.0;\\r\\n\\tfloat objId;\\r\\n\\t\\r\\n\\tif((id.x > -2.0 && id.x < 2.0) && (id.y > -2.0 && id.y < 2.0) && (id.z > -2.0 && id.z < 2.0)) {\\r\\n\\t\\tobjId == 0.0;\\r\\n\\t} else {\\r\\n\\t\\tfloat randNum = rand(id);\\r\\n\\r\\n\\t\\tfloat rotAxis = floor(fract(randNum * 10000.0) * 3.0);\\r\\n\\t\\tmat2 rotation = rotate(time / 1000.0);\\r\\n\\t\\tif (rotAxis == 0.0){\\r\\n\\t\\t\\tp.xy *= rotation;\\r\\n\\t\\t} else if (rotAxis == 1.0){\\r\\n\\t\\t\\tp.xz *= rotation;\\r\\n\\t\\t} else {\\r\\n\\t\\t\\tp.yz *= rotation;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\tobjId = floor(randNum * 6.0);\\r\\n\\t\\tif(objId == 1.0) {\\r\\n\\t\\t\\tobj = sdSphere(p, 2.0);\\r\\n\\t\\t} else if(objId == 2.0) {\\r\\n\\t\\t\\tobj = sdBox(p, vec3(2.0));\\r\\n\\t\\t} else if(objId == 3.0) {\\r\\n\\t\\t\\tobj = sdTorus(p, vec2(2.5, 0.75));\\r\\n\\t\\t}\\r\\n\\t}\\r\\n\\r\\n\\r\\n\\tfloat dist = max(cD, - sD);\\r\\n\\tdist = min(dist, obj);\\r\\n\\r\\n\\treturn dist;\\r\\n}\\r\\n\\r\\nfloat sdPlayer(vec3 p){\\r\\n\\r\\n\\tvec3 playerP = p;\\r\\n\\t// playerP.xz *= rotate(PI / 4.0);\\r\\n\\t// playerP.yz *= rotate(-PI / 4.0);\\r\\n\\r\\n\\tfloat head = sdSphere(playerP, 1.0);\\r\\n\\tfloat a = PI / 0.6;\\r\\n\\tvec3 eyePos = vec3(cos(a), 0, sin(a));\\r\\n\\tfloat leftEye = sdSphere(playerP - eyePos, 0.2);\\r\\n\\tfloat rightEye = sdSphere(playerP - eyePos * vec3(-1, 1, 1), 0.2);\\r\\n\\r\\n\\tfloat dist = min(head, leftEye);\\r\\n\\tdist = min(dist, rightEye);\\r\\n\\r\\n\\treturn dist;\\r\\n}\\r\\n\\r\\n\\r\\nfloat smoothMin(float a, float b, float k){\\r\\n    if (k == 0.0) return min(a, b);\\r\\n    float h = max(k - abs(a - b), 0.0) / k;\\r\\n    return min(a, b) - (h*h*h*k*1.0/6.0);\\r\\n}\\r\\n\\r\\nfloat getDist(vec3 p){\\r\\n    vec3 c = vec3(20);\\r\\n    vec3 q = fract((p + 0.5 * c) / c) * c - 0.5 * c;\\r\\n    float grid = sdCell(q, floor((p + 0.5 * c) / c));\\r\\n    float playerD = sdPlayer(p);\\r\\n    return min(grid, playerD);\\r\\n    // return sdCell(p, vec3(0));\\r\\n}\\r\\n\\r\\nvec3 getNormal(vec3 p){\\r\\n    float d = getDist(p);\\r\\n    vec2 e = vec2(0.01, 0);\\r\\n    vec3 n = d - vec3(\\r\\n        getDist(p - e.xyy),\\r\\n        getDist(p - e.yxy),\\r\\n        getDist(p - e.yyx)\\r\\n    );\\r\\n    return normalize(n);\\r\\n}\\r\\n\\r\\nRayHit rayMarch(vec3 ro, vec3 rd){\\r\\n    RayHit hit = RayHit(false, 0.0, ro, rd, 0);\\r\\n    float dS;\\r\\n    for (int i = 0; i < MAX_STEPS; i++){\\r\\n        hit.position = ro + rd * hit.distance;\\r\\n        dS = getDist(hit.position);\\r\\n        hit.distance += dS;\\r\\n        hit.steps = i;\\r\\n        if (dS < SURFACE_DIST){\\r\\n            hit.didHit = true;\\r\\n            hit.normal = getNormal(hit.position);\\r\\n            break;\\r\\n        }\\r\\n        if (hit.distance > MAX_DIST){\\r\\n            break;\\r\\n        }\\r\\n    }\\r\\n    return hit;\\r\\n}\\r\\n\\r\\nfloat getAmbientOcclusion(RayHit hit){\\r\\n    float stepSize = 0.2;\\r\\n    float ao = 0.0;\\r\\n    float dist;\\r\\n    for (int i = 1; i <= 3; i++){\\r\\n        dist = stepSize * float(i);\\r\\n        ao += max(0.0, dist - getDist(hit.position + hit.normal * dist)) / dist;\\r\\n    }\\r\\n    return 1.0 - ao * 0.1;\\r\\n}\\r\\n\\r\\nvec3 getDiffuse(RayHit hit, Light light){\\r\\n    vec3 offset = light.position - hit.position;\\r\\n    float dif = dot(hit.normal, normalize(offset));\\r\\n    dif *= min(1.0, light.range / length(offset));\\r\\n    return light.color * dif * light.intensity;\\r\\n}\\r\\n\\r\\nfloat getShadow(RayHit hit, Light light){\\r\\n    RayHit l = rayMarch(hit.position + hit.normal * SURFACE_DIST * 2.0, normalize(light.position - hit.position));\\r\\n    if (l.distance < length(light.position - hit.position)) return 0.0;\\r\\n    else return 1.0;\\r\\n}\\r\\n\\r\\nvec3 getShade(RayHit hit, Light light){\\r\\n    float shadow = getShadow(hit, light);\\r\\n    vec3 diffuse = vec3(0.0);\\r\\n    if (shadow > 0.0){\\r\\n        diffuse = getDiffuse(hit, light);\\r\\n    }\\r\\n\\r\\n    vec3 color = diffuse * shadow * getAmbientOcclusion(hit);\\r\\n\\r\\n    return color;\\r\\n}\\r\\n\\r\\nvec3 getShade(RayHit hit){\\r\\n    vec3 color = vec3(0.0);\\r\\n    for (int i = 0; i < MAX_LIGHTS; i++){\\r\\n        if (i >= lightsCount){\\r\\n            break;\\r\\n        }\\r\\n        color += getShade(hit, lights[i]);\\r\\n    }\\r\\n    return color;\\r\\n    // return getShade(hit, lights[1]);\\r\\n}\\r\\n\\r\\nvoid main(){\\r\\n\\r\\n    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;\\r\\n    \\r\\n    vec3 ro = camera.position;\\r\\n\\r\\n    vec3 pixelPos = ro + camera.direction * camera.vPlaneDistance + camera.up * uv.y + cross(camera.up, camera.direction) * uv.x;\\r\\n    vec3 rd = normalize(pixelPos - ro);\\r\\n\\r\\n    RayHit hit = rayMarch(ro, rd);\\r\\n\\r\\n    if (!hit.didHit) {\\r\\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\\r\\n        return;\\r\\n    }\\r\\n\\r\\n    vec3 color = getShade(hit);\\r\\n\\r\\n    gl_FragColor = vec4(color, 1.0);\\r\\n\\r\\n}\\r\\n\\r\\n\"\n\n//# sourceURL=webpack://raymarching/./src/shaders/fs.glsl?");

/***/ }),

/***/ "./src/shaders/vs.glsl":
/*!*****************************!*\
  !*** ./src/shaders/vs.glsl ***!
  \*****************************/
/***/ ((module) => {

eval("module.exports = \"precision highp float;\\r\\n\\r\\nattribute vec2 vPos;\\r\\n\\r\\nvoid main(){\\r\\n    gl_Position = vec4(vPos, 0.0, 1.0);\\r\\n}\\r\\n\"\n\n//# sourceURL=webpack://raymarching/./src/shaders/vs.glsl?");

/***/ }),

/***/ "./src/classes/camera.js":
/*!*******************************!*\
  !*** ./src/classes/camera.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ \"./src/classes/renderer.js\");\n/* harmony import */ var _vector3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vector3 */ \"./src/classes/vector3.js\");\n\r\n\r\n\r\nclass Camera\r\n{\r\n\r\n    /** @type {Vector3} */\r\n    position = null;\r\n\r\n    /** @type {Vector3} */\r\n    direction = null;\r\n    \r\n    /** @type {Vector3} */\r\n    up = null;\r\n\r\n    vPlaneDistance = 1;\r\n\r\n    lookSensitivity = 0.6;\r\n\r\n    /**\r\n     * @param {Vector3} position \r\n     */\r\n    constructor(canvas, position = new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 0, 0), direction = new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 0, 1)){\r\n        this.renderer = new _renderer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas, this);\r\n\r\n        this.position = position;\r\n        this.direction = direction;\r\n\r\n        this.calculateUpDirection();\r\n    }\r\n\r\n    calculateUpDirection(){\r\n        this.up = _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"].cross(_vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"].cross(this.direction, new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 1, 0)), this.direction).normalized();\r\n    }\r\n\r\n    mouseLook(offset){\r\n        this.direction = this.direction.rotate(new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 1, 0), offset.x * 0.01 * this.lookSensitivity);\r\n        this.direction = this.direction.rotate(_vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"].cross(this.direction, new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 1, 0)).normalized(), offset.y * 0.01 * this.lookSensitivity);\r\n        this.calculateUpDirection();\r\n    }\r\n\r\n    translate(offset){\r\n        this.position = this.position.add(offset);\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Camera);\r\n\n\n//# sourceURL=webpack://raymarching/./src/classes/camera.js?");

/***/ }),

/***/ "./src/classes/color.js":
/*!******************************!*\
  !*** ./src/classes/color.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Color\r\n{\r\n\r\n    constructor(r = 0, g = 0, b = 0, a = 1){\r\n        this.r = r;\r\n        this.g = g;\r\n        this.b = b;\r\n        this.a = a;\r\n    }\r\n    \r\n    rgb255(r, g, b, a = 1){\r\n        this.r = r / 255;\r\n        this.g = g / 255;\r\n        this.b = b / 255;\r\n        this.a = a / 255;\r\n    }\r\n\r\n    toArray(alpha = false){\r\n        if (alpha){\r\n            return [this.r, this.g, this.b, this.a];\r\n        }\r\n        return [this.r, this.g, this.b];\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Color);\r\n\n\n//# sourceURL=webpack://raymarching/./src/classes/color.js?");

/***/ }),

/***/ "./src/classes/controller.js":
/*!***********************************!*\
  !*** ./src/classes/controller.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _program__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./program */ \"./src/classes/program.js\");\n/* harmony import */ var _vector3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vector3 */ \"./src/classes/vector3.js\");\n\r\n\r\n\r\nclass Controller\r\n{\r\n    static m1 = null;\r\n    static m2 = null;\r\n    static m3 = null;\r\n\r\n    static lastMousePos = new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\r\n\r\n    static pressedKeys = {};\r\n\r\n    static getAxis(){\r\n        return new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\r\n            0 + (Controller.pressedKeys[\"d\"] ? 1 : 0) + (Controller.pressedKeys[\"a\"] ? -1 : 0),\r\n            0 + (Controller.pressedKeys[\"w\"] ? 1 : 0) + (Controller.pressedKeys[\"s\"] ? -1 : 0)\r\n        );\r\n    }\r\n\r\n    static start(){\r\n        this.setListeners();\r\n        const doLoop = () => {\r\n            this.inputLoops();\r\n            requestAnimationFrame(doLoop);\r\n        }\r\n        requestAnimationFrame(doLoop);\r\n    }\r\n\r\n    static inputLoops(){\r\n        const axis = this.getAxis();\r\n        _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.translate(\r\n            _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.direction.scale(axis.y)\r\n                .scale(0.1)\r\n        );\r\n        _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.translate(\r\n            _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"].cross(_program__WEBPACK_IMPORTED_MODULE_0__.program.camera.direction, new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 1, 0)).normalized().scale(-axis.x)\r\n                .scale(0.1)\r\n        );\r\n        _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.translate(\r\n            new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 1, 0).scale(0 + (Controller.pressedKeys[\"r\"] ? 1 : 0) + (Controller.pressedKeys[\"f\"] ? -1 : 0))\r\n                .scale(0.1)\r\n        );\r\n    }\r\n\r\n    static setListeners(){\r\n\r\n        document.addEventListener(\"mousedown\", function(e){\r\n            switch (e.button) {\r\n                case 0:\r\n                    Controller.m1 = Date.now();\r\n                    break;\r\n                case 1:\r\n                    Controller.m2 = Date.now();\r\n                    break;\r\n                case 2:\r\n                    Controller.m3 = Date.now();\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        });\r\n\r\n        document.addEventListener(\"click\", function (e){\r\n            if (Date.now() - Controller.m1 < 200){\r\n\r\n\r\n\r\n            }\r\n\r\n            Controller.m1 = null;\r\n        });\r\n\r\n        _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.renderer.canvas.addEventListener(\"click\", function (){\r\n            document.body.requestPointerLock();\r\n        });\r\n\r\n        document.addEventListener(\"mouseup\", function(e){\r\n            if (e.button == 1){\r\n                Controller.m2 = null;\r\n            }\r\n        });\r\n\r\n        // document.addEventListener(\"mouseup\", function(e){\r\n        //     if (e.button == 0){\r\n        //         Controller.m1 = null;\r\n        //     }\r\n        // });\r\n\r\n        document.addEventListener(\"mousemove\", function(e){\r\n            if (!document.pointerLockElement) return;\r\n            const offset = new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](-e.movementX, e.movementY)\r\n            _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.mouseLook(offset);\r\n        });\r\n\r\n        document.addEventListener(\"wheel\", function(e){\r\n            if (e.wheelDeltaY < 1){\r\n                _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.fov *= 1.1;\r\n            } else {\r\n                _program__WEBPACK_IMPORTED_MODULE_0__.program.camera.fov /= 1.1;\r\n            }\r\n        });\r\n\r\n        document.addEventListener(\"contextmenu\", function(e){\r\n            e.preventDefault();\r\n\r\n            Controller.m3 = null;\r\n        });\r\n\r\n        document.addEventListener(\"keypress\", (e) => {\r\n\r\n        });\r\n\r\n        document.addEventListener(\"mouseleave\", (e) => {\r\n            this.m1 = null;\r\n            this.m2 = null;\r\n            this.m3 = null;\r\n        });\r\n\r\n        document.addEventListener(\"keydown\", (e) => {\r\n            Controller.pressedKeys[e.key] = true;\r\n        });\r\n\r\n        document.addEventListener(\"keyup\", (e) => {\r\n            Controller.pressedKeys[e.key] = false;\r\n        });\r\n\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Controller);\r\n\r\n\n\n//# sourceURL=webpack://raymarching/./src/classes/controller.js?");

/***/ }),

/***/ "./src/classes/light.js":
/*!******************************!*\
  !*** ./src/classes/light.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ \"./src/classes/color.js\");\n/* harmony import */ var _vector3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vector3 */ \"./src/classes/vector3.js\");\n\r\n\r\n\r\nclass Light\r\n{\r\n\r\n    constructor(position, intensity = 1, range = 1, color = new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 0, 0)){\r\n        /** @type {Vector3} */\r\n        this.position = position;\r\n        /** @type {Number} */\r\n        this.intensity = intensity;\r\n        /** @type {Number} */\r\n        this.range = range;\r\n        /** @type {Color} */\r\n        this.color = color;\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Light);\r\n\n\n//# sourceURL=webpack://raymarching/./src/classes/light.js?");

/***/ }),

/***/ "./src/classes/program.js":
/*!********************************!*\
  !*** ./src/classes/program.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"program\": () => (/* binding */ program)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./src/classes/camera.js\");\n/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller */ \"./src/classes/controller.js\");\n/* harmony import */ var _vector3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vector3 */ \"./src/classes/vector3.js\");\n\r\n\r\n\r\n\r\nclass Program\r\n{\r\n\r\n    constructor(canvas){\r\n        program = this;\r\n\r\n        this.camera = new _camera__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas, new _vector3__WEBPACK_IMPORTED_MODULE_2__[\"default\"](0, 0, -1));\r\n\r\n        _controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].start();\r\n\r\n        this.start();\r\n        const frameLoop = () => {\r\n            this.update();\r\n            requestAnimationFrame(frameLoop);\r\n        }\r\n        requestAnimationFrame(frameLoop);\r\n    }\r\n\r\n    start(){\r\n        window.onbeforeunload = () => {\r\n            localStorage.setItem(\"camera\", JSON.stringify({position: this.camera.position, direction: this.camera.direction}));\r\n        }\r\n        let cameraPos = localStorage.getItem(\"camera\");\r\n        if (cameraPos){\r\n            cameraPos = JSON.parse(cameraPos);\r\n            this.camera.position = new _vector3__WEBPACK_IMPORTED_MODULE_2__[\"default\"](cameraPos.position.x, cameraPos.position.y, cameraPos.position.z);\r\n            this.camera.direction = new _vector3__WEBPACK_IMPORTED_MODULE_2__[\"default\"](cameraPos.direction.x, cameraPos.direction.y, cameraPos.direction.z);\r\n            this.camera.calculateUpDirection();\r\n        }\r\n    }\r\n    \r\n    update(){\r\n\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Program);\r\n/** @type {Program} */\r\nlet program = null;\r\n\n\n//# sourceURL=webpack://raymarching/./src/classes/program.js?");

/***/ }),

/***/ "./src/classes/renderer.js":
/*!*********************************!*\
  !*** ./src/classes/renderer.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./src/classes/camera.js\");\n/* harmony import */ var _vector3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vector3 */ \"./src/classes/vector3.js\");\n/* harmony import */ var _shaders_vs_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shaders/vs.glsl */ \"./src/shaders/vs.glsl\");\n/* harmony import */ var _shaders_vs_glsl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shaders_vs_glsl__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _shaders_fs_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shaders/fs.glsl */ \"./src/shaders/fs.glsl\");\n/* harmony import */ var _shaders_fs_glsl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shaders_fs_glsl__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _light__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./light */ \"./src/classes/light.js\");\n/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./color */ \"./src/classes/color.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass Renderer\r\n{\r\n\r\n    constructor(canvas, camera){\r\n\r\n        /** @type {HTMLCanvasElement} */\r\n        this.canvas = canvas;\r\n\r\n        this.webgl = {\r\n            /** @type {WebGL2RenderingContext} */\r\n            gl: null,\r\n            /** @type {WebGLProgram} */\r\n            program: null\r\n        }\r\n\r\n        this.startTime = Date.now();\r\n        /** @type {Light[]} */\r\n        this.lights = [\r\n            new _light__WEBPACK_IMPORTED_MODULE_4__[\"default\"](new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](10, 0, 0), 1, 5, new _color__WEBPACK_IMPORTED_MODULE_5__[\"default\"](1, 0.06, 0.06)),\r\n            new _light__WEBPACK_IMPORTED_MODULE_4__[\"default\"](new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](-10, 0, 0), 1, 5, new _color__WEBPACK_IMPORTED_MODULE_5__[\"default\"](0.06, 0.06, 1)),\r\n            new _light__WEBPACK_IMPORTED_MODULE_4__[\"default\"](new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 0, 10), 1, 5, new _color__WEBPACK_IMPORTED_MODULE_5__[\"default\"](0.06, 1, 0.06)),\r\n            new _light__WEBPACK_IMPORTED_MODULE_4__[\"default\"](new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 0, -10), 1, 5, new _color__WEBPACK_IMPORTED_MODULE_5__[\"default\"](1, 1, 0.06)),\r\n            new _light__WEBPACK_IMPORTED_MODULE_4__[\"default\"](new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, 10, 0), 0.5, 5, new _color__WEBPACK_IMPORTED_MODULE_5__[\"default\"](1, 1, 1)),\r\n            new _light__WEBPACK_IMPORTED_MODULE_4__[\"default\"](new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](0, -10, 0), 0.5, 5, new _color__WEBPACK_IMPORTED_MODULE_5__[\"default\"](1, 1, 1))\r\n        ]\r\n\r\n        this.uniforms = {};\r\n\r\n        this.resizeCanvas();\r\n        window.addEventListener(\"resize\", () => this.resizeCanvas());\r\n\r\n        /** @type {Camera} */\r\n        this.camera = camera;\r\n\r\n        this.setupWebgl();\r\n\r\n        const renderLoop = () => {\r\n            this.render();\r\n            requestAnimationFrame(renderLoop);\r\n        }\r\n        requestAnimationFrame(renderLoop);\r\n    }\r\n\r\n    setUniform(name, value, type){\r\n        this.uniforms[name] = {\r\n            name, value, type\r\n        };\r\n    }\r\n\r\n    screenDimensions(){\r\n        return new _vector3__WEBPACK_IMPORTED_MODULE_1__[\"default\"](window.innerWidth, window.innerHeight, 0);\r\n    }\r\n\r\n    resizeCanvas(){\r\n        const dim = this.screenDimensions();\r\n        const pixels = 200;\r\n        const min = Math.min(dim.x, dim.y);\r\n        this.canvas.width = dim.x / (min / pixels); this.canvas.height = dim.y / (min / pixels);\r\n    }\r\n\r\n    setupWebgl(){\r\n        const gl = this.canvas.getContext(\"webgl2\");\r\n\r\n        gl.getExtension(\"EXT_frag_depth\");\r\n\r\n        const vs = gl.createShader(gl.VERTEX_SHADER);\r\n        gl.shaderSource(vs, (_shaders_vs_glsl__WEBPACK_IMPORTED_MODULE_2___default()));\r\n        gl.compileShader(vs);\r\n\r\n        const fs = gl.createShader(gl.FRAGMENT_SHADER);\r\n        gl.shaderSource(fs, (_shaders_fs_glsl__WEBPACK_IMPORTED_MODULE_3___default()));\r\n        gl.compileShader(fs);\r\n\r\n        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){\r\n            console.error(\"Vertex shader compile error: \", gl.getShaderInfoLog(vs));\r\n            return;\r\n        }\r\n        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){\r\n            console.error(\"Fragment shader compile error: \", gl.getShaderInfoLog(fs));\r\n            return;\r\n        }\r\n\r\n        const program = gl.createProgram();\r\n        gl.attachShader(program, vs);\r\n        gl.attachShader(program, fs);\r\n        gl.linkProgram(program);\r\n        if (!gl.getProgramParameter(program, gl.LINK_STATUS)){\r\n            console.error(\r\n                \"Shader program link error: \",\r\n                gl.getShaderInfoLog(program)\r\n            );\r\n        }\r\n\r\n        gl.useProgram(program);\r\n\r\n        const vertexBuffer = gl.createBuffer();\r\n        const vertices = [\r\n            -1, 1,\r\n            -1, -1,\r\n            1, -1,\r\n\r\n            -1, 1,\r\n            1, 1,\r\n            1, -1\r\n        ];\r\n        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);\r\n        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);\r\n\r\n        const vPosAttrib = gl.getAttribLocation(program, \"vPos\");\r\n        gl.vertexAttribPointer(\r\n            vPosAttrib,\r\n            2, gl.FLOAT,\r\n            false,\r\n            2 * Float32Array.BYTES_PER_ELEMENT,\r\n            0\r\n        );\r\n        gl.enableVertexAttribArray(vPosAttrib);\r\n\r\n        this.webgl = {\r\n            gl,\r\n            program\r\n        }\r\n\r\n    }\r\n\r\n    render(){\r\n\r\n        this.setUniform(\"iResolution\", [this.canvas.width, this.canvas.height], \"vec2\");\r\n        this.setUniform(\"time\", Date.now() - this.startTime, \"float\");\r\n\r\n        this.setUniform(\"lightsCount\", this.lights.length, \"int\");\r\n        for (let i = 0; i < this.lights.length; i++){\r\n            this.setUniform(`lights[${i}].position`, this.lights[i].position.toArray(), \"vec3\");\r\n            this.setUniform(`lights[${i}].color`, this.lights[i].color.toArray(), \"vec3\");\r\n            this.setUniform(`lights[${i}].intensity`, this.lights[i].intensity, \"float\");\r\n            this.setUniform(`lights[${i}].range`, this.lights[i].range, \"float\");\r\n        }\r\n\r\n        const k = Number.parseFloat(document.querySelector(\"#kSlider\").value);\r\n        this.setUniform(\"k\", k, \"float\");\r\n\r\n        this.setUniform(\"camera.position\", this.camera.position.toArray(), \"vec3\");\r\n        this.setUniform(\"camera.direction\", this.camera.direction.toArray(), \"vec3\");\r\n        this.setUniform(\"camera.up\", this.camera.up.toArray(), \"vec3\");\r\n        this.setUniform(\"camera.vPlaneDistance\", this.camera.vPlaneDistance * 0.5, \"float\");\r\n\r\n        this.draw();\r\n    }\r\n\r\n    draw(){\r\n\r\n        const { gl, program } = this.webgl;\r\n\r\n        gl.clearColor(0.0, 0.0, 0.0, 1.0);\r\n        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);\r\n        gl.viewport(0, 0, canvas.width, canvas.height);\r\n\r\n        for (let key of Object.keys(this.uniforms)){\r\n            const u = this.uniforms[key];\r\n            const location = gl.getUniformLocation(program, u.name);\r\n            switch (u.type){\r\n                case \"float\":\r\n                    gl.uniform1f(location, u.value);\r\n                    break;\r\n                case \"int\":\r\n                    gl.uniform1i(location, u.value);\r\n                    break;\r\n                case \"vec3\":\r\n                    gl.uniform3fv(location, u.value);\r\n                    break;\r\n                case \"vec2\":\r\n                    gl.uniform2fv(location, u.value);\r\n                    break;\r\n                default:\r\n                    console.error(`Type \"${u.type}\" is not a valid type`);\r\n                    break;\r\n            }\r\n        }\r\n\r\n        gl.drawArrays(gl.TRIANGLES, 0, 6);\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Renderer);\r\n\n\n//# sourceURL=webpack://raymarching/./src/classes/renderer.js?");

/***/ }),

/***/ "./src/classes/vector3.js":
/*!********************************!*\
  !*** ./src/classes/vector3.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Vector3\r\n{\r\n\r\n    x = 0;\r\n    y = 0;\r\n    z = 0;\r\n\r\n    constructor(x = 0, y = 0, z = 0){\r\n        this.x = x;\r\n        this.y = y;\r\n        this.z = z;\r\n    }\r\n\r\n    add(vector3){\r\n        return new Vector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z);\r\n    }\r\n\r\n    sub(vector3){\r\n        return new Vector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z);\r\n    }\r\n\r\n    scale(factor){\r\n        return new Vector3(this.x * factor, this.y * factor, this.z * factor);\r\n    }\r\n\r\n    magnitude(){\r\n        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\r\n    }\r\n\r\n    normalized(){\r\n        return this.scale(1 / this.magnitude());\r\n    }\r\n\r\n    rotate(axis, angle){\r\n        const sin = Math.sin(-angle);\r\n        const cos = Math.cos(-angle);\r\n        return new Vector3(\r\n            -axis.x * (-(axis.x * this.x) - (axis.y * this.y) - (axis.z * this.z)) * (1 - cos) + this.x * cos + (-(axis.z * this.y) + (axis.y * this.z)) * sin,\r\n            -axis.y * (-(axis.x * this.x) - (axis.y * this.y) - (axis.z * this.z)) * (1 - cos) + this.y * cos + ((axis.z * this.x) - (axis.x * this.z)) * sin,\r\n            -axis.z * (-(axis.x * this.x) - (axis.y * this.y) - (axis.z * this.z)) * (1 - cos) + this.z * cos + (-(axis.y * this.x) + (axis.x * this.y)) * sin\r\n        );\r\n    }\r\n\r\n    toArray(){\r\n        return [this.x, this.y, this.z];\r\n    }\r\n\r\n    static dot(a, b){\r\n        return a.x * b.x + a.y * b.y + a.z * b.z;\r\n    }\r\n\r\n    static cross(vectorA, vectorB){\r\n        return new Vector3(\r\n            vectorA.y * vectorB.z - vectorA.z * vectorB.y,\r\n            vectorA.z * vectorB.x - vectorA.x * vectorB.z,\r\n            vectorA.x * vectorB.y  - vectorA.y * vectorB.x\r\n        );\r\n    }\r\n\r\n    static zero() {\r\n        return new Vector3();\r\n    }\r\n    \r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vector3);\r\n\n\n//# sourceURL=webpack://raymarching/./src/classes/vector3.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _classes_program__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/program */ \"./src/classes/program.js\");\n\r\n\r\nconst init = () => {\r\n    const program = new _classes_program__WEBPACK_IMPORTED_MODULE_0__[\"default\"](document.querySelector(\"#canvas\"));\r\n    console.log(\"Started...\", program);\r\n}\r\n\r\ndocument.body.onload = init;\n\n//# sourceURL=webpack://raymarching/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;