
// ── AUDIO ──
let audioCtx, osc, gainNode, soundOn = false;
function toggleSound() {
  soundOn = !soundOn;
  document.getElementById('btn-sound').textContent = soundOn ? '🔊 Sound On' : '🔇 Sound Off';
  document.getElementById('btn-sound').style.color = soundOn ? 'var(--green)' : 'var(--text)';
  if(soundOn) initAudio();
}
function initAudio() {
  if(!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0;
    osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 80;
    osc.connect(gainNode);
    osc.start();
  }
  if(audioCtx.state === 'suspended') audioCtx.resume();
}
function playMillSnd(play) {
  if(!soundOn || !audioCtx) return;
  gainNode.gain.setTargetAtTime(play ? 0.2 : 0, audioCtx.currentTime, 0.1);
}
function playIndexSnd() {
  if(!soundOn || !audioCtx) return;
  let o = audioCtx.createOscillator(); o.type='square';
  o.frequency.setValueAtTime(800, audioCtx.currentTime);
  o.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime+0.05);
  let g = audioCtx.createGain(); g.gain.value = 0.5;
  g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime+0.05);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(); o.stop(audioCtx.currentTime+0.1);
}

// ── TABS ──
function switchTab(t) {
  document.getElementById('tab-setup').className = 'tab-btn' + (t==='setup'?' active':'');
  document.getElementById('tab-theory').className = 'tab-btn' + (t==='theory'?' active':'');
  document.getElementById('panel-setup').style.display = t==='setup'?'block':'none';
  document.getElementById('panel-theory').style.display = t==='theory'?'block':'none';
}

// ── STATE ──
let state = {
  step: 0,
  z: 24, m: 2, mat: 'Mild Steel',
  pcd:0, od:0, add:0, ded:0, dep:0, cutNo:0,
  rpm:0, feedRate:0, liveMode:'Idle',
  idxWhole:0, idxFrac:0, idxRing:0, idxHoles:0,
  teethCut:0, animating:false, speed:1,
  gearComplete:false
};

const STEPS = [
  {title:'Enter Parameters', icon:'param', desc:'Set teeth count, module and material. Values auto-calculate.'},
  {title:'Mount Gear Blank', icon:'mount', desc:'Blank is mounted between indexing head and tailstock centers.'},
  {title:'Select Cutter', icon:'cutter', desc:'Choose the correct involute cutter number for your tooth count.'},
  {title:'Set Depth of Cut', icon:'depth', desc:'Dial in full tooth depth = 2.25 × m. Knee raises to position.'},
  {title:'First Pass', icon:'cut', desc:'Cutter rotates. Table feeds. First tooth slot is machined.'},
  {title:'Index Workpiece', icon:'index', desc:'Crank handle turns by 40/z. Index pin steps through holes.'},
  {title:'Repeat Cuts', icon:'repeat', desc:'Automated loop cuts all remaining teeth one by one.'},
  {title:'Complete', icon:'done', desc:'All teeth machined. Gear is complete. Review specifications.'}
];

const BS_PLATES = [15,16,17,18,19,20,21,23,27,29,31,33,37,39,41,43,47,49];

function bestPlate(num, den) {
  if (den === 0) return {ring:1,holes:0};
  let best = null, bestErr = Infinity;
  for (let ring of BS_PLATES) {
    let holes = Math.round(num * ring / den);
    if (holes === 0) continue;
    let err = Math.abs(holes/ring - num/den);
    if (err < bestErr) { bestErr = err; best = {ring, holes}; }
  }
  return best || {ring:18, holes:Math.round(18*num/den)};
}

function getCutterNo(z) {
  if (z >= 135) return 1; if (z >= 55) return 2; if (z >= 35) return 3;
  if (z >= 26) return 4; if (z >= 21) return 5; if (z >= 17) return 6;
  if (z >= 14) return 7; return 8;
}

function compute() {
  let z = state.z, m = state.m;
  state.pcd = m*z; state.od = m*(z+2);
  state.add = m; state.ded = 1.25*m; state.dep = 2.25*m;
  state.cutNo = getCutterNo(z);
  let idx = 40/z; state.idxWhole = Math.floor(idx);
  let frac = idx - state.idxWhole;
  let num = Math.round(frac*1000), den = 1000, g = gcd(num, den);
  num /= g; den /= g;
  if (den === 1) { state.idxHoles = 0; state.idxRing = 1; }
  else { let p = bestPlate(num, den); state.idxRing = p.ring; state.idxHoles = p.holes; }
}

function gcd(a,b){ return b===0?a:gcd(b,a%b); }

function updateCalc() {
  let z = parseInt(document.getElementById('inp-z').value)||0;
  let m = parseFloat(document.getElementById('inp-m').value)||0;
  state.z = z; state.m = m; state.mat = document.getElementById('inp-mat').value;
  document.getElementById('warn-z').style.display = (z > 0 && z < 12) ? '' : 'none';

  if (!z || !m) {
    ['c-pcd','c-od','c-dep','c-cut'].forEach(id => document.getElementById(id).textContent = '—');
    return;
  }
  compute();
  document.getElementById('c-pcd').textContent = state.pcd.toFixed(2)+' mm';
  document.getElementById('c-od').textContent = state.od.toFixed(2)+' mm';
  document.getElementById('c-dep').textContent = state.dep.toFixed(2)+' mm';
  document.getElementById('c-cut').innerHTML = `<span class="cutter-badge">No. ${state.cutNo}</span>`;

  let idxStr = state.idxWhole > 0 ? `${state.idxWhole} full turn${state.idxWhole>1?'s':''} + ` : '';
  let holeStr = state.idxHoles > 0 ? `${state.idxHoles}/${state.idxRing} holes` : 'exact';
  let plateStr = state.idxHoles > 0 ? `Use ${state.idxRing}-hole ring, advance ${state.idxHoles} holes` : 'Exact full turns';
  document.getElementById('idx-text').innerHTML = `<b class="idx-formula">40 ÷ ${z} = ${(40/z).toFixed(4)} turns/tooth</b><br><br><span class="idx-val">${idxStr}${holeStr}</span><br><br>${plateStr}`;

  // Advisor logic
  let matParams = { 'Mild Steel': { v: 25, feed: 0.08 }, 'Cast Iron': { v: 20, feed: 0.1 }, 'Brass': { v: 45, feed: 0.12 }, 'Aluminium': { v: 80, feed: 0.15 } };
  let p = matParams[state.mat] || matParams['Mild Steel']; let cd = 60 + state.m * 5; 
  let rpm = Math.round((p.v * 1000) / (Math.PI * cd)); let feedRate = Math.round(rpm * p.feed * state.cutNo);
  state.rpm = rpm; state.feedRate = feedRate;
  document.getElementById('advisor-text').innerHTML = `Spindle: <b>${rpm} RPM</b><br>Table Feed: <b>${feedRate} mm/min</b><br>Speed V: <b>${p.v} m/min</b>`;
}

['inp-z','inp-m','inp-mat'].forEach(id => document.getElementById(id).addEventListener('input', updateCalc));

// ── SVG MACHINE ──
const svg = document.getElementById('machine-svg');
function mkEl(tag, attrs, parent) {
  let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (let [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
  if (parent) parent.appendChild(el); return el;
}
function mkRect(x,y,w,h,fill,rx,parent,extra={}) { return mkEl('rect',{x,y,width:w,height:h,fill,rx:rx||0,...extra},parent); }

let machineGroup, blankGroup, tableGroup, cutterGroup, crankGroup, chipGroup;
let cutterAngle = 0, cutterAnim = null, tableX = 0, tableFeedAnim = null, crankAngle = 0;
let coolantTimer = null;

const liveGraph = {
  canvas: null,
  ctx: null,
  data: Array(70).fill(0),
  timer: null,
  lastTime: 0,
  lastTableX: 0,
  lastCrank: 0,
  lastLoad: 0
};

function setLiveMode(mode) {
  state.liveMode = mode;
  document.getElementById('live-mode').textContent = mode;
}

function initLiveGraph() {
  liveGraph.canvas = document.getElementById('live-graph');
  liveGraph.ctx = liveGraph.canvas.getContext('2d');
  if(liveGraph.timer) clearInterval(liveGraph.timer);
  liveGraph.timer = setInterval(sampleLiveGraph, 120);
  drawLiveGraph();
}

function sampleLiveGraph() {
  let now = performance.now();
  if(!liveGraph.lastTime) liveGraph.lastTime = now;
  let dt = Math.max(now - liveGraph.lastTime, 1);
  liveGraph.lastTime = now;

  let dTable = Math.abs(tableX - liveGraph.lastTableX);
  let dCrank = Math.abs(crankAngle - liveGraph.lastCrank);
  liveGraph.lastTableX = tableX;
  liveGraph.lastCrank = crankAngle;

  let spin = cutterAnim ? 52 + Math.abs(Math.sin(cutterAngle * Math.PI / 180)) * 22 : 4;
  let feed = Math.min(22, (dTable / dt) * 380);
  let index = Math.min(26, (dCrank / dt) * 18);
  let jitter = (Math.random() - 0.5) * (cutterAnim ? 8 : 2);
  let load = Math.max(0, Math.min(100, spin + feed + index + jitter));
  liveGraph.lastLoad = load;

  liveGraph.data.push(load);
  if(liveGraph.data.length > 70) liveGraph.data.shift();

  document.getElementById('live-load').textContent = `${Math.round(load)}%`;
  document.getElementById('live-rpm').textContent = cutterAnim ? state.rpm : 0;
  drawLiveGraph();
}

function drawLiveGraph() {
  let ctx = liveGraph.ctx;
  if(!ctx) return;
  let w = liveGraph.canvas.width;
  let h = liveGraph.canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0a0f1c';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(139,148,158,0.25)';
  ctx.lineWidth = 1;
  for(let i=1;i<=4;i++) {
    let y = (h/5)*i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  let grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(249,115,22,0.65)');
  grad.addColorStop(1, 'rgba(249,115,22,0.03)');

  ctx.beginPath();
  liveGraph.data.forEach((v, i) => {
    let x = (i / (liveGraph.data.length - 1)) * w;
    let y = h - (v / 100) * (h - 4) - 2;
    if(i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  liveGraph.data.forEach((v, i) => {
    let x = (i / (liveGraph.data.length - 1)) * w;
    let y = h - (v / 100) * (h - 4) - 2;
    if(i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#22c55e';
  ctx.fillRect(w - 3, h - (liveGraph.lastLoad / 100) * (h - 4) - 4, 3, 3);
}

function buildMachine() {
  svg.innerHTML = '';
  mkRect(0,0,800,500,'#020a18',0,svg);

  // Subtle starfield to mimic the reference atmosphere.
  for(let i=0;i<95;i++) {
    let x = Math.random()*800;
    let y = Math.random()*250;
    let r = Math.random()*1.2 + 0.2;
    mkEl('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(2),fill:'#8fd0ff',opacity:(Math.random()*0.45+0.15).toFixed(2)},svg);
  }

  // Back glow to pull focus toward the machine center.
  mkEl('ellipse',{cx:390,cy:220,rx:220,ry:150,fill:'#1c3f74',opacity:'0.18'},svg);
  mkEl('ellipse',{cx:390,cy:220,rx:150,ry:95,fill:'#5eb8ff',opacity:'0.08'},svg);

  // Floor plane and perspective grid.
  mkEl('polygon',{points:'0,500 800,500 800,355 0,355',fill:'#152a49'},svg);
  mkEl('polygon',{points:'0,500 800,500 800,340 0,340',fill:'#1b3b62',opacity:'0.45'},svg);
  for(let i=0;i<17;i++) {
    let y = 355 + i*10;
    mkEl('line',{x1:0,y1:y,x2:800,y2:y,stroke:'#2d5f8e',strokeWidth:'1',opacity:'0.25'},svg);
  }
  for(let i=0;i<22;i++) {
    let x = i*40;
    mkEl('line',{x1:x,y1:355,x2:x-155,y2:500,stroke:'#2d5f8e',strokeWidth:'1',opacity:'0.2'},svg);
  }

  // Machine base plinth.
  mkEl('polygon',{points:'240,468 555,468 590,500 205,500',fill:'#0e1e37'},svg);
  mkEl('polygon',{points:'255,450 545,450 575,468 240,468',fill:'#2a4670'},svg);

  // Main machine body (column + knee + overarm) styled like reference image 2.
  mkRect(338,92,128,280,'#1f315b',6,svg);
  mkRect(352,92,88,280,'#3a6a94',4,svg);
  mkRect(466,98,10,272,'#142347',2,svg);
  mkRect(220,92,215,16,'#3f5d86',4,svg);
  mkRect(222,108,208,12,'#2a4369',3,svg);
  mkRect(415,108,8,14,'#7da8d6',2,svg);
  mkRect(225,120,18,80,'#243a60',3,svg);

  // Worktable and saddle are animated as tableGroup.
  tableGroup = mkEl('g',{id:'tableGroup'},svg);
  mkRect(100,340,560,30,'#304d79',5,tableGroup);
  mkRect(98,366,564,20,'#203a60',4,tableGroup);
  mkRect(130,330,500,14,'#5f7a99',3,tableGroup);
  mkRect(128,344,504,8,'#3d5779',2,tableGroup);
  mkRect(280,372,190,16,'#1b2f51',2,tableGroup);

  // T-slot hints.
  for(let i=0;i<8;i++) mkRect(150+i*58,332,6,12,'#27456c',1,tableGroup);

  // Indexing head block and spindle nose.
  mkRect(120,284,112,54,'#223d67',6,tableGroup);
  mkRect(130,276,90,14,'#2b4b77',4,tableGroup);
  mkEl('ellipse',{cx:175,cy:312,rx:30,ry:28,fill:'#0f2850',stroke:'#3e7fc1',strokeWidth:2},tableGroup);
  mkEl('ellipse',{cx:175,cy:312,rx:20,ry:20,fill:'#10223f',stroke:'#2f5d96',strokeWidth:1.5},tableGroup);
  mkEl('circle',{cx:175,cy:312,r:4,fill:'#a2b1c5'},tableGroup);

  // Tailstock.
  mkRect(515,284,110,54,'#223d67',6,tableGroup);
  mkRect(522,276,94,14,'#2b4b77',4,tableGroup);
  mkEl('ellipse',{cx:570,cy:312,rx:25,ry:24,fill:'#112b52',stroke:'#3a73ad',strokeWidth:2},tableGroup);
  mkRect(545,309,36,6,'#6f9ecf',2,tableGroup);
  mkEl('circle',{cx:570,cy:312,r:3,fill:'#a2b1c5'},tableGroup);
  mkEl('circle',{cx:287,cy:388,r:10,fill:'none',stroke:'#7fa8d3',strokeWidth:'2',opacity:'0.6'},svg);
  mkEl('circle',{cx:520,cy:388,r:10,fill:'none',stroke:'#7fa8d3',strokeWidth:'2',opacity:'0.6'},svg);
  mkEl('line',{x1:287,y1:388,x2:287,y2:381,stroke:'#7fa8d3',strokeWidth:'1.2',opacity:'0.6'},svg);
  mkEl('line',{x1:520,y1:388,x2:520,y2:381,stroke:'#7fa8d3',strokeWidth:'1.2',opacity:'0.6'},svg);

  // Centers axis.
  mkEl('line',{x1:178,y1:312,x2:546,y2:312,stroke:'#4b9cf1',strokeWidth:1.5,opacity:'0.8'},tableGroup);

  // Indexing crank (animated).
  crankGroup = mkEl('g',{id:'crankGroup',transform:'translate(136,312)'},tableGroup);
  mkRect(-2,-22,4,22,'#8aa2bc',2,crankGroup);
  mkEl('circle',{cx:0,cy:-23,r:6,fill:'#ff8b2d',stroke:'#ea580c',strokeWidth:1.5},crankGroup);
  mkEl('circle',{cx:0,cy:0,r:4,fill:'#40679a',stroke:'#9db4ce',strokeWidth:1},crankGroup);
  mkEl('ellipse',{cx:0,cy:0,rx:8,ry:20,fill:'none',stroke:'#4e8dd3',strokeWidth:1.6,opacity:'0.8'},tableGroup);

  // Blank remains on the same machining centerline for existing animation logic.
  blankGroup = mkEl('g',{id:'blankGroup',transform:'translate(360,315)'},tableGroup);
  drawBlank(blankGroup, 0);

  // Arbor and spindle zone.
  mkEl('line',{x1:248,y1:124,x2:640,y2:124,stroke:'#98a8c2',strokeWidth:4},svg);
  mkEl('line',{x1:248,y1:124,x2:640,y2:124,stroke:'#d4dce6',strokeWidth:1.5,opacity:'0.9'},svg);
  mkRect(286,124,28,42,'#27456f',3,svg);
  mkRect(275,114,50,14,'#365683',3,svg);
  mkRect(247,120,12,8,'#7fa8d3',2,svg);

  cutterGroup = mkEl('g',{id:'cutterGroup',transform:'translate(300,124)'},svg);
  drawCutter(cutterGroup);
  cutterGroup.querySelectorAll('circle')[0].setAttribute('fill','#b58b2d');
  cutterGroup.querySelectorAll('circle')[0].setAttribute('stroke','#e8cf7c');

  // Coolant nozzle near cutter.
  mkEl('line',{x1:318,y1:145,x2:296,y2:166,stroke:'#4a7cb2',strokeWidth:3},svg);
  mkEl('circle',{cx:294,cy:169,r:4,fill:'#1f3b64',stroke:'#4a7cb2',strokeWidth:1.5},svg);

  chipGroup = mkEl('g',{id:'chipGroup'},svg);

  // Neon component labels similar to the reference style.
  addCallout(svg, 236, 78, 'Arbor Support', 250, 124);
  addCallout(svg, 362, 56, 'Overarm', 385, 100);
  addCallout(svg, 500, 150, 'Column', 444, 206);
  addCallout(svg, 202, 306, 'Indexing Head', 176, 304);
  addCallout(svg, 288, 370, 'Saddle', 302, 365);
  addCallout(svg, 430, 378, 'Table (worktable)', 468, 344);
  addCallout(svg, 356, 332, 'Gear Blank', 360, 315);
  addCallout(svg, 355, 276, 'Involute Gear Cutter', 300, 124);
  addCallout(svg, 338, 204, 'Spindle', 287, 144);
  addCallout(svg, 118, 398, 'Knee', 286, 388);
  addCallout(svg, 182, 456, 'Base', 300, 470);

  // Coolant animation
  if(coolantTimer) clearInterval(coolantTimer);
  coolantTimer = setInterval(()=>{
    if(state.animating && state.step > 3 && state.step < 7) {
      let d = mkEl('line',{x1:294,y1:170,x2:294,y2:175,stroke:'#3b82f6',strokeWidth:1.5},svg);
      let y=170, id=setInterval(()=>{ y+=2; d.setAttribute('y1',y); d.setAttribute('y2',y+5); if(y>205){clearInterval(id);d.remove();} },16);
    }
  },200);

  addTooltip(tableGroup,'Table + saddle assembly');
  addTooltip(cutterGroup,'Involute Gear Form Cutter (No. '+state.cutNo+')');
}
function addLabel(parent, x, y, text, fill) { let t = mkEl('text',{x,y,fill,'font-size':'9',fontFamily:'Courier New','text-anchor':'middle'},parent); t.textContent = text; }
function addCallout(parent, x, y, text, tx, ty) {
  let w = Math.max(72, text.length * 6.7);
  if(typeof tx === 'number' && typeof ty === 'number') {
    mkEl('line',{x1:x,y1:y+10,x2:tx,y2:ty,stroke:'#5be8ff',strokeWidth:'1.1',opacity:'0.75'},parent);
    mkEl('circle',{cx:tx,cy:ty,r:2.2,fill:'#79f0ff',opacity:'0.9'},parent);
  }
  mkRect(x - w/2, y - 11, w, 20, '#03223a', 4, parent, {stroke:'#00dbff','stroke-width':'1.2'});
  mkRect(x - w/2 + 2, y - 9, w - 4, 16, 'none', 3, parent, {stroke:'#77efff','stroke-opacity':'0.35','stroke-width':'1'});
  let t = mkEl('text',{x,y:y+3,fill:'#8ef7ff','font-size':'9',fontFamily:'Courier New','font-weight':'700','text-anchor':'middle'},parent);
  t.textContent = text;
}
function addTooltip(el, text) { el.style.cursor='default'; el.addEventListener('mouseenter',e=>showTooltip(e,text)); el.addEventListener('mousemove',e=>moveTooltip(e)); el.addEventListener('mouseleave',hideTooltip); }
const tooltip = document.getElementById('tooltip');
function showTooltip(e,t){tooltip.textContent=t;tooltip.style.opacity=1;moveTooltip(e)}
function moveTooltip(e){tooltip.style.left=(e.clientX+12)+'px';tooltip.style.top=(e.clientY-24)+'px'}
function hideTooltip(){tooltip.style.opacity=0}

function drawCutter(g) {
  g.innerHTML = ''; let r = 35, teeth = 12;
  mkEl('circle',{cx:0,cy:0,r:r,fill:'#243555',stroke:'#3d6b9f',strokeWidth:2},g);
  mkEl('circle',{cx:0,cy:0,r:8,fill:'#0d1117',stroke:'#8b949e',strokeWidth:1.5},g);
  for(let i=0;i<teeth;i++) {
    let a = (i/teeth)*Math.PI*2;
    let b1=a-0.18, b2=a+0.18;
    mkEl('path',{d:`M${Math.cos(b1)*r},${Math.sin(b1)*r} L${Math.cos(a)*(r+8)},${Math.sin(a)*(r+8)} L${Math.cos(b2)*r},${Math.sin(b2)*r}`,fill:'#8b949e',stroke:'#c0c8d8',strokeWidth:.5},g);
  }
}

function drawBlank(g, teethCut) {
  g.innerHTML = ''; let z = state.z, R = 38;
  if(teethCut===0) {
    mkEl('ellipse',{cx:0,cy:0,rx:R,ry:14,fill:'#8b949e',stroke:'#c0c8d8',strokeWidth:1.5},g);
    mkEl('rect',{x:-R,y:-14,width:R*2,height:28,fill:'#8b949e'},g);
    mkEl('ellipse',{cx:0,cy:0,rx:R,ry:14,fill:'#a0aab8',stroke:'#c0c8d8',strokeWidth:1.5},g);
    return;
  }
  mkEl('ellipse',{cx:0,cy:0,rx:R,ry:12,fill:'#7a8494',stroke:'#aab0bc',strokeWidth:1.5},g);
  mkEl('rect',{x:-R,y:-12,width:R*2,height:24,fill:'#7a8494'},g);
  let pts = [];
  for(let i=0;i<=360;i++) {
    let a = (i/360)*Math.PI*2, slot=false;
    for(let k=0;k<teethCut;k++) {
      let sa = (k/z)*Math.PI*2, da = Math.abs(((a-sa+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(da < Math.PI/z * 0.8) { slot=true; break; }
    }
    let r = slot ? R*0.68 : R; pts.push([Math.cos(a)*r, Math.sin(a)*r]);
  }
  let pathD = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(2)+','+p[1].toFixed(2)).join(' ')+'Z';
  mkEl('path',{d:pathD,fill:'#a0aab8',stroke:'#c0c8d8',strokeWidth:1.2},g);
}

function spawnChips(mat) {
  let color = '#f97316';
  if(mat === 'Cast Iron') color = '#a0aab8';
  if(mat === 'Brass') color = '#eab308';
  if(mat === 'Aluminium') color = '#e5e7eb';
  chipGroup.innerHTML = '';
  for(let i=0;i<6;i++) {
    setTimeout(()=>{
      let chip = mkEl('polygon',{points:'0,-4 3,4 -3,4',fill:color,transform:`translate(312,${138+Math.random()*8})`},chipGroup);
      let vx = (Math.random()-0.3)*3, vy = Math.random()*3+1, op = 1, x=312, y=138;
      let id = setInterval(()=>{ x+=vx; y+=vy; vy+=.2; op-=.05; chip.setAttribute('transform',`translate(${x},${y}) rotate(${x*10})`); chip.setAttribute('opacity',op); if(op<=0){clearInterval(id);chip.remove()} },20);
    },i*60);
  }
}

function startCutterSpin() { playMillSnd(true); setLiveMode('Cutting'); if(cutterAnim) return; cutterAnim=setInterval(()=>{ cutterAngle+=4; cutterGroup.setAttribute('transform',`translate(300,124) rotate(${cutterAngle})`); },16); }
function stopCutterSpin() { playMillSnd(false); clearInterval(cutterAnim); cutterAnim=null; setLiveMode('Idle'); }

function animateTableFeed(cb) {
  setLiveMode('Feeding');
  let start=0, end=-30, dur=state.speed===0?0:1800/state.speed, t0=performance.now();
  if(dur===0){ setTableX(end); if(cb)cb(); return; }
  function tick(t){ let prog=Math.min((t-t0)/dur,1); setTableX(start+(end-start)*prog); if(prog<1) requestAnimationFrame(tick); else { if(cb)cb(); } }
  requestAnimationFrame(tick);
}
function resetTableFeed(cb) {
  setLiveMode('Return');
  let start=-30, end=0, dur=state.speed===0?0:600/state.speed, t0=performance.now();
  if(dur===0){ setTableX(end); if(cb)cb(); return; }
  function tick(t){ let prog=Math.min((t-t0)/dur,1); setTableX(start+(end-start)*prog); if(prog<1) requestAnimationFrame(tick); else { setLiveMode('Idle'); if(cb)cb(); } }
  requestAnimationFrame(tick);
}
function setTableX(x){ tableX=x; tableGroup.setAttribute('transform',`translate(${x},0)`); }

function animateCrank(turns, cb) {
  setLiveMode('Indexing');
  let totalAngle=turns*360, dur=state.speed===0?0:Math.max(400,Math.min(1800,totalAngle*5))/state.speed;
  if(dur===0){ crankAngle+=totalAngle; crankGroup.setAttribute('transform',`translate(136,312) rotate(${crankAngle})`); playIndexSnd(); setLiveMode('Idle'); if(cb)cb(); return; }
  let start=crankAngle, end=crankAngle+totalAngle, t0=performance.now();
  function tick(t){
    let prog=Math.min((t-t0)/dur,1); crankAngle=start+(end-start)*prog;
    crankGroup.setAttribute('transform',`translate(136,312) rotate(${crankAngle})`);
    if(prog<1) requestAnimationFrame(tick); else { playIndexSnd(); setLiveMode('Idle'); if(cb)cb(); }
  }
  requestAnimationFrame(tick);
}

function animateKneeRaise(cb) {
  let y=360, target=350, dur=state.speed===0?0:600/state.speed;
  if(dur===0){ cb&&cb(); return; }
  let t0=performance.now();
  function tick(t){ let prog=Math.min((t-t0)/dur,1); tableGroup.setAttribute('transform',`translate(${tableX},${(y+(target-y)*prog)-360})`); if(prog<1) requestAnimationFrame(tick); else { tableGroup.setAttribute('transform',`translate(${tableX},0)`); cb&&cb(); } }
  requestAnimationFrame(tick);
}

// ── UI ──
function buildStepUI() {
  let c = document.getElementById('steps-container'); c.innerHTML = '';
  STEPS.forEach((s,i)=>{
    let div = document.createElement('div'); div.className = 'step-item '+(i===0?'active':i<state.step?'done':'inactive'); div.id = 'step-'+i;
    div.innerHTML = `<div class="step-num">STEP ${i+1} of ${STEPS.length}</div><div class="step-title">${s.title}${i<state.step?'<span class="done-mark">✓</span>':''}</div><div class="step-desc">${s.desc}</div>`;
    c.appendChild(div);
  });
}

function updateStepUI() {
  STEPS.forEach((_,i)=>{
    let el = document.getElementById('step-'+i); if(!el) return;
    el.className='step-item '+(i===state.step?'active':i<state.step?'done':'inactive');
    let title = el.querySelector('.step-title'); title.innerHTML = STEPS[i].title+(i<state.step?'<span class="done-mark">✓</span>':'');
  });
  let el=document.getElementById('step-'+state.step); if(el) el.scrollIntoView({behavior:'smooth',block:'nearest'});
  document.getElementById('pbar').style.width=(state.step/STEPS.length*100).toFixed(0)+'%';
  document.getElementById('step-label').textContent=`Step ${state.step} / ${STEPS.length}`;
}

async function nextStep() {
  if(state.animating) return; state.animating=true;
  let nextBtn = document.getElementById('btn-next'); nextBtn.textContent = '...'; nextBtn.disabled=true;

  if(state.step===0) {
    if(!state.z) { alert('Invalid parameters.'); state.animating=false; nextBtn.textContent='Begin Simulation'; nextBtn.disabled=false; return; }
    compute(); state.step=1; updateStepUI();
    document.getElementById('inp-z').disabled=true; document.getElementById('inp-m').disabled=true;
    state.animating=false; nextBtn.textContent='Mount Blank →'; nextBtn.disabled=false;
  } else if(state.step===1) {
    blankGroup.setAttribute('transform','translate(360,200)');
    await new Promise(r=>{let t0=performance.now();function tk(t){let p=Math.min((t-t0)/(600/Math.max(state.speed,1)),1);blankGroup.setAttribute('transform',`translate(360,${200+115*p})`);if(p<1)requestAnimationFrame(tk);else r();}requestAnimationFrame(tk);});
    state.step=2; updateStepUI(); state.animating=false; nextBtn.textContent='Select Cutter →'; nextBtn.disabled=false;
  } else if(state.step===2) {
    for(let i=0;i<3;i++){ await new Promise(r=>setTimeout(r,150/Math.max(state.speed,1))); cutterGroup.setAttribute('opacity','.4'); await new Promise(r=>setTimeout(r,150/Math.max(state.speed,1))); cutterGroup.setAttribute('opacity','1'); }
    state.step=3; updateStepUI(); state.animating=false; nextBtn.textContent='Set Depth →'; nextBtn.disabled=false;
  } else if(state.step===3) {
    await new Promise(r=>animateKneeRaise(r));
    state.step=4; updateStepUI(); state.animating=false; nextBtn.textContent='First Pass →'; nextBtn.disabled=false;
  } else if(state.step===4) {
    startCutterSpin(); await new Promise(r=>setTimeout(r,400/Math.max(state.speed,1))); spawnChips(state.mat);
    await new Promise(r=>animateTableFeed(r)); await new Promise(r=>setTimeout(r,200/Math.max(state.speed,1))); stopCutterSpin();
    state.teethCut=1; drawBlank(blankGroup, state.teethCut);
    await new Promise(r=>resetTableFeed(r));
    state.step=5; updateStepUI(); state.animating=false; nextBtn.textContent='Index →'; nextBtn.disabled=false;
  } else if(state.step===5) {
    await new Promise(r=>animateCrank(40/state.z,r));
    state.step=6; updateStepUI(); document.getElementById('speed-row').style.display='flex';
    document.getElementById('tooth-counter').style.display='block'; document.getElementById('tc-tot').textContent=state.z; document.getElementById('tc-cur').textContent=state.teethCut;
    state.animating=false; nextBtn.textContent='Cut All Teeth →'; nextBtn.disabled=false;
  } else if(state.step===6) {
    let rem = state.z - state.teethCut;
    for(let i=0;i<rem;i++){
      startCutterSpin(); spawnChips(state.mat); await new Promise(r=>animateTableFeed(r)); stopCutterSpin();
      state.teethCut++; drawBlank(blankGroup, state.teethCut); document.getElementById('tc-cur').textContent=state.teethCut;
      await new Promise(r=>resetTableFeed(r)); if(i<rem-1) await new Promise(r=>animateCrank(40/state.z,r));
      if(state.speed===0) await new Promise(r=>setTimeout(r,0));
    }
    document.getElementById('speed-row').style.display='none'; document.getElementById('tooth-counter').style.display='none';
    state.step=7; updateStepUI(); state.animating=false; nextBtn.textContent='Finalise →'; nextBtn.disabled=false;
  } else if(state.step===7) {
    setInterval(()=>{ blankGroup.setAttribute('transform',`translate(360,315) rotate(${(performance.now()/16)*0.3})`); },16);
    let o = document.getElementById('spec-overlay'); o.innerHTML = `<div class="spec-title">GEAR SPECIFICATION</div>
      <div class="spec-line"><span class="spec-key">M</span><span class="spec-val">${state.m}</span></div>
      <div class="spec-line"><span class="spec-key">Teeth</span><span class="spec-val">${state.z}</span></div>
      <div class="spec-line"><span class="spec-key">Depth</span><span class="spec-val">${state.dep.toFixed(2)} mm</span></div>
      <div class="spec-line"><span class="spec-key">Cutter No.</span><span class="spec-val">${state.cutNo}</span></div>`; o.classList.add('visible');
    state.step=8; state.gearComplete=true; updateStepUI(); document.getElementById('pbar').style.width='100%';
    document.getElementById('step-label').textContent='Complete!';
    state.animating=false; nextBtn.disabled=true; nextBtn.textContent='Done';
  }
}

function setSpeed(s) { state.speed = s; document.querySelectorAll('.speed-btn').forEach(b=>{ b.classList.toggle('active', parseInt(b.dataset.speed)===s || (s===0&&b.dataset.speed==='0')); }); }

function resetSim() {
  stopCutterSpin(); state.step=0; state.teethCut=0; state.animating=false; state.gearComplete=false;
  setLiveMode('Idle');
  liveGraph.data = Array(70).fill(0);
  liveGraph.lastLoad = 0;
  document.getElementById('live-load').textContent = '0%';
  document.getElementById('live-rpm').textContent = '0';
  drawLiveGraph();
  document.getElementById('inp-z').disabled=false; document.getElementById('inp-m').disabled=false;
  document.getElementById('speed-row').style.display='none'; document.getElementById('tooth-counter').style.display='none';
  document.getElementById('spec-overlay').classList.remove('visible');
  document.getElementById('pbar').style.width='0%'; document.getElementById('step-label').textContent='Step 0 / 8';
  let btnN = document.getElementById('btn-next'); btnN.textContent='Begin Simulation'; btnN.onclick=nextStep; btnN.disabled=false;
  buildMachine(); buildStepUI(); updateCalc();
}

updateCalc(); buildMachine(); buildStepUI(); initLiveGraph();

