
float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }
float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
float rand(vec3 co){ return rand(co.xy+rand(co.z)); }

mat2 rotate(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}
