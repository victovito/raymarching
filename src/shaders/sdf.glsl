//@import ./utils;

float dot2( in vec2 v ) { return dot(v,v); }
float dot2( in vec3 v ) { return dot(v,v); }
float ndot( in vec2 a, in vec2 b ) { return a.x*b.x - a.y*b.y; }

float sdSphere(vec3 p, float r) {
	return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
	vec2 q = vec2(length(p.xz) - t.x, p.y);
	return length(q) - t.y;
}

float sdCappedCone( vec3 p, float h, float r1, float r2 )
{
  vec2 q = vec2( length(p.xz), p.y );
  vec2 k1 = vec2(r2,h);
  vec2 k2 = vec2(r2-r1,2.0*h);
  vec2 ca = vec2(q.x-min(q.x,(q.y<0.0)?r1:r2), abs(q.y)-h);
  vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot2(k2), 0.0, 1.0 );
  float s = (cb.x<0.0 && ca.y<0.0) ? -1.0 : 1.0;
  return s*sqrt( min(dot2(ca),dot2(cb)) );
}

float sdCappedCylinder( vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCell(vec3 p, vec3 id) {
	float cD = sdBox(p, vec3(1.0 * 10.0));
	float sD = sdSphere(p, 1.25 * 10.0);

	float obj = 9999.0;
	float objId;
	
	if((id.x > -2.0 && id.x < 2.0) && (id.y > -2.0 && id.y < 2.0) && (id.z > -2.0 && id.z < 2.0)) {
		objId == 0.0;
	} else {
		float randNum = rand(id);

		float rotAxis = floor(fract(randNum * 10000.0) * 3.0);
		mat2 rotation = rotate(time / 1000.0);
		if (rotAxis == 0.0){
			p.xy *= rotation;
		} else if (rotAxis == 1.0){
			p.xz *= rotation;
		} else {
			p.yz *= rotation;
		}

		objId = floor(randNum * 6.0);
		if(objId == 1.0) {
			obj = sdSphere(p, 2.0);
		} else if(objId == 2.0) {
			obj = sdBox(p, vec3(2.0));
		} else if(objId == 3.0) {
			obj = sdTorus(p, vec2(2.5, 0.75));
		}
	}


	float dist = max(cD, - sD);
	dist = min(dist, obj);

	return dist;
}

float sdPlayer(vec3 p){

	vec3 playerP = p;
	// playerP.xz *= rotate(PI / 4.0);
	// playerP.yz *= rotate(-PI / 4.0);

	float head = sdSphere(playerP, 1.0);
	float a = PI / 0.6;
	vec3 eyePos = vec3(cos(a), 0, sin(a));
	float leftEye = sdSphere(playerP - eyePos, 0.2);
	float rightEye = sdSphere(playerP - eyePos * vec3(-1, 1, 1), 0.2);

	float dist = min(head, leftEye);
	dist = min(dist, rightEye);

	return dist;
}
