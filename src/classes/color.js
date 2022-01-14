class Color
{

    constructor(r = 0, g = 0, b = 0, a = 1){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    rgb255(r, g, b, a = 1){
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;
    }

    toArray(alpha = false){
        if (alpha){
            return [this.r, this.g, this.b, this.a];
        }
        return [this.r, this.g, this.b];
    }

}

export default Color;
