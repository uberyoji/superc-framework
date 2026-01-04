function appInit() {
    if (APP_DATA.label === undefined) APP_DATA.label = 'DECOUPLED DATA';
    if (APP_DATA.labelSize === undefined) APP_DATA.labelSize = 40;
    if (APP_DATA.accentColor === undefined) APP_DATA.accentColor = '#ff9800';
    if (APP_DATA.accentAlpha === undefined) APP_DATA.accentAlpha = 1.0;
    if (APP_DATA.texPosX === undefined) APP_DATA.texPosX = 0;
    if (APP_DATA.texPosY === undefined) APP_DATA.texPosY = 0;
}

function appResize() {
    // Application resize logic
}

function appMouseDown(frameworkState) {
    // Triggered on mouse down (non-panning)
    APP_DATA.texPosX = frameworkState.mouseX;
    APP_DATA.texPosY = frameworkState.mouseY;
}

function appMouseUp(frameworkState) {
    // Triggered on mouse up (non-panning)
}

function appSetupUI() {
    addColorWithAlpha('Custom', 'Accent Color', APP_DATA.accentColor, APP_DATA.accentAlpha, (h, a) => {
        APP_DATA.accentColor = h;
        APP_DATA.accentAlpha = a;
    });
    addTextBox('Custom', 'Label Text', APP_DATA.label, v => {
        APP_DATA.label = v;
    });
    addNumberInput('Custom', 'Label Size', APP_DATA.labelSize, 10, 200, v => {
        APP_DATA.labelSize = v;
    });
}

function appDraw() {
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
}