class Particle
{
    constructor( )
    {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.oax = 0;
        this.oay = 0;
        this.lifetime = 1;
        this.life = 0;
        this.radius = 4;
        this.active = false;
        this.color = `rgb(255,255,255)`;
    }

    at( x, y )
    {
        this.x = x;
        this.y = y;
        return this;
    }
    v( vx, vy )
    {
        this.vx = vx;
        this.vy = vy;
        return this;
    }
    a( ax, ay )
    {
        this.ax = ax;
        this.ay = ay;
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
        return this;
    }
}

class ParticleSytem
{
    constructor( pcount )
    {
        this.plist = [];
        this.time = 0;
        this.pid = 0;

        for( var i=0; i < pcount; i++ )
            this.plist.push( new Particle() )
       
        this.fpemit = ( time, id, p ) => {

        };
        this.fpdeath = ( p ) => {

        };
        this.fpupdate = ( p, deltatime ) => {
            p.vx += p.ax * deltatime;
            p.vy += p.ay * deltatime;
            p.x += p.vx * deltatime;
            p.y += p.vy * deltatime;            
        };
        this.fpdraw = ( p, ctx ) => {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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
                    this.fpdeath(p);
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