let PS = new ParticleSytem(1024);

function appInit() {
    if (APP_DATA.turnOn === undefined) APP_DATA.turnOn = true;
    if (APP_DATA.accentColor === undefined) APP_DATA.accentColor = '#ff9800';
    if (APP_DATA.accentAlpha === undefined) APP_DATA.accentAlpha = 1.0;

    if (APP_DATA.accentRGBA === undefined)
        APP_DATA.accentRGBA = toRGBA(APP_DATA.accentColor, APP_DATA.accentAlpha);


    if (APP_DATA.lifetime_ratio === undefined)
        APP_DATA.lifetime_ratio = 1.2;
    if (APP_DATA.split_vel_ratio === undefined)
        APP_DATA.split_vel_ratio = 0.8;
    if (APP_DATA.radius_ratio === undefined)
        APP_DATA.radius_ratio = 0.8;
    if (APP_DATA.acc_ratio === undefined)
        APP_DATA.acc_ratio = 0.8;
    if (APP_DATA.split_angle === undefined)
        APP_DATA.split_angle = Math.PI/2;
    if (APP_DATA.split_count === undefined)
        APP_DATA.split_count = 2;
}


function appSetupUI() {
    addColorWithAlpha('Custom', 'Accent Color', APP_DATA.accentColor, APP_DATA.accentAlpha, (h, a) => {
        APP_DATA.accentColor = h;
        APP_DATA.accentAlpha = a;
        APP_DATA.accentRGBA = toRGBA(APP_DATA.accentColor, APP_DATA.accentAlpha);
    });

    addCheckbox('Custom', 'Turn On', APP_DATA.turnOn, v => APP_DATA.turnOn = v );

    addSlider('Custom', 'Lifetime ratio', 0.0, 2, APP_DATA.lifetime_ratio, 0.1, v => APP_DATA.lifetime_ratio = v);
    addSlider('Custom', 'Velocity ratio', 0.0, 2, APP_DATA.split_vel_ratio, 0.1, v => APP_DATA.split_vel_ratio = v);
    addSlider('Custom', 'Acceleration ratio', 0.0, 2, APP_DATA.acc_ratio, 0.1, v => APP_DATA.acc_ratio = v); 
    addSlider('Custom', 'Radius ratio', 0.1, 2, APP_DATA.radius_ratio, 0.1, v => APP_DATA.radius_ratio = v); 
    addSlider('Custom', 'Split Angle', 0, Math.PI, APP_DATA.split_angle, Math.PI/16, v => APP_DATA.split_angle = v); 
    addSlider('Custom', 'Split Count', 2, 5, APP_DATA.split_count, 1, v => APP_DATA.split_count = v); 
  
    /*
    addTextBox('Custom', 'Label Text', APP_DATA.label, v => {
        APP_DATA.label = v;
    });
    addNumberInput('Custom', 'Label Size', APP_DATA.labelSize, 10, 200, v => {
        APP_DATA.labelSize = v;
    });
    */
}

function appResize() {
    // Application resize logic
}

function appMouseDown(frameworkState) {
    // Triggered on mouse down (non-panning)
    APP_DATA.texPosX = frameworkState.mouseX;
    APP_DATA.texPosY = frameworkState.mouseY;

    let p = PS.emit();
    if(p!=null)
        p.at(frameworkState.mouseX,frameworkState.mouseY)
        .v(0,-150);
}

function appMouseUp(frameworkState) {
    // Triggered on mouse up (non-panning)
}

function appDraw() {
 
     const { ctx, mouseX, mouseY } = state;

    if( APP_DATA.turnOn )
        PS.emit();

    PS.update(state.dt);
    PS.draw(ctx);

    /*
    const { ctx, mouseX, mouseY } = state;
    const accent = toRGBA(APP_DATA.accentColor, APP_DATA.accentAlpha);
    ctx.fillStyle = accent;
    ctx.font = `700 ${APP_DATA.labelSize}px "Ubuntu Mono"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(APP_DATA.label, APP_DATA.texPosX, APP_DATA.texPosY);
    ctx.strokeStyle = accent;
    ctx.beginPath();
    ctx.arc(APP_DATA.texPosX, APP_DATA.texPosY, APP_DATA.labelSize * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    */
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function lob(start, end, amount )
{
    return start + (end - start) * Math.sin(amount*Math.PI);
}

function rotate( x, y, theta )
{
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    return { 
        x : x * c - y * s,
        y : x * s + y * c 
    }
}

PS.fpemit = split_emit;
PS.fpupdate = split_update;
PS.fpdeath = split_death;

function base_emit( time, pid, p )
{
    let a = Math.random() * Math.PI * 2;
    let dx = Math.cos(a);
    let dy = Math.sin(a);
    let v = Math.random() * 64;

    const g = 16;
    p.at(0,0).v(dx*v,-dy*v).a(0,g).lt(3).r(8,1).col(APP_DATA.accentRGBA);
}

function base_update( p, deltatime )     
{
    p.vx += p.ax * deltatime;
    p.vy += p.ay * deltatime;
    p.x += p.vx * deltatime;
    p.y += p.vy * deltatime;

    let liferatio = p.life/p.lifetime;
    
    p.radius = lerp( p.radius0, p.radius1, liferatio);
    p.alpha = lerp( p.alpha0, p.alpha1, liferatio);
};

function verlet_update( p, deltatime )
{
    const dt = deltatime;
    p.x += p.vx * dt + p.ax * (dt * dt * 0.5);
    p.y += p.vy * dt + p.ay * (dt * dt * 0.5);

    p.oax = p.ax;
    p.oay = p.ay;

    // todo apply some forces here 

    p.vx += (p.oax + p.ax) * (dt * 0.5);
    p.vy += (p.oay + p.ay) * (dt * 0.5);
}

function splitter( pp, cp, theta, i )
{
//    const lifetime_ratio = 1.2;
//    const split_vel_ratio = 0.8;
//    const radius_ratio = 0.8;
//    const vel = Math.sqrt(pp.vx*pp.vx+pp.vy*pp.vy) * split_vel_ratio;
    const acc = APP_DATA.acc_ratio; //512;

    let v = rotate( pp.vx, pp.vy, theta );

    let lifetime = pp.lifetime * APP_DATA.lifetime_ratio

    /*
    let a = Math.random() * Math.PI * 2;
    let v = { x: Math.cos(a) * vel, y: Math.sin(a) * vel };
    */
    cp.energy = pp.energy - 1;

    let ax = (i == 0 ?  v.y : -v.y);
    let ay = (i == 0 ? -v.x :  v.x);
    
    cp.at(pp.x,pp.y)
        .r(pp.radius * APP_DATA.radius_ratio, pp.radius * APP_DATA.radius_ratio )
        .v( v.x*APP_DATA.split_vel_ratio, v.y*APP_DATA.split_vel_ratio )
        .a( ax*acc, ay*acc)
        .lt( lifetime );
}

function split_death( p )
{
    const max_split = APP_DATA.split_count;

    if( p.energy > 0 ) {
        
        let a = -APP_DATA.split_angle / 2;
        let da = APP_DATA.split_angle / (APP_DATA.split_count-1);

        for( var i = 0; i < max_split; i++ ) {
            let cp = PS.emit();
            if( cp != null )
                splitter( p, cp, a, i );

            a += da;
        }
    }
}

function split_update( p, deltatime )
{
    base_update(p,deltatime);
}; 

// split particles
function split_emit( time, pid, p )
{
    const lifetime = 0.5;
    const vel = 128;
    const acc = 0; //512;
    let a = Math.random() * Math.PI * 2;
    let dx = Math.cos(a);
    let dy = Math.sin(a);

    p.energy = 6;
    p.at(0,0)
        .v(dx*vel,dy*vel)
        .a(-dy*acc,dx*acc)
        .lt(lifetime)
        .r( p.energy, p.energy)
        .col(APP_DATA.accentRGBA);
}