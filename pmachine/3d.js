function project( point3, eye, width, height )
{
    return screen( { x: point3.x/(eye-point3.z), y: point3.y/(eye-point3.z) }, width, height );
}

function screen( point2, width, height )
{
    return { x: width*point2.x, y: -height*point2.y }


//    return { x: width*(point2.x+1)/2, y: height*(1-(point2.y+1)/2) }
}

function rotate_y( point3, theta )
{
    let c = Math.cos(theta);
    let s = Math.sin(theta);

    return { 
        x : point3.x * c - point3.z * s,
        y : point3.y, 
        z : point3.x * s + point3.z * c 
    }
}
function rotate_z( point3, theta )
{
    /*
    x' = x cos θ − y sin θ
    y' = x sin θ + y cos θ
    */
    
    let c = Math.cos(theta);
    let s = Math.sin(theta);

    return { 
        x : point3.x * c - point3.y * s,
        y : point3.x * s + point3.y * c, 
        z : point3.z 
    }
}

function randrange( min, max )
{
    return min + (max-min) * Math.random();
}


class Particle3
{
    constructor( )
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
        this.lifetime = 1;
        this.life = 0;
        this.radius = 4;
        this.active = false;
        this.color = `rgb(255,255,255)`;
    }

    at( x, y, z  )
    {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    v( vx, vy, vz )
    {
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        return this;
    }
    a( ax, ay, az )
    {
        this.ax = ax;
        this.ay = ay;
        this.az = az;
        return this;
    }
    lt( lifetime )
    {
        this.lifetime = lifetime;        
        return this;
    }
    r( r0, r1)
    {
        this.radius = r0;
        this.radius0 = r0;
        this.radius1 = r1;
        return this;
    }
    col( color )
    {
        this.color = color;
    }
}

class ParticleSytem3
{
    constructor( pcount )
    {
        this.plist = [];
        this.time = 0;
        this.pid = 0;

        for( var i=0; i < pcount; i++ )
            this.plist.push( new Particle3() )
       
        this.fpemit = ( time, id, p ) => {

        };
        this.fpupdate = ( p, deltatime ) => {
            p.vx += p.ax * deltatime;
            p.vy += p.ay * deltatime;
            p.vz += p.az * deltatime;
            p.x += p.vx * deltatime;
            p.y += p.vy * deltatime;
            p.z += p.vz * deltatime;            
        };
        this.fpdraw = ( p, ctx ) => {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();

            let __p = rotate_y( { x: p.x,  y: p.y, z: p.z }, this.time )

            let _p = project( __p, 5, ctx.canvas.width, ctx.canvas.height );

            ctx.arc(_p.x, _p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
         };
    }

    emit()
    {
        for( let i=0; i<this.plist.length;i++)
        {
            let p = this.plist[i];
            if( p.active == false )
            {
                p.active = true;
                p.life = 0;
                this.fpemit( this.time, this.pid, p );
                this.pid++;
                //console.log(`emit ${this.pid}`);
                return p;
            }
        }
        return null;
    }

    draw(ctx)
    {
        this.plist.forEach( p => {
            if( p.active )
            {                
                this.fpdraw(p,ctx);
            }            
        });
    }

    update(deltatime)
    {
        this.time += deltatime;

        this.plist.forEach( p => {

            if( p.active )
            {
                p.life += deltatime;
                if( p.life > p.lifetime )
                {
                    p.active = false;                    
                }
                else
                {
                    this.fpupdate(p, deltatime);
                }                
            }            
        });
    }
}

function fountain3( time, id, p )
{
    let g = -1.0;
    let v = 0.5;
    let rx = randrange(-v, v);
    let ry = v*3;
    let rz = randrange(-v, v);

    p.at( 0.0, 0.0, 0.0 ).v( rx, ry, rz ).a(0,g,0).r(4,1).lt(5);

    p.alpha = p.alpha0 = 1.0;
    p.alpha1 = 0.0;

    p.col( `hsl(${  time*100 }, 100%, 50%)` );
}