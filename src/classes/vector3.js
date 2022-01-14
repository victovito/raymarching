class Vector3
{

    x = 0;
    y = 0;
    z = 0;

    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vector3){
        return new Vector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z);
    }

    sub(vector3){
        return new Vector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z);
    }

    scale(factor){
        return new Vector3(this.x * factor, this.y * factor, this.z * factor);
    }

    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalized(){
        return this.scale(1 / this.magnitude());
    }

    rotate(axis, angle){
        const sin = Math.sin(-angle);
        const cos = Math.cos(-angle);
        return new Vector3(
            -axis.x * (-(axis.x * this.x) - (axis.y * this.y) - (axis.z * this.z)) * (1 - cos) + this.x * cos + (-(axis.z * this.y) + (axis.y * this.z)) * sin,
            -axis.y * (-(axis.x * this.x) - (axis.y * this.y) - (axis.z * this.z)) * (1 - cos) + this.y * cos + ((axis.z * this.x) - (axis.x * this.z)) * sin,
            -axis.z * (-(axis.x * this.x) - (axis.y * this.y) - (axis.z * this.z)) * (1 - cos) + this.z * cos + (-(axis.y * this.x) + (axis.x * this.y)) * sin
        );
    }

    toArray(){
        return [this.x, this.y, this.z];
    }

    static dot(a, b){
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static cross(vectorA, vectorB){
        return new Vector3(
            vectorA.y * vectorB.z - vectorA.z * vectorB.y,
            vectorA.z * vectorB.x - vectorA.x * vectorB.z,
            vectorA.x * vectorB.y  - vectorA.y * vectorB.x
        );
    }

    static zero() {
        return new Vector3();
    }
    
}

export default Vector3;
