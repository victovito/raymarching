precision highp float;

#define MAX_STEPS 100
#define SURFACE_DIST 0.001
#define MAX_DIST 10000.0
#define MAX_LIGHTS 32

#define PI 3.14159265

struct Camera
{
    vec3 position;
    vec3 direction;
    vec3 up;
    float vPlaneDistance;
};

struct Light
{
    vec3 position;
    float intensity;
    float range;
    vec3 color;
};

uniform vec2 iResolution;
uniform float time;

uniform float k;

uniform Camera camera;

uniform int lightsCount;
uniform Light lights[MAX_LIGHTS];

struct RayHit
{
    bool didHit;
    float distance;
    vec3 position;
    vec3 normal;
    int steps;
};

//@import ./sdf;

float smoothMin(float a, float b, float k){
    if (k == 0.0) return min(a, b);
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - (h*h*h*k*1.0/6.0);
}

float getDist(vec3 p){
    vec3 c = vec3(20);
    vec3 q = fract((p + 0.5 * c) / c) * c - 0.5 * c;
    float grid = sdCell(q, floor((p + 0.5 * c) / c));
    float playerD = sdPlayer(p);
    return min(grid, playerD);
    // return sdCell(p, vec3(0));
}

vec3 getNormal(vec3 p){
    float d = getDist(p);
    vec2 e = vec2(0.01, 0);
    vec3 n = d - vec3(
        getDist(p - e.xyy),
        getDist(p - e.yxy),
        getDist(p - e.yyx)
    );
    return normalize(n);
}

RayHit rayMarch(vec3 ro, vec3 rd){
    RayHit hit = RayHit(false, 0.0, ro, rd, 0);
    float dS;
    for (int i = 0; i < MAX_STEPS; i++){
        hit.position = ro + rd * hit.distance;
        dS = getDist(hit.position);
        hit.distance += dS;
        hit.steps = i;
        if (dS < SURFACE_DIST){
            hit.didHit = true;
            hit.normal = getNormal(hit.position);
            break;
        }
        if (hit.distance > MAX_DIST){
            break;
        }
    }
    return hit;
}

float getAmbientOcclusion(RayHit hit){
    float stepSize = 0.2;
    float ao = 0.0;
    float dist;
    for (int i = 1; i <= 3; i++){
        dist = stepSize * float(i);
        ao += max(0.0, dist - getDist(hit.position + hit.normal * dist)) / dist;
    }
    return 1.0 - ao * 0.1;
}

vec3 getDiffuse(RayHit hit, Light light){
    vec3 offset = light.position - hit.position;
    float dif = dot(hit.normal, normalize(offset));
    dif *= min(1.0, light.range / length(offset));
    return light.color * dif * light.intensity;
}

float getShadow(RayHit hit, Light light){
    RayHit l = rayMarch(hit.position + hit.normal * SURFACE_DIST * 2.0, normalize(light.position - hit.position));
    if (l.distance < length(light.position - hit.position)) return 0.0;
    else return 1.0;
}

vec3 getShade(RayHit hit, Light light){
    float shadow = getShadow(hit, light);
    vec3 diffuse = vec3(0.0);
    if (shadow > 0.0){
        diffuse = getDiffuse(hit, light);
    }

    vec3 color = diffuse * shadow * getAmbientOcclusion(hit);

    return color;
}

vec3 getShade(RayHit hit){
    vec3 color = vec3(0.0);
    for (int i = 0; i < MAX_LIGHTS; i++){
        if (i >= lightsCount){
            break;
        }
        color += getShade(hit, lights[i]);
    }
    return color;
    // return getShade(hit, lights[1]);
}

void main(){

    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    
    vec3 ro = camera.position;

    vec3 pixelPos = ro + camera.direction * camera.vPlaneDistance + camera.up * uv.y + cross(camera.up, camera.direction) * uv.x;
    vec3 rd = normalize(pixelPos - ro);

    RayHit hit = rayMarch(ro, rd);

    if (!hit.didHit) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    vec3 color = getShade(hit);

    gl_FragColor = vec4(color, 1.0);

}

