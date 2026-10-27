
const S=[
{id:'rain',n:'Gentle Rain',s:'A slow grey afternoon on glass.',t:'Focus',a:'#8FD3F4',b:'#0B2536',f:'#133B52',hz:'1/f noise',r:['thunder','brown','stream']},
{id:'ocean',n:'Deep Ocean Swell',s:'Long surf, folding onto cold sand.',t:'Meditation',a:'#5FD4E0',b:'#06303F',f:'#0A4A5E',hz:'0.09 Hz swell',r:['stream','breeze','bowls']},
{id:'forest',n:'Whispering Forest',s:'Pine air, distant birds, no hurry.',t:'Focus',a:'#7FE0C2',b:'#082E2E',f:'#0E4443',hz:'birdsong + wind',r:['breeze','stream','meadow']},
{id:'fire',n:'Hearth Fireplace',s:'Birch embers and a settling log.',t:'Unwind',a:'#A8B9F5',b:'#141F3D',f:'#1F3059',hz:'crackle bed',r:['rain','brown','meadow']},
{id:'breeze',n:'Highland Breeze',s:'Thin cold air over open ridgeline.',t:'Focus',a:'#BDE6EE',b:'#0F3340',f:'#17495A',hz:'drifting band',r:['forest','ocean','rain']},
{id:'meadow',n:'Midnight Meadow',s:'Crickets under a very large sky.',t:'Deep Sleep',a:'#B3A6F2',b:'#1A1840',f:'#272663',hz:'4.3 kHz crickets',r:['brown','rain','bowls']},
{id:'bowls',n:'Zen Singing Bowls',s:'Brass partials, left to decay.',t:'Meditation',a:'#A7D8F5',b:'#0E2A4A',f:'#183E6B',hz:'432 Hz',r:['ocean','meadow','breeze']},
{id:'stream',n:'Mountain Stream',s:'Cold water, small stones, clear air.',t:'Calm',a:'#5ED6C8',b:'#06302F',f:'#0A4745',hz:'broadband flow',r:['forest','ocean','rain']},
{id:'brown',n:'Velvet Brown Noise',s:'A low, even hum with no edges.',t:'Deep Sleep',a:'#9FB4D9',b:'#171F3A',f:'#252F55',hz:'1/f² noise',r:['rain','meadow','fire']},
{id:'thunder',n:'Distant Thunder',s:'A storm rolling somewhere else.',t:'Deep Sleep',a:'#8FA8F0',b:'#141B45',f:'#1F2A68',hz:'sub-bass rumble',r:['rain','brown','ocean']},
{id:'snow',n:'Soft Snowfall',s:'Quiet white flakes settling over a silent valley.',t:'Deep Sleep',a:'#CFE3F7',b:'#162A44',f:'#223F63',hz:'soft 1/f hush',r:['haze','cocoon','musicbox']},
{id:'lake',n:'Moonlit Lake',s:'Slow ripples against a still, dark shoreline.',t:'Unwind',a:'#86B7E8',b:'#0D1F3F',f:'#16305E',hz:'0.22 Hz lapping',r:['tide','chimes','stream']},
{id:'cocoon',n:'Warm Cocoon Hum',s:'A low pulse, like being held in the dark.',t:'Deep Sleep',a:'#B4C6FA',b:'#17234A',f:'#243670',hz:'55 Hz · 66 bpm pulse',r:['brown','snow','om']},
{id:'chimes',n:'Gentle Wind Chimes',s:'Soft metal notes drifting in from the porch.',t:'Calm',a:'#C9EAF5',b:'#13304A',f:'#1D4668',hz:'pentatonic chimes',r:['breeze','musicbox','lake']},
{id:'musicbox',n:'Music Box Lullaby',s:'A small slow melody, played just for you.',t:'Deep Sleep',a:'#C3C9FA',b:'#1E1E4A',f:'#2E2E70',hz:'lullaby in C',r:['cloud','snow','cocoon']},
{id:'drizzle',n:'Window Drizzle',s:'Light rain tapping glass in a warm room.',t:'Unwind',a:'#9CC4D8',b:'#122B38',f:'#1B4152',hz:'fine rain + drips',r:['rain','fire','lake']},
{id:'cloud',n:'Cloud Drift',s:'A slow, warm pad that never quite resolves.',t:'Calm',a:'#C2CFFB',b:'#1A2250',f:'#27346F',hz:'C major pad',r:['om','musicbox','meadow']},
{id:'haze',n:'Pink Noise Haze',s:'Soft, even static that smooths the room out.',t:'Focus',a:'#BFD0D8',b:'#162630',f:'#223A47',hz:'pink noise',r:['brown','rain','snow']},
{id:'om',n:'Night Drone',s:'A deep harmonic hum around 136 Hz.',t:'Meditation',a:'#B8A9F5',b:'#1F1647',f:'#2F2268',hz:'136.1 Hz Om',r:['bowls','cloud','tide']},
{id:'tide',n:'Breathing Tide',s:'One slow swell every twelve seconds. Breathe with it.',t:'Meditation',a:'#6FD0E0',b:'#082638',f:'#0D3C58',hz:'5 breaths per minute',r:['ocean','om','lake']},
{id:'endurance',n:'Endurance Drift',s:'A slow organ-like swell, drifting through open space.',t:'Cinematic',a:'#9CC8FF',b:'#0A1530',f:'#12254D',hz:'space organ drone',r:['gargantua','orbit','strings']},
{id:'gargantua',n:'Gargantua Hum',s:'A deep gravitational hum around a distant black hole.',t:'Cinematic',a:'#8FE3FF',b:'#06182A',f:'#0C2A47',hz:'32 Hz sub drone',r:['endurance','cabin','clock']},
{id:'orbit',n:'Orbital Silence',s:'Near silence, a faint radio blip, and the curve of a planet.',t:'Cinematic',a:'#B7C7FF',b:'#0E1738',f:'#182459',hz:'quiet pad + radio',r:['cabin','endurance','choir']},
{id:'choir',n:'Nebula Choir',s:'Layered voices made of light, rising and falling slowly.',t:'Cinematic',a:'#C2B5FF',b:'#1A1440',f:'#2A2168',hz:'choir pad',r:['strings','aurora','endurance']},
{id:'shire',n:'Green Hills Morning',s:'Birdsong, soft wind and an unhurried morning.',t:'Calm',a:'#8FE8C8',b:'#0A2D2B',f:'#114542',hz:'birds + wind',r:['forest','cascade','harp']},
{id:'cascade',n:'Elven Waterfall',s:'Water over stone, with distant bells in the mist.',t:'Calm',a:'#8EDCF0',b:'#08304A',f:'#0E4A6E',hz:'broadband fall',r:['stream','shire','chimes']},
{id:'dune',n:'Desert Dune Wind',s:'Moving sand across a vast, empty horizon.',t:'Cinematic',a:'#9DC1E8',b:'#14284A',f:'#1E3D6E',hz:'low wind + drone',r:['breeze','cello','orbit']},
{id:'biolum',n:'Glowing Forest',s:'Soft light moving between giant trees at night.',t:'Calm',a:'#7FF0D8',b:'#06302E',f:'#0B4A47',hz:'pad + water drops',r:['meadow','forest','aurora']},
{id:'neon',n:'Neon Rain City',s:'Rain on a night street, with a slow synth haze above.',t:'Focus',a:'#8AA9FF',b:'#10183F',f:'#1A2866',hz:'rain + synth pad',r:['rain','lofi','cafe']},
{id:'cafe',n:'Midnight Cafe Keys',s:'Soft electric piano chords, played slowly after closing.',t:'Focus',a:'#9FC4F5',b:'#0F2340',f:'#193764',hz:'warm chord loop',r:['lofi','piano','neon']},
{id:'lofi',n:'Lo-fi Vinyl Study',s:'Dusty vinyl crackle under gentle, sleepy chords.',t:'Focus',a:'#A8B6F0',b:'#171C45',f:'#242C6B',hz:'vinyl + chords',r:['cafe','haze','piano']},
{id:'train',n:'Night Train',s:'Steady wheels on rail, miles from anywhere.',t:'Deep Sleep',a:'#94B8DC',b:'#0F1F36',f:'#18314F',hz:'rail rhythm',r:['brown','drizzle','cabin']},
{id:'piano',n:'Quiet Piano Room',s:'Single notes left to ring in an empty room.',t:'Calm',a:'#B9D3F7',b:'#112642',f:'#1B3C66',hz:'soft piano notes',r:['harp','cafe','musicbox']},
{id:'strings',n:'Slow Strings Swell',s:'A warm bed of strings that opens and closes like breathing.',t:'Cinematic',a:'#B0BDFF',b:'#161D4D',f:'#232E78',hz:'string pad',r:['choir','cello','endurance']},
{id:'harp',n:'Dream Harp',s:'Plucked notes drifting down like falling petals.',t:'Deep Sleep',a:'#C6D4FF',b:'#162044',f:'#233266',hz:'plucked pentatonic',r:['musicbox','piano','chimes']},
{id:'cello',n:'Lonely Cello Drone',s:'One long low note with a slow, human vibrato.',t:'Meditation',a:'#9BB5E6',b:'#121C3E',f:'#1D2D5E',hz:'65.4 Hz cello',r:['om','strings','dune']},
{id:'whale',n:'Deep Sea Whale Song',s:'Slow low calls rolling through dark, cold water.',t:'Meditation',a:'#6FC8E8',b:'#041E33',f:'#08304F',hz:'whale glides',r:['ocean','tide','lake']},
{id:'aurora',n:'Northern Lights',s:'Glassy high tones under a sky of moving color.',t:'Calm',a:'#7FF0E0',b:'#071F33',f:'#0C3552',hz:'shimmer pad',r:['choir','cloud','snow']},
{id:'cabin',n:'Starship Cabin Hum',s:'The steady low hum of a ship far from anywhere.',t:'Deep Sleep',a:'#8CCBF0',b:'#0A1C30',f:'#122F4E',hz:'60 Hz cabin hum',r:['gargantua','brown','orbit']},
{id:'clock',n:'Slow Clock Tick',s:'A patient tick, one second apart, to settle a busy mind.',t:'Focus',a:'#A5CCF2',b:'#0E1F3A',f:'#183258',hz:'60 bpm tick',r:['haze','gargantua','piano']},
{id:'universe',n:'Universe',s:'Deep space pads that swell slowly, like warm light across a very large sky.',t:'Cinematic',a:'#A9B8FF',b:'#070D2C',f:'#101B55',hz:'Deep space pads',r:['endurance','gargantua','strings'],fav:1},
{id:'frost',n:'Frozen Lake Hum',s:'Glassy tones over thin ice, very still.',t:'Calm',a:'#C4E6FF',b:'#0C2238',f:'#15385A',hz:'glass pad',r:['snow','aurora','glacier']},
{id:'mist',n:'Morning Mist Pads',s:'Warm, slow chords rising through the fog.',t:'Calm',a:'#B8E8DC',b:'#0B2B32',f:'#124350',hz:'warm pad',r:['cloud','shire','moonbeam']},
{id:'glacier',n:'Glacier Echo',s:'A deep hum and slow notes that fade into ice.',t:'Meditation',a:'#A8D4F2',b:'#071E36',f:'#0E3258',hz:'low drone + echo',r:['frost','whale','om']},
{id:'bamboo',n:'Bamboo Fountain',s:'Trickling water and a soft wooden tap now and then.',t:'Calm',a:'#9CE8D0',b:'#08302B',f:'#0E4A42',hz:'water + wood',r:['stream','cascade','shire']},
{id:'moonbeam',n:'Moonbeam Pads',s:'Silvery suspended chords drifting under moonlight.',t:'Deep Sleep',a:'#C8D4FF',b:'#12184A',f:'#1D2878',hz:'suspended pad',r:['cloud','choir','mist']},
{id:'cloudbed',n:'Cloud Bed',s:'Soft, low and wide, like sinking into a pillow of air.',t:'Deep Sleep',a:'#B4C8EE',b:'#101C3E',f:'#1A2E62',hz:'soft noise bed',r:['brown','haze','moonbeam']},
{id:'tidepool',n:'Tide Pool Drops',s:'Slow drops with a little echo, like a quiet cave.',t:'Calm',a:'#8FDCEE',b:'#06283A',f:'#0B4160',hz:'drops + echo',r:['lake','bamboo','whale']},
{id:'wisp',n:'Silk Wind Harmonics',s:'High, airy overtones that shimmer and fade.',t:'Meditation',a:'#C0D8FA',b:'#102A4A',f:'#1A4272',hz:'harmonic drone',r:['breeze','om','cloud']},
{id:'lantern',n:'Lantern Night Keys',s:'Soft, sparse notes floating up like paper lanterns.',t:'Deep Sleep',a:'#A9C2FF',b:'#0F1A45',f:'#192B72',hz:'sparse keys + echo',r:['harp','piano','musicbox']},
{id:'deepblue',n:'Deep Blue Breath',s:'Slow swells you can breathe with, in cool dark water.',t:'Meditation',a:'#79D0EE',b:'#04223A',f:'#08385C',hz:'breathing pad',r:['tide','whale','ocean']},
{id:'yt_rain',n:'Relaxing Rain Sounds',s:'A long rain recording, streamed from YouTube.',t:'YouTube',a:'#8FD3F4',b:'#0B2536',f:'#133B52',hz:'streamed from YouTube',r:['rain','drizzle','neon'],yt:'eTeD8DAta4c'}];
const I=[
{n:'Deep Focus & Flow',d:'Open air and steady pine for long stretches of writing, code or research.',m:['forest','breeze'],p:'Forest + Breeze'},
{n:'Delta Sleep Cocoon',d:'Rain on the roof, then something lower underneath. Starts a 30 minute timer.',m:['rain','brown'],p:'Rain + Brown noise',tm:30},
{n:'Zen Presence',d:'Harmonic brass tones at 432 Hz to bring attention back to the body.',m:['bowls','ocean'],p:'Singing bowls + Ocean'},
{n:'Stress Relief',d:'Moving water to slow the breath, with surf as the second layer.',m:['stream','ocean'],p:'Stream + Ocean'}];
const R=[
{t:'07:00 — 10:00',n:'Dawn Rising',d:'Brisk air and open space to wake up without a jolt.',m:'breeze'},
{t:'11:00 — 17:00',n:'Midday Focus',d:'Steady rain, the same texture for hours so your attention can disappear into the work.',m:'rain'},
{t:'18:00 — 21:00',n:'Twilight Unwind',d:'A hearth and soft embers to mark the end of the working day.',m:'fire'},
{t:'22:00 — 06:00',n:'Deep Night',d:'Low brown noise with the sleep timer already running.',m:'brown',tm:30}];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],by=id=>S.find(x=>x.id===id);
const PL='<svg class="ico" viewBox="0 0 24 24"><path d="M7 4.500v15l13-7.500z"/></svg>',PA='<svg class="ico" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
let AU=0;function art(x,i){const uid=i+'_'+(AU++),c=x.a,n=5+i%4,cx=30+(i*13)%40,cy=28+(i*17)%40;let r='';for(let k=1;k<=n;k++)r+=`<circle cx="${cx}" cy="${cy}" r="${k*(9+i%3*2)}" fill="none" stroke="${c}" stroke-opacity="${.38-k*.04}" stroke-width=".4"/>`;
return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="g${uid}" cx="${cx}%" cy="${cy}%" r="75%"><stop offset="0" stop-color="${c}" stop-opacity=".55"/><stop offset=".55" stop-color="${x.f}"/><stop offset="1" stop-color="${x.b}"/></radialGradient></defs><rect width="100" height="100" fill="url(#g${uid})"/>${r}<circle cx="${cx}" cy="${cy}" r="3" fill="${c}" opacity=".9"/></svg>`}
/* ---------- audio ---------- */
let ctx,master,an,cur=null,chain=null,playing=false,vol=.7,fadeK=1,bufs={};
function init(){if(ctx)return;ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=vol;an=ctx.createAnalyser();an.fftSize=1024;master.connect(an);an.connect(ctx.destination)}
function nb(k){if(bufs[k])return bufs[k];const L=ctx.sampleRate*5,b=ctx.createBuffer(1,L,ctx.sampleRate),d=b.getChannelData(0);let l=0,b0=0,b1=0,b2=0;
for(let i=0;i<L;i++){const w=Math.random()*2-1;if(k==='brown'){l=(l+.02*w)/1.02;d[i]=l*3.5}else if(k==='pink'){b0=.99765*b0+w*.099;b1=.963*b1+w*.2965;b2=.57*b2+w*1.05;d[i]=(b0+b1+b2+w*.18)*.2}else d[i]=w}
return bufs[k]=b}
const src=k=>{const s=ctx.createBufferSource();s.buffer=nb(k);s.loop=true;s.start();return s};
const F=(t,f,q)=>{const n=ctx.createBiquadFilter();n.type=t;n.frequency.value=f;if(q)n.Q.value=q;return n};
const G=v=>{const g=ctx.createGain();g.gain.value=v;return g};
const cn=(...a)=>{for(let i=0;i<a.length-1;i++)a[i].connect(a[i+1]);return a[0]};
function lfo(p,r,d,ns){const o=ctx.createOscillator();o.frequency.value=r;const g=G(d);o.connect(g);g.connect(p);o.start();ns.push(o)}
function burst(out,dur,v,hp){const s=ctx.createBufferSource();s.buffer=nb('white');const g=G(0),t=ctx.currentTime;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);cn(s,F('highpass',hp),g,out);s.start(t,Math.random()*3,dur+.05)}
let _u;window.UNI_URL=()=>{if(_u)return _u;const b=atob(document.getElementById('uni-data').textContent.trim()),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return _u=URL.createObjectURL(new Blob([a],{type:'audio/mpeg'}))};
const pad=(o,n,fr,ty,lp,g,sw)=>fr.forEach((f,i)=>{const p=ctx.createOscillator(),q=G(g);p.type=ty;p.frequency.value=f;p.detune.value=(i%2?1:-1)*(5+i*2);cn(p,F('lowpass',lp),q,o);p.start();n.push(p);if(sw)lfo(q.gain,sw+i*.013,g*.6,n)});
const echo=(o,tm,fb)=>{const i=G(1),d=ctx.createDelay(3),f=G(fb);d.delayTime.value=tm;i.connect(o);i.connect(d);cn(d,F('lowpass',2400),f,d);d.connect(o);return i};
const note=(o,f,ty,pk,du)=>{const s=ctx.createOscillator(),q=G(0),tt=ctx.currentTime;s.type=ty;s.frequency.value=f;q.gain.linearRampToValueAtTime(pk,tt+.012);q.gain.exponentialRampToValueAtTime(.0001,tt+du);cn(s,q,o);s.start(tt);s.stop(tt+du+.1)};
const PEN=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];

const LOCAL_AUDIO_MAP = {
  rain: '/audio/rain/gentle_rain.mp3',
  ocean: '/audio/ocean/ocean-waves.mp3',
  forest: '/audio/forest/nature-forest-sound.mp3',
  fire: '/audio/fireplace/hearth-fireplace.mp3',
  breeze: '/audio/wind/gentle-breeze.wav',
  meadow: '/audio/night/night-insects.wav',
  bowls: '/audio/zen-bowls/zen-bowls.wav',
  stream: '/audio/stream/mountain-stream.wav',
  brown: '/audio/brown-noise/velvet-brown-noise.wav',
  thunder: '/audio/thunder/distant-thunder.wav',
  universe: '/audio/universe.mp3'
};

const audioBufferCache = {};
let currentLoadToken = 0;

function makeSeamlessBuffer(orig) {
  const chs = orig.numberOfChannels, sr = orig.sampleRate, len = orig.length;
  // 2.5 second equal-power crossfade between the tail and head
  const fadeSec = Math.min(2.5, orig.duration * 0.15);
  const fadeLen = Math.floor(sr * fadeSec);
  if (len <= fadeLen * 2) return orig;

  const newLen = len - fadeLen;
  const out = ctx.createBuffer(chs, newLen, sr);
  for (let c = 0; c < chs; c++) {
    const s = orig.getChannelData(c), d = out.getChannelData(c);
    for (let i = 0; i < newLen; i++) d[i] = s[i];
    for (let i = 0; i < fadeLen; i++) {
      const t = i / fadeLen;
      const wH = Math.sin(t * Math.PI * 0.5);
      const wT = Math.cos(t * Math.PI * 0.5);
      d[i] = d[i] * wH + s[newLen + i] * wT;
    }
  }
  return out;
}

function playAudioFile(url, o, n, id) {
  const token = ++currentLoadToken;

  function runBuffer(buf) {
    if (token !== currentLoadToken) return;
    const s = ctx.createBufferSource();
    s.buffer = buf;
    s.loop = true;
    s.loopStart = 0;
    s.loopEnd = buf.duration;
    s.connect(o);
    s.start(0);
    n.push({
      stop() {
        try { s.stop(); } catch(e) {}
        try { s.disconnect(); } catch(e) {}
      }
    });
  }

  if (audioBufferCache[url]) {
    runBuffer(audioBufferCache[url]);
  } else {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .then(ab => ctx.decodeAudioData(ab))
      .then(decoded => {
        const seamless = makeSeamlessBuffer(decoded);
        audioBufferCache[url] = seamless;
        runBuffer(seamless);
      })
      .catch(err => {
        console.warn('Seamless audio file load error for ' + url + ':', err);
        // Fallback to procedural synthesis in B
        if (B[id]) B[id](o, n, []);
      });
  }
}

// Background preload of primary audio files
if (typeof window !== 'undefined') {
  const preloadList = ['/audio/rain/gentle_rain.mp3', '/audio/ocean/ocean-waves.mp3', '/audio/fireplace/hearth-fireplace.mp3'];
  const idlePreload = () => {
    preloadList.forEach(u => {
      if (!audioBufferCache[u]) {
        fetch(u).then(r => r.ok ? r.arrayBuffer() : null).then(ab => {
          if (!ab) return;
          init();
          ctx.decodeAudioData(ab).then(d => {
            if (d) audioBufferCache[u] = makeSeamlessBuffer(d);
          }).catch(() => {});
        }).catch(() => {});
      }
    });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(idlePreload, { timeout: 3000 });
  else setTimeout(idlePreload, 1500);
}

const B={
rain(o,n){n.push(cn(src('pink'),F('highpass',700),F('lowpass',7000),G(.55),o));n.push(cn(src('brown'),F('lowpass',300),G(.12),o))},
ocean(o,n){const g=G(.45);n.push(cn(src('brown'),F('lowpass',650),g,o));lfo(g.gain,.09,.35,n);const h=G(.04);n.push(cn(src('pink'),F('highpass',2500),h,o));lfo(h.gain,.09,.04,n)},
forest(o,n,t){n.push(cn(src('pink'),F('bandpass',1800,.4),G(.12),o));n.push(cn(src('brown'),F('lowpass',400),G(.3),o));
 t.push(setInterval(()=>{if(Math.random()<.6){const s=ctx.createOscillator(),g=G(0),tt=ctx.currentTime,f=2600+Math.random()*1400;s.frequency.setValueAtTime(f,tt);s.frequency.exponentialRampToValueAtTime(f*1.3,tt+.12);g.gain.linearRampToValueAtTime(.04,tt+.03);g.gain.exponentialRampToValueAtTime(.0001,tt+.22);cn(s,g,o);s.start(tt);s.stop(tt+.3)}},1300))},
fire(o,n,t){n.push(cn(src('brown'),F('lowpass',900),G(.6),o));t.push(setInterval(()=>{if(Math.random()<.4)burst(o,.03+Math.random()*.07,.1+Math.random()*.2,1200+Math.random()*2500)},80))},
breeze(o,n){const f=F('bandpass',600,.8);n.push(cn(src('pink'),f,G(.55),o));lfo(f.frequency,.07,320,n);n.push(cn(src('brown'),F('lowpass',250),G(.25),o))},
meadow(o,n){const g=G(.02);const s=ctx.createOscillator();s.frequency.value=4300;cn(s,g,o);s.start();n.push(s);lfo(g.gain,7,.02,n);
 [110,164.8].forEach(f=>{const p=ctx.createOscillator();p.frequency.value=f;cn(p,G(.05),o);p.start();n.push(p)});n.push(cn(src('pink'),F('lowpass',500),G(.14),o))},
bowls(o,n,t){const k=()=>[1,2.01,2.98].forEach((m,i)=>{const s=ctx.createOscillator(),g=G(0),tt=ctx.currentTime;s.frequency.value=432*m*(.5);g.gain.linearRampToValueAtTime(.2/(i+1),tt+.03);g.gain.exponentialRampToValueAtTime(.0001,tt+7);cn(s,g,o);s.start(tt);s.stop(tt+7.2)});k();t.push(setInterval(k,7500));n.push(cn(src('pink'),F('lowpass',300),G(.03),o))},
stream(o,n){const g=G(.45);n.push(cn(src('pink'),F('highpass',1200),F('lowpass',6500),g,o));lfo(g.gain,2.7,.07,n);n.push(cn(src('white'),F('bandpass',3200,1.5),G(.04),o))},
brown(o,n){n.push(cn(src('brown'),F('lowpass',500),G(.9),o))},
snow(o,n){const g=G(.2);n.push(cn(src('pink'),F('lowpass',1800),g,o));lfo(g.gain,.05,.08,n);n.push(cn(src('brown'),F('lowpass',220),G(.22),o))},
lake(o,n,t){const g=G(.3);n.push(cn(src('brown'),F('lowpass',450),g,o));lfo(g.gain,.22,.18,n);n.push(cn(src('pink'),F('bandpass',900,.6),G(.05),o));t.push(setInterval(()=>{if(Math.random()<.5){const s=ctx.createOscillator(),q=G(0),tt=ctx.currentTime;s.frequency.setValueAtTime(500+Math.random()*300,tt);s.frequency.exponentialRampToValueAtTime(900,tt+.08);q.gain.linearRampToValueAtTime(.05,tt+.01);q.gain.exponentialRampToValueAtTime(.0001,tt+.15);cn(s,q,o);s.start(tt);s.stop(tt+.2)}},1800))},
cocoon(o,n){[55,55.4,82.4,110].forEach((f,i)=>{const p=ctx.createOscillator();p.frequency.value=f;cn(p,G(.1/(i+1)),o);p.start();n.push(p)});const g=G(.45);n.push(cn(src('brown'),F('lowpass',260),g,o));lfo(g.gain,1.1,.18,n)},
chimes(o,n,t){n.push(cn(src('pink'),F('lowpass',400),G(.05),o));const P=[523.25,587.33,659.25,783.99,880,1046.5],k=()=>{const s=ctx.createOscillator(),q=G(0),tt=ctx.currentTime;s.frequency.value=P[Math.random()*P.length|0];q.gain.linearRampToValueAtTime(.09,tt+.01);q.gain.exponentialRampToValueAtTime(.0001,tt+4);cn(s,q,o);s.start(tt);s.stop(tt+4.2)};k();t.push(setInterval(()=>{if(Math.random()<.7)k()},1400))},
musicbox(o,n,t){n.push(cn(src('pink'),F('lowpass',500),G(.04),o));const N=[392,523.25,659.25,523.25,440,587.33,698.46,587.33];let i=0;const k=()=>{const s=ctx.createOscillator(),q=G(0),tt=ctx.currentTime;s.type='triangle';s.frequency.value=N[i++%8];q.gain.linearRampToValueAtTime(.1,tt+.01);q.gain.exponentialRampToValueAtTime(.0001,tt+1.8);cn(s,q,o);s.start(tt);s.stop(tt+2)};k();t.push(setInterval(k,650))},
drizzle(o,n,t){n.push(cn(src('pink'),F('bandpass',2500,.5),G(.18),o));n.push(cn(src('brown'),F('lowpass',250),G(.15),o));t.push(setInterval(()=>{if(Math.random()<.6)burst(o,.05,.06+Math.random()*.08,2500)},140))},
cloud(o,n){[130.8,164.8,196,246.9].forEach((f,i)=>{const p=ctx.createOscillator(),g=G(.05);p.frequency.value=f;p.detune.value=(i-1.5)*4;cn(p,g,o);p.start();n.push(p);lfo(g.gain,.04+i*.017,.03,n)});n.push(cn(src('pink'),F('lowpass',700),G(.12),o))},
haze(o,n){n.push(cn(src('pink'),F('lowpass',2400),G(.75),o))},
om(o,n){[68.05,136.1,272.2,408.3].forEach((f,i)=>{const p=ctx.createOscillator(),g=G(.14/(i+1));p.frequency.value=f;cn(p,g,o);p.start();n.push(p);if(i===1)lfo(g.gain,.07,.05,n)});n.push(cn(src('brown'),F('lowpass',200),G(.2),o))},
tide(o,n){const g=G(.4);n.push(cn(src('brown'),F('lowpass',600),g,o));lfo(g.gain,.083,.36,n);const p=ctx.createOscillator();p.frequency.value=110;cn(p,G(.04),o);p.start();n.push(p)},
endurance(o,n){pad(o,n,[65.4,98,130.8,196],'sawtooth',520,.05,.05);n.push(cn(src('brown'),F('lowpass',160),G(.25),o))},
gargantua(o,n){pad(o,n,[32.7,49,65.4],'sine',300,.13,.03);n.push(cn(src('brown'),F('lowpass',120),G(.3),o))},
orbit(o,n,t){pad(o,n,[110,165,220],'sine',700,.035,.03);n.push(cn(src('pink'),F('lowpass',400),G(.06),o));t.push(setInterval(()=>{if(Math.random()<.6)note(o,1800+Math.random()*400,'sine',.015,.25)},6000))},
choir(o,n){pad(o,n,[130.8,164.8,196,261.6,329.6],'sawtooth',900,.035,.06)},
shire(o,n,t){n.push(cn(src('pink'),F('bandpass',600,.5),G(.14),o));pad(o,n,[261.6,329.6,392],'triangle',800,.02,.03);t.push(setInterval(()=>{if(Math.random()<.6){const s=ctx.createOscillator(),q=G(0),tt=ctx.currentTime,f=2400+Math.random()*1600;s.frequency.setValueAtTime(f,tt);s.frequency.exponentialRampToValueAtTime(f*1.25,tt+.1);q.gain.linearRampToValueAtTime(.035,tt+.03);q.gain.exponentialRampToValueAtTime(.0001,tt+.2);cn(s,q,o);s.start(tt);s.stop(tt+.3)}},1500))},
cascade(o,n,t){n.push(cn(src('pink'),F('highpass',900),F('lowpass',8000),G(.5),o));t.push(setInterval(()=>{if(Math.random()<.4)note(o,PEN[Math.random()*8|0]*2,'triangle',.03,3)},2200))},
dune(o,n){const g=G(.35);n.push(cn(src('brown'),F('lowpass',350),g,o));lfo(g.gain,.08,.2,n);const h=G(.06);n.push(cn(src('pink'),F('bandpass',1200,.6),h,o));lfo(h.gain,.05,.05,n);const p=ctx.createOscillator();p.frequency.value=73.4;cn(p,G(.06),o);p.start();n.push(p)},
biolum(o,n,t){pad(o,n,[196,246.9,293.7],'sine',900,.04,.05);n.push(cn(src('brown'),F('lowpass',300),G(.15),o));t.push(setInterval(()=>{if(Math.random()<.5)note(o,700+Math.random()*700,'sine',.04,.6)},1300))},
neon(o,n){n.push(cn(src('pink'),F('bandpass',2500,.5),G(.2),o));n.push(cn(src('brown'),F('lowpass',250),G(.15),o));pad(o,n,[110,138.6,164.8],'sawtooth',600,.05,.04)},
cafe(o,n,t){const C=[[220,261.6,329.6,392],[174.6,220,261.6,329.6],[196,246.9,293.7,392],[164.8,207.7,246.9,329.6]];let i=0;const k=()=>{C[i++%4].forEach((f,j)=>setTimeout(()=>note(o,f,'triangle',.06,3.5),j*90))};k();t.push(setInterval(k,4200));n.push(cn(src('pink'),F('lowpass',500),G(.03),o))},
lofi(o,n,t){const C=[[261.6,329.6,392,493.9],[220,261.6,329.6,392],[174.6,220,261.6,329.6],[196,246.9,293.7,349.2]];let i=0;const k=()=>{C[i++%4].forEach((f,j)=>setTimeout(()=>note(o,f,'sine',.05,4),j*110))};k();t.push(setInterval(k,4600));t.push(setInterval(()=>{if(Math.random()<.5)burst(o,.02+Math.random()*.04,.05,3000)},90));n.push(cn(src('brown'),F('lowpass',300),G(.12),o))},
train(o,n,t){const g=G(.4);n.push(cn(src('brown'),F('lowpass',220),g,o));lfo(g.gain,2.2,.12,n);let k=0;t.push(setInterval(()=>{burst(o,.05,k++%2?.1:.16,500)},460))},
piano(o,n,t){const k=()=>{const f=PEN[Math.random()*8|0]/(Math.random()<.4?2:1);note(o,f,'triangle',.09,5);note(o,f*2,'sine',.03,3)};k();t.push(setInterval(()=>{if(Math.random()<.75)k()},2400));n.push(cn(src('pink'),F('lowpass',400),G(.025),o))},
strings(o,n){pad(o,n,[130.8,196,261.6,329.6],'sawtooth',700,.04,.07)},
harp(o,n,t){const k=()=>note(o,PEN[Math.random()*8|0]*(Math.random()<.5?1:2),'sine',.07,2.6);k();t.push(setInterval(()=>{if(Math.random()<.6)k()},800));n.push(cn(src('pink'),F('lowpass',450),G(.03),o))},
cello(o,n){[65.4,130.8].forEach((f,i)=>{const p=ctx.createOscillator();p.type='sawtooth';p.frequency.value=f;lfo(p.frequency,5,f*.006,n);cn(p,F('lowpass',400),G(.12/(i+1)),o);p.start();n.push(p)});n.push(cn(src('brown'),F('lowpass',200),G(.1),o))},
whale(o,n,t){const k=()=>{const s=ctx.createOscillator(),q=G(0),tt=ctx.currentTime;s.frequency.setValueAtTime(240,tt);s.frequency.exponentialRampToValueAtTime(130,tt+4.5);q.gain.linearRampToValueAtTime(.07,tt+1.5);q.gain.linearRampToValueAtTime(0,tt+5);cn(s,q,o);s.start(tt);s.stop(tt+5.2)};k();t.push(setInterval(k,11000));const g=G(.3);n.push(cn(src('brown'),F('lowpass',400),g,o));lfo(g.gain,.08,.15,n)},
aurora(o,n){pad(o,n,[261.6,329.6,392,523.3],'sine',2500,.03,.04);const g=G(.03);n.push(cn(src('pink'),F('highpass',3000),F('lowpass',7000),g,o));lfo(g.gain,.06,.02,n);n.push(cn(src('brown'),F('lowpass',250),G(.12),o))},
cabin(o,n){n.push(cn(src('brown'),F('lowpass',300),G(.5),o));[60,120].forEach((f,i)=>{const p=ctx.createOscillator();p.frequency.value=f;cn(p,G(.08/(i+1)),o);p.start();n.push(p)});n.push(cn(src('pink'),F('bandpass',1500,.8),G(.02),o))},
clock(o,n,t){pad(o,n,[110,165],'sine',500,.04,.03);let k=0;t.push(setInterval(()=>{burst(o,.03,k++%2?.12:.2,k%2?1500:3000)},1000));n.push(cn(src('brown'),F('lowpass',200),G(.1),o))},
frost(o,n,t){const e=echo(o,.6,.4);pad(e,n,[329.6,392,493.9,659.3],'sine',2200,.03,.04);n.push(cn(src('pink'),F('highpass',4000),F('lowpass',9000),G(.012),o));t.push(setInterval(()=>{if(Math.random()<.5)note(e,987.8*(Math.random()<.5?1:1.25),'sine',.03,3)},3200))},
mist(o,n){pad(o,n,[110,130.8,164.8,196,246.9],'triangle',900,.035,.05);n.push(cn(src('pink'),F('lowpass',500),G(.06),o))},
glacier(o,n,t){const e=echo(o,.9,.5);pad(o,n,[55,82.4],'sine',300,.09,.03);const k=()=>note(e,[220,246.9,329.6,392][Math.random()*4|0],'sine',.06,5);k();t.push(setInterval(k,5200));n.push(cn(src('brown'),F('lowpass',180),G(.2),o))},
bamboo(o,n,t){n.push(cn(src('pink'),F('bandpass',2800,.6),G(.14),o));n.push(cn(src('pink'),F('highpass',1500),F('lowpass',6000),G(.12),o));const e=echo(o,.35,.35);t.push(setInterval(()=>{if(Math.random()<.55){burst(e,.05,.1,900);note(e,520+Math.random()*80,'triangle',.08,.5)}},5000))},
moonbeam(o,n){pad(o,n,[110,164.8,196,246.9,329.6],'sine',1400,.035,.045);const f=F('lowpass',900);n.push(cn(src('pink'),f,G(.05),o));lfo(f.frequency,.04,500,n)},
cloudbed(o,n){const g=G(.5);n.push(cn(src('brown'),F('lowpass',420),g,o));lfo(g.gain,.035,.18,n);const h=G(.07);n.push(cn(src('pink'),F('lowpass',1200),h,o));lfo(h.gain,.05,.04,n)},
tidepool(o,n,t){const e=echo(o,.42,.5);n.push(cn(src('brown'),F('lowpass',300),G(.2),o));t.push(setInterval(()=>{if(Math.random()<.6)note(e,520+Math.random()*420,'sine',.07,.35)},1700))},
wisp(o,n){[110,220,330,440,550,660].forEach((f,i)=>{const p=ctx.createOscillator(),g=G(.04/(i+1));p.frequency.value=f;cn(p,g,o);p.start();n.push(p);lfo(g.gain,.05+i*.021,.03/(i+1),n)});const fl=F('bandpass',700,.7);n.push(cn(src('pink'),fl,G(.2),o));lfo(fl.frequency,.06,300,n)},
lantern(o,n,t){const e=echo(o,.55,.45),k=()=>note(e,[329.6,392,440,493.9,659.3][Math.random()*5|0]*(Math.random()<.4?.5:1),'triangle',.07,4);k();t.push(setInterval(()=>{if(Math.random()<.55)k()},2600));pad(o,n,[98,146.8],'sine',500,.03,.03)},
deepblue(o,n,t){const g=G(.4);n.push(cn(src('brown'),F('lowpass',500),g,o));lfo(g.gain,.083,.3,n);pad(o,n,[55,82.4,110],'sine',400,.06,.04);t.push(setInterval(()=>{if(Math.random()<.5)note(o,300+Math.random()*300,'sine',.02,.5)},2500))},
universe(o,n){const el=new Audio(UNI_URL());el.loop=true;const s=ctx.createMediaElementSource(el);cn(s,o);el.play().catch(()=>{});window.UNIA=el;n.push({stop(){el.pause();el.removeAttribute('src');if(window.UNIA===el)window.UNIA=null}})},
thunder(o,n,t){n.push(cn(src('brown'),F('lowpass',180),G(.35),o));const g=G(.3);n.push(cn(src('brown'),F('lowpass',110),g,o));
 const r=()=>{const tt=ctx.currentTime;g.gain.cancelScheduledValues(tt);g.gain.setValueAtTime(.3,tt);g.gain.linearRampToValueAtTime(1.6,tt+1.2);g.gain.linearRampToValueAtTime(.3,tt+5)};r();t.push(setInterval(r,11000))}};
function stopChain(c){if(!c)return;const t=ctx.currentTime;c.o.gain.cancelScheduledValues(t);c.o.gain.setValueAtTime(c.o.gain.value,t);c.o.gain.linearRampToValueAtTime(0,t+1.2);c.t.forEach(clearInterval);setTimeout(()=>{c.n.forEach(x=>{try{x.stop()}catch(e){}});c.o.disconnect()},1400)}
function start(id){init();ctx.resume();stopChain(chain);const o=G(0),n=[],t=[];o.connect(master);if(LOCAL_AUDIO_MAP[id]){playAudioFile(LOCAL_AUDIO_MAP[id],o,n,id);}else if(B[id]){B[id](o,n,t);}o.gain.linearRampToValueAtTime(1,ctx.currentTime+1.4);chain={o,n,t};cur=id;playing=true;theme(by(id));ui();fx(id);scene(id)}
function toggle(id){if(id&&(id!==cur||!ctx)){start(id);return}if(!cur||!ctx){start(cur||'rain');return}if(playing){ctx.suspend();playing=false;window.ACT_A&&ACT_A.pause();window.UNIA&&UNIA.pause();ytCmd('pauseVideo')}else{ctx.resume();playing=true;ytCmd('playVideo');if(window.ACT_A)ACT_A.play().catch(()=>{});if(cur==='universe'&&window.UNIA)UNIA.play();if(tEnd===null&&tRem)tEnd=Date.now()+tRem}if(!playing&&tEnd){tRem=tEnd-Date.now();tEnd=null}ui()}
/* ---------- theme ---------- */
function rgba(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function theme(x){const r=document.documentElement.style;r.setProperty('--bg',x.b);r.setProperty('--surf',x.f);r.setProperty('--acc',x.a)}
/* ---------- timer ---------- */
let tEnd=null,tRem=0;
const mmss=ms=>{ms=Math.max(0,Math.round(ms/1000));return String(Math.floor(ms/60)).padStart(2,'0')+':'+String(ms%60).padStart(2,'0')};
function setTimer(m,add){init();const cur0=tEnd?tEnd-Date.now():tRem;const base=add?cur0:0;const ms=base+m*60000;if(playing){tEnd=Date.now()+ms;tRem=0}else{tRem=ms;tEnd=null}tick();ui()}
function tick(){const rem=tEnd?tEnd-Date.now():tRem;const on=rem>0;
 if(tEnd&&rem<=0){tEnd=null;tRem=0;if(ctx){playing=false;master.gain.value=vol;ctx.suspend();window.ACT_A&&ACT_A.pause();window.UNIA&&UNIA.pause();ytCmd('pauseVideo')}ui();return}
 fadeK=tEnd&&rem<30000?Math.max(0,rem/30000):1;if(master)master.gain.value=vol*fadeK;ytVol(vol*fadeK);
 $('#clk').textContent=on?mmss(rem):'00:00';$('#tst').textContent=on?(tEnd?'Running':'Paused'):'Off';
 $('#dtt').textContent=on?mmss(rem):'Timer';const b=$('#dtm');b.classList.toggle('act',on&&!!tEnd);b.classList.toggle('pz',on&&!tEnd);
 $$('#tch .chip[data-m]').forEach(c=>c.classList.toggle('on',false))}
setInterval(tick,500);
/* ---------- UI ---------- */
function ui(){const x=cur?by(cur):null,i=cur?S.indexOf(x):0;
 $('#nbn').textContent=x?x.n:'Silence';$('#nb').classList.toggle('live',playing);$('#tab').classList.toggle('live',playing);$('#dock').classList.toggle('live',playing);{const q=cur?by(cur):null;document.getElementById('cred').innerHTML=q&&q.yt?`<span class='fv'>YouTube</span><a href='https://youtu.be/${q.yt}' target='_blank' rel='noopener'>Watch the original</a>`:q&&q.fav?`<span class='fv'>\u2605 Listener favourite</span>`:''}if(window.gsap)gsap.to('#pts',{opacity:playing?1:0,duration:1.4});window.SB=playing?1.8:.8;window.SCP=playing;document.getElementById('scene').style.opacity=playing&&window.SCN&&window.SCN.ty?1:0;if(window.SCN)SCN.off=performance.now()+1800;
 $('#dkn').textContent=x?x.n:'Nothing playing';$('#dks').textContent=x?x.s:'Choose a soundscape';
 $('#dkt').innerHTML=x?art(x,i):'';$('#bart').innerHTML=x?`<div class="bs">${art(x,i+20)}</div><span class="tag">${x.t}</span><span class="lc"><span class="eq ${playing?'run':''}" style="${playing?'display:inline-flex':''}"><s></s><s></s><s></s></span>${playing?'Playing':'Paused'}</span><div class="bo"><span>${x.hz}</span><span>&infin; LOOP</span></div>`:'';$('#bart').classList.toggle('live',playing);
 $('#dn').textContent=x?x.n:'Silence';$('#dsb').textContent=x?x.s:'Pick a soundscape to begin.';$('#dm').innerHTML=x?x.hz+' &nbsp;·&nbsp; seamless loop':'— Hz &nbsp;·&nbsp; seamless loop';
 $$('#dp,#dp2').forEach(b=>b.innerHTML=playing?PA:PL);
 $$('.card').forEach(c=>{const on=c.dataset.id===cur;c.classList.toggle('on',on);c.querySelector('.pb').innerHTML=on&&playing?PA:PL;c.querySelector('.eq').classList.toggle('run',on&&playing)});
 recs(x)}
function recs(x){const L=x?x.r:['rain','forest','bowls'];$('#rwhy').textContent=x?`Because you are listening to ${x.n}. Choosing one replaces the current sound.`:'A gentle place to start.';
 $('#recs').innerHTML=L.map(id=>{const y=by(id);return `<button class="rec" data-id="${id}"><div class="th">${art(y,S.indexOf(y)+40)}</div><div><b>${y.n}</b><span>${y.s}</span></div><em>${y.t}</em></button>`}).join('')}
const open=v=>document.body.classList.toggle('open',v);
/* ---------- build ---------- */
const cardH=(x,i)=>`<button class="card rv" data-id="${x.id}" style="transition-delay:${(i%5)*70}ms"><div class="art">${art(x,i)}</div><span class="tag">${x.t}${x.fav?' \u00b7 \u2605 Favourite':''}</span><span class="shr" role="button" tabindex="0" data-share="${x.id}" aria-label="Share ${x.n}"><svg class="ico" viewBox="0 0 24 24" style="width:15px;height:15px"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/></svg></span><span class="pb">${PL}</span><div class="ct"><b>${x.n}<span class="eq"><s></s><s></s><s></s></span></b><span>${x.s}</span><i>LOOP · ${x.hz.toUpperCase()}</i></div></button>`;
$('#ixg').innerHTML=I.map((x,i)=>`<div class="ix rv" style="transition-delay:${i*90}ms"><h3>${x.n}</h3><p>${x.d}</p><span class="pr">${x.p}</span><button data-ix="${i}">Activate intention</button></div>`).join('');
document.addEventListener('click',e=>{const t=e.target;let b;if(b=t.closest('[data-share]')){e.stopPropagation();share(b.dataset.share);return}if(t.closest('#dshare')){share(cur||'rain');return}if(t.closest('a[target=_blank]'))return;if(t.closest('#dtog,#tab')){open(!document.body.classList.contains('open'));return}if(b=t.closest('[data-cat],[data-f]')){const c=b.dataset.cat||b.dataset.f;location.hash=c==='All'?'#/library':'#/library/'+encodeURIComponent(c);return}if(t.closest('[data-rand]')){const o=S.filter(x=>x.id!==cur);start(o[Math.random()*o.length|0].id);return}
 if(b=t.closest('.card')){const id=b.dataset.id;toggle(id);if(id===cur&&playing&&matchMedia('(min-width:900px)').matches)open(true)}
 else if(b=t.closest('.rec'))start(b.dataset.id);
 else if(b=t.closest('[data-ix]')){const x=I[b.dataset.ix];start(x.m[0]);if(x.tm)setTimer(x.tm);else tick();$('#rwhy').textContent='';recs(by(x.m[0]));$('#recs').innerHTML=[x.m[1],...by(x.m[0]).r.filter(z=>z!==x.m[1])].slice(0,3).map((id,k)=>{const y=by(id);return `<button class="rec" data-id="${id}"><div class="th">${art(y,S.indexOf(y)+40)}</div><div><b>${y.n}</b><span>${y.s}</span></div><em>${k?y.t:'Companion'}</em></button>`}).join('');$('#rwhy').textContent=`Companion for ${x.n}. Choosing one replaces the current sound.`;open(true)}
 else if(b=t.closest('[data-rt]')){const x=R[b.dataset.rt];start(x.m);if(x.tm)setTimer(x.tm)}
 else if(b=t.closest('#tch .chip[data-m]'))setTimer(+b.dataset.m,!!b.dataset.add);
 else if(t.closest('#toff')){tEnd=null;tRem=0;fadeK=1;if(master)master.gain.value=vol;tick()}
 else if(t.closest('#dp,#dp2'))toggle();
 else if(t.closest('#begin'))toggle(cur||'rain');
 else if(t.closest('#dko,#nb,#dtm,#nmoon'))open(true);
 else if(t.closest('#dc,#scrim'))open(false);
 else if(t.closest('#nxt,#prv')){const d=t.closest('#nxt')?1:-1,i=cur?S.indexOf(by(cur)):-1;start(S[(i+d+S.length)%S.length].id)}});
addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
['v1','v2'].forEach(id=>$('#'+id).addEventListener('input',e=>setVol(e.target.value)));
function setVol(v){vol=v/100;ytVol(vol);if(master)master.gain.value=vol*fadeK;['v1','v2'].forEach(id=>{const r=$('#'+id);r.value=v;r.style.setProperty('--v',v+'%')});$('#vp').textContent=v+'%'}
setVol(70);
/* ---------- visualizer ---------- */
function fit(c){const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d}
const cv=[$('#wv'),$('#dv')];let ph=0;const buf=new Uint8Array(1024);
function draw(){ph+=.02;cv.forEach(c=>{if(!c.offsetParent&&c.id==='dv')return;if(c.width!==Math.round(c.getBoundingClientRect().width*(devicePixelRatio||1)))fit(c);const g=c.getContext('2d'),W=c.width,H=c.height,acc=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim();g.clearRect(0,0,W,H);
 if(an&&playing)an.getByteTimeDomainData(buf);
 for(let L=0;L<3;L++){g.beginPath();g.strokeStyle=acc;g.globalAlpha=[.9,.35,.15][L];g.lineWidth=(L?1:1.4)*(devicePixelRatio||1);
  for(let x=0;x<=W;x+=3){const u=x/W,env=Math.sin(u*Math.PI);let y;
   if(playing&&an){const v=(buf[Math.floor(u*1000)]-128)/128;y=v*H*.9*env*(1+L*.0)+Math.sin(u*9+ph+L)*H*.04*L}
   else y=Math.sin(u*8+ph*(1+L*.4))*H*.1*env*(1-L*.25);
   x?g.lineTo(x,H/2+y):g.moveTo(x,H/2+y)}g.stroke()}g.globalAlpha=1});requestAnimationFrame(draw)}
draw();
/* share */
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.classList.add('in'),10);setTimeout(()=>{t.classList.remove('in');setTimeout(()=>t.remove(),500)},2200)}
function copy(u){const f=()=>{const a=document.createElement('textarea');a.value=u;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove();toast('Link copied')};navigator.clipboard?navigator.clipboard.writeText(u).then(()=>toast('Link copied'),f):f()}
async function share(id){const x=by(id),u=location.href.split('#')[0]+'#sound='+id,tx=`Listen to ${x.n} on STILLWAVE. ${x.s}`;
 if(navigator.share&&matchMedia('(pointer:coarse)').matches){try{await navigator.share({title:'STILLWAVE · '+x.n,text:tx,url:u});return}catch(er){if(er.name==='AbortError')return}}
 const e=encodeURIComponent,m=document.createElement('div');m.className='sheet';
 m.innerHTML=`<div><div class="kick">Share this sound</div><h3 style="font-family:var(--serif);font-weight:300;font-size:28px;margin-bottom:8px">${x.n}</h3><a target="_blank" rel="noopener" href="https://wa.me/?text=${e(tx+' '+u)}">WhatsApp</a><a target="_blank" rel="noopener" href="https://t.me/share/url?url=${e(u)}&text=${e(tx)}">Telegram</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${e(tx)}&url=${e(u)}">X</a><a href="mailto:?subject=${e('STILLWAVE · '+x.n)}&body=${e(tx+'\n'+u)}">Email</a><button class="o" data-c>Copy link</button><button class="o" data-x style="color:var(--t3)">Close</button></div>`;
 m.addEventListener('click',ev=>{const g=ev.target;if(g===m||g.hasAttribute('data-x'))m.remove();if(g.hasAttribute('data-c')){copy(u);m.remove()}});document.body.appendChild(m)}
const hm=location.hash.match(/sound=(\w+)/);if(hm&&by(hm[1])){cur=hm[1];theme(by(cur));ui();setTimeout(()=>open(true),700)}
/* motion */
$('#mt').innerHTML=[...S,...S].map(x=>`<span>${x.n}</span>`).join('');
const sp=$('#sp'),nv=document.querySelector('nav');addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;sp.style.scale=(h>0?scrollY/h:0)+' 1';nv.classList.toggle('sc',scrollY>40)},{passive:true});
if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
 const cu=$('#cur');addEventListener('pointermove',e=>{cu.style.opacity=1;cu.style.transform=`translate(${e.clientX}px,${e.clientY}px)`},{passive:true});
 document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card,.ix');if(!c)return;const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');if(c.classList.contains('card')&&!c.classList.contains('fvb')){c.classList.add('tl');c.style.transform=`perspective(900px) rotateX(${((.5-y/r.height)*7).toFixed(2)}deg) rotateY(${((x/r.width-.5)*9).toFixed(2)}deg) translateY(-4px)`}});
 document.addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.card');if(c&&!c.contains(e.relatedTarget)){c.style.transform='';c.classList.remove('tl')}});
 $$('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.18}px ${(e.clientY-r.top-r.height/2)*.28}px`});b.addEventListener('pointerleave',()=>b.style.translate='')})}
/* views + gsap */
const FEAT=['rain','endurance','gargantua','ocean','neon','forest','snow','aurora'];
$('#grid').innerHTML=FEAT.map(id=>{const i=S.findIndex(z=>z.id===id);return cardH(S[i],i)}).join('');
const COL=[['Deep Sleep','Fall asleep faster','Snow, rain, music boxes and low hums to slow the mind down.'],['Focus','Stay in the work','Steady textures with no melody to pull you away.'],['Meditation','Settle and breathe','Bowls, drones and slow tides for stillness.'],['Unwind','Close the day','Fire, lake water and window rain for the evening.'],['Cinematic','Feel the film','Space organs, choirs and slow strings in the mood of epic scores.']];
$('#cols').innerHTML=COL.map((c,i)=>{const L=S.filter(x=>x.t===c[0]);return `<div class='ix rv' style='transition-delay:${i*90}ms'><span class='n'>${L.length} sounds</span><h3>${c[1]}</h3><p>${c[2]}</p><span class='pr'>${L.slice(0,3).map(x=>x.n).join(' \u00b7 ')}</span><button data-cat='${c[0]}'>Open ${c[0]}</button></div>`}).join('');
const CATS=['All','Cinematic','Focus','Meditation','Deep Sleep','Calm','Unwind','YouTube'];
function libR(cat){window.LC=cat;const L=S.map((x,i)=>[x,i]).filter(([x])=>(cat==='All'||x.t===cat)&&(!window.LQ||(x.n+' '+x.s+' '+x.t).toLowerCase().includes(window.LQ)));
 $('#fl').innerHTML=CATS.map(c=>`<button class='chip ${c===cat?'on':''}' data-f='${c}'>${c} <span style='opacity:.5'>${c==='All'?S.length:S.filter(x=>x.t===c).length}</span></button>`).join('')+`<button class='chip' data-rand style='margin-left:auto'>Shuffle play</button>`;
 $('#lgrid').innerHTML=L.length?L.map(([x,i])=>cardH(x,i)).join(''):'<p style="color:var(--t3)">No sounds match that search.</p>';$$('#lgrid .card').forEach(c=>c.classList.add('in'));mountCards();$('#lc2').textContent=`${L.length} sounds \u00b7 one plays at a time`;ui();
 if(window.gsap)gsap.from('#lgrid .card',{y:36,opacity:0,duration:.8,stagger:.045,ease:'power3.out',clearProps:'opacity,transform'})}
let lastV=null,pc=null;
function route(){const h=location.hash,m=h.match(/^#\/library(?:\/(.+))?/),lib=!!m,v=lib?$('#library'):$('#home'),g=window.gsap;$('#home').hidden=lib;$('#library').hidden=!lib;$('#nl').classList.toggle('act',lib);
 if(lib)libR(m[1]?decodeURIComponent(m[1]):'All');
 if(v!==lastV){scrollTo(0,0);if(g&&lastV)g.fromTo(v,{opacity:0,y:28},{opacity:1,y:0,duration:.9,ease:'power3.out',clearProps:'opacity,transform'});if(lib&&g){g.from('#library .sh>*',{y:24,opacity:0,duration:.8,stagger:.1,ease:'power3.out'});g.from('#fl .chip',{y:14,opacity:0,duration:.5,stagger:.04,delay:.2})}if(window.ScrollTrigger)setTimeout(()=>ScrollTrigger.refresh(),60)}
 if(!lib){const id=h.slice(1),el=id&&document.getElementById(id);if(el&&el.tagName==='SECTION')setTimeout(()=>el.scrollIntoView({behavior:'smooth'}),v===lastV?0:120)}
 lastV=v}
function fx(id){const g=window.gsap;if(!g||matchMedia('(prefers-reduced-motion:reduce)').matches)return;pc&&pc.revert();const L=$('#pts');L.innerHTML='';const m=({rain:'fall',drizzle:'fall',snow:'snow',fire:'rise',cocoon:'rise'})[id]||'float',n=0,W=innerWidth,Hh=innerHeight;
 for(let i=0;i<n;i++){const p=document.createElement('i');p.className='pt '+m;if(m!=='fall')p.style.width=p.style.height=(3+Math.random()*7)+'px';L.appendChild(p)}
 pc=g.context(()=>{L.querySelectorAll('.pt').forEach(p=>{const x=Math.random()*W;
  if(m==='fall')g.fromTo(p,{x,y:-60,opacity:.5},{x:x-40,y:Hh+60,duration:.9+Math.random()*.9,ease:'none',repeat:-1}).progress(Math.random());
  else{const up=m!=='snow',du=(m==='snow'?10:14)+Math.random()*12;g.fromTo(p,{x,y:up?Hh+30:-30},{y:up?-40:Hh+30,duration:du,ease:'none',repeat:-1}).progress(Math.random());g.to(p,{x:'+='+(30+Math.random()*50),duration:3+Math.random()*3,yoyo:true,repeat:-1,ease:'sine.inOut'});g.fromTo(p,{opacity:0},{opacity:.5,duration:du/2,yoyo:true,repeat:-1,ease:'sine.inOut'}).progress(Math.random())}})},L);
 const r=$('#dkt').getBoundingClientRect(),q=document.createElement('div');q.className='rip';q.style.left=r.left+r.width/2+'px';q.style.top=r.top+r.height/2+'px';document.body.appendChild(q);g.fromTo(q,{scale:.3,opacity:.9},{scale:6,opacity:0,duration:1.8,ease:'power2.out',onComplete:()=>q.remove()});
 g.fromTo('#dock',{scale:.97},{scale:1,duration:1,ease:'elastic.out(1,.45)'});g.from('#dkt',{rotate:-14,scale:.6,duration:.8,ease:'back.out(2.2)'});g.fromTo('#bart',{scale:.94},{scale:1,duration:1.1,ease:'elastic.out(1,.5)'});g.fromTo('.dt h3,.dt p',{y:14,opacity:0},{y:0,opacity:1,duration:.8,stagger:.08,ease:'power3.out'})}
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);
 
 gsap.to('.hero h1',{y:-60,opacity:.25,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 30%',scrub:.6}});
 gsap.to('.hero .sub,.hero .cta',{y:-30,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 30%',scrub:.6}});
 $$('#home .sh h2').forEach(h=>{const cs=split(h);gsap.from(cs,{yPercent:115,rotate:5,opacity:0,stagger:.022,duration:1.05,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%'}})});gsap.to('.hero h1',{letterSpacing:'.035em',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 30%',scrub:.6}});
 }
addEventListener('hashchange',route);route();
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* sound scenes */
const cv2=document.getElementById('scene');let c2=cv2.getContext('2d'),w2=0,h2=0,ac2=[143,230,230],f2=0,last2=0;window.SCN={id:null,t:0,P:[],off:0,ty:null};
const rnd=(a,b)=>a+Math.random()*(b-a),kk=a=>`rgba(${ac2[0]},${ac2[1]},${ac2[2]},${a})`;
const SM={rain:['rain',1],drizzle:['rain',.45],snow:['snow'],ocean:['wave',{n:4,a:30,v:.5}],tide:['wave',{n:4,a:34,v:.28,br:1}],lake:['wave',{n:3,a:10,v:.25,moon:1}],forest:['leaf'],fire:['ember'],breeze:['wind',{n:22,v:150,a:10}],stream:['wind',{n:42,v:340,a:22}],meadow:['fly'],bowls:['ring',{p:4.5,l:9,m:.7,o:[0]}],om:['ring',{p:7,l:12,m:.8,o:[0],man:1}],cocoon:['ring',{p:.91,l:1.5,m:.38,o:[0,.2],y:.62}],brown:['fog',{n:7,r:.5,v:8}],haze:['fog',{n:10,r:.32,v:14}],cloud:['fog',{n:7,r:.3,v:26,e:1}],thunder:['storm'],chimes:['twink'],musicbox:['bokeh'],endurance:['space',{v:1}],gargantua:['hole'],orbit:['space',{v:.35,pl:1}],choir:['aurora'],shire:['leaf'],cascade:['rain',.6],dune:['dust'],biolum:['fly'],neon:['rain',1],cafe:['bokeh'],lofi:['twink'],train:['wind',{n:30,v:520,a:2}],piano:['twink'],strings:['aurora'],harp:['bokeh'],cello:['fog',{n:6,r:.55,v:6}],whale:['wave',{n:5,a:22,v:.18,br:1}],aurora:['aurora'],cabin:['space',{v:.6}],clock:['ring',{p:2,l:4,m:.45,o:[0]}],universe:['space',{v:.7}],frost:['aurora'],mist:['fog',{n:8,r:.4,v:10}],glacier:['snow'],bamboo:['ring',{p:5,l:5,m:.3,o:[0]}],moonbeam:['bokeh'],cloudbed:['fog',{n:6,r:.55,v:5}],tidepool:['ring',{p:1.7,l:3.5,m:.25,o:[0]}],wisp:['wind',{n:18,v:110,a:14}],lantern:['bokeh'],deepblue:['wave',{n:5,a:24,v:.2,br:1}],yt_rain:['rain',1]};
S.filter(x=>x.yt&&!SM[x.id]).forEach(x=>SM[x.id]=['fog',{n:6,r:.5,v:8}]);
function scSz(){const d=Math.min(devicePixelRatio||1,1.5);w2=innerWidth;h2=innerHeight;cv2.width=w2*d;cv2.height=h2*d;c2.setTransform(d,0,0,d,0,0)}
const scBlob=(x,y,r,a,sy=1)=>{c2.save();c2.translate(x,y);c2.scale(1,sy);const g=c2.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,kk(a));g.addColorStop(1,kk(0));c2.fillStyle=g;c2.fillRect(-r,-r,r*2,r*2);c2.restore()};
const scGrad=(y0,y1,a)=>{const g=c2.createLinearGradient(0,y0,0,y1);g.addColorStop(0,kk(0));g.addColorStop(1,kk(a));c2.fillStyle=g;c2.fillRect(0,y0,w2,y1-y0)};
function scMk(ty,p){const w=w2,h=h2,A=(n,f)=>Array.from({length:n},f);
 if(ty==='rain')return{s:A(Math.round(190*p),()=>({x:rnd(0,w+200),y:rnd(0,h),l:rnd(16,40)*(p>.9?1:.65),v:rnd(750,1200)*(p>.9?1:.7)})),d:A(Math.round(28*p),()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(2.5,7),v:0,wt:rnd(0,6),run:0})),rp:[]};
 if(ty==='snow')return A(120,()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(1,4.2),v:rnd(18,60),ph:rnd(0,6.3),s:rnd(.4,1.1)}));
 if(ty==='leaf')return A(24,()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(5,11),v:rnd(20,45),ph:rnd(0,6.3),s:rnd(.5,1.2),rot:rnd(0,6.3)}));
 if(ty==='ember')return A(70,()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(1,3.4),v:rnd(28,80),ph:rnd(0,6.3)}));
 if(ty==='wind')return A(p.n,()=>({x:rnd(0,w),y:rnd(0,h),l:rnd(120,320),v:p.v*rnd(.6,1.4),ph:rnd(0,6.3),a:rnd(.08,.26)}));
 if(ty==='fly')return A(38,()=>({x:rnd(0,w),y:rnd(h*.3,h),ph:rnd(0,6.3),s:rnd(.5,1.2),r:rnd(2,4)}));
 if(ty==='fog')return A(p.n,()=>({x:rnd(0,w),y:rnd(0,h),r:p.r*Math.max(w,h)*rnd(.6,1.1),v:p.v*rnd(.5,1.5),ph:rnd(0,6.3)}));
 if(ty==='space')return A(150,()=>({x:rnd(-1,1),y:rnd(-1,1),z:rnd(.05,1)}));
 if(ty==='hole')return A(70,()=>({x:Math.random(),y:Math.random(),ph:rnd(0,6.3),s:rnd(.5,1.5)}));
 if(ty==='dust')return A(80,()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(.6,2.4),v:rnd(40,160),ph:rnd(0,6.3),a:rnd(.15,.5)}));
 if(ty==='storm')return{fog:A(6,()=>({x:rnd(0,w),y:rnd(0,h*.6),r:Math.max(w,h)*.5,v:rnd(6,14),ph:rnd(0,6.3)})),rain:A(50,()=>({x:rnd(0,w+100),y:rnd(0,h),l:rnd(12,24),v:rnd(600,900)})),nf:4,bolt:null,ft:-9};
 if(ty==='twink')return A(60,()=>({x:rnd(0,w),y:rnd(0,h),ph:rnd(0,6.3),s:rnd(.5,1.6),sz:rnd(6,16)}));
 if(ty==='bokeh')return A(26,()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(6,34),v:rnd(10,32),ph:rnd(0,6.3)}));
 return[]}
function scene(id){clearTimeout(SCN.to);cv2.style.opacity=0;SCN.to=setTimeout(()=>{const[ty,p]=SM[id];SCN.id=id;SCN.t=0;SCN.off=0;SCN.ty=ty;SCN.p=p;SCN.P=scMk(ty,p);cv2.style.opacity=window.SCP?1:0},500)}
function scDraw(dt){const t=SCN.t,P=SCN.P,p=SCN.p,w=w2,h=h2,c=c2,ty=SCN.ty;c.clearRect(0,0,w,h);
 if(ty==='rain'){c.lineWidth=1.2;c.strokeStyle=kk(.5*Math.min(1,p+.3));c.beginPath();for(const d of P.s){d.y+=d.v*dt;d.x-=d.v*dt*.18;if(d.y>h){d.y=-d.l;d.x=rnd(0,w+200)}c.moveTo(d.x,d.y);c.lineTo(d.x+d.l*.18,d.y-d.l)}c.stroke();scGrad(h*.7,h,.2);
  for(const d of P.d){if(d.wt>0){d.wt-=dt;if(d.wt<=0){d.v=rnd(50,150);d.run=rnd(70,260);d.y0=d.y}}else{const s=d.v*dt;d.y+=s;d.run-=s;if(d.run<=0){d.v=0;d.wt=rnd(2,7);if(Math.random()<.5){d.x=rnd(0,w);d.y=rnd(0,h*.8);d.y0=undefined}}}
   if(d.y0!==undefined){c.strokeStyle=kk(.16);c.lineWidth=d.r*.5;c.beginPath();c.moveTo(d.x,d.y0);c.lineTo(d.x,d.y);c.stroke()}
   c.fillStyle=kk(.12);c.strokeStyle=kk(.6);c.lineWidth=1;c.beginPath();c.ellipse(d.x,d.y,d.r*.8,d.r,0,0,6.3);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.arc(d.x-d.r*.28,d.y-d.r*.35,d.r*.22,0,6.3);c.fill()}
  if(Math.random()<.4*p)P.rp.push({x:rnd(0,w),y:h-rnd(10,h*.28),t:0});c.lineWidth=1;P.rp=P.rp.filter(r=>{r.t+=dt;if(r.t>1)return false;c.strokeStyle=kk(.45*(1-r.t));c.beginPath();c.ellipse(r.x,r.y,r.t*38,r.t*11,0,0,6.3);c.stroke();return true})}
 else if(ty==='snow'){c.fillStyle='rgba(235,248,255,.78)';for(const d of P){d.y+=d.v*dt;if(d.y>h+6)d.y=-6;c.beginPath();c.arc(d.x+Math.sin(t*d.s+d.ph)*24,d.y,d.r,0,6.3);c.fill()}scGrad(h*.8,h,.1)}
 else if(ty==='leaf'){for(let i=0;i<3;i++){const x0=w*(.2+i*.28)+Math.sin(t*.2+i)*40,g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,kk(.07+.04*Math.sin(t*.4+i*2)));g.addColorStop(1,kk(0));c.fillStyle=g;c.beginPath();c.moveTo(x0,0);c.lineTo(x0+90,0);c.lineTo(x0-170,h);c.lineTo(x0-260,h);c.fill()}
  for(const d of P){d.y+=d.v*dt;d.x+=Math.sin(t*d.s+d.ph)*20*dt;d.rot+=dt*d.s;if(d.y>h+20){d.y=-20;d.x=rnd(0,w)}c.save();c.translate(d.x,d.y);c.rotate(d.rot);c.fillStyle=kk(.32);c.beginPath();c.ellipse(0,0,d.r,d.r*.45,0,0,6.3);c.fill();c.restore()}}
 else if(ty==='ember'){scGrad(h*.6,h,.13+.05*Math.sin(t*7)+.03*Math.sin(t*13.3));for(const d of P){d.y-=d.v*dt;d.x+=Math.sin(t+d.ph)*14*dt;if(d.y<-10){d.y=h+10;d.x=rnd(0,w)}const a=Math.min(1,d.y/h+.1);c.fillStyle=kk(a*.16);c.beginPath();c.arc(d.x,d.y,d.r*4,0,6.3);c.fill();c.fillStyle=kk(a*.9);c.beginPath();c.arc(d.x,d.y,d.r,0,6.3);c.fill()}}
 else if(ty==='wave'){for(let i=0;i<p.n;i++){const base=h*(.7+i*.055),amp=p.a*(1-i*.15)*(p.br?.65+.35*Math.sin(t*.5236):1),g=c.createLinearGradient(0,base-amp,0,h);g.addColorStop(0,kk(.17-.02*i));g.addColorStop(1,kk(.04));c.fillStyle=g;c.beginPath();c.moveTo(0,h);for(let x=0;x<=w+12;x+=12)c.lineTo(x,base+Math.sin(x*.004*(1+i*.4)+t*p.v*(1+i*.3)+i*1.7)*amp+Math.sin(x*.011+t*p.v*1.7+i)*amp*.35);c.lineTo(w,h);c.fill()}
  if(p.moon){const mx=w*.74,my=h*.2;scBlob(mx,my,140,.35);c.fillStyle='rgba(240,250,255,.85)';c.beginPath();c.arc(mx,my,26,0,6.3);c.fill()}}
 else if(ty==='wind'){c.lineWidth=1.2;for(const d of P){d.x+=d.v*dt;if(d.x-d.l>w){d.x=-10;d.y=rnd(0,h)}c.strokeStyle=kk(d.a);c.beginPath();for(let i=0;i<=14;i++){const px=d.x-d.l*i/14,py=d.y+Math.sin(px*.012+t*1.2+d.ph)*p.a;i?c.lineTo(px,py):c.moveTo(px,py)}c.stroke()}}
 else if(ty==='fly'){for(const d of P){d.x+=Math.sin(t*.4*d.s+d.ph*3)*30*dt;d.y+=Math.cos(t*.33*d.s+d.ph)*22*dt;if(d.x<0)d.x=w;if(d.x>w)d.x=0;if(d.y<0)d.y=h;if(d.y>h)d.y=0;const a=Math.max(0,Math.sin(t*.9*d.s+d.ph))**2;scBlob(d.x,d.y,d.r*7,a*.55);c.fillStyle=`rgba(255,255,235,${a})`;c.beginPath();c.arc(d.x,d.y,d.r*.6,0,6.3);c.fill()}}
 else if(ty==='ring'){const ox=w/2,oy=h*(p.y||.42),mx=Math.max(w,h)*p.m;scBlob(ox,oy,70+14*Math.sin(t*(p.p<1?6.9:.9))+60,.16);
  if(p.man){c.save();c.translate(ox,oy);c.rotate(t*.05);c.strokeStyle=kk(.15);for(let j=1;j<=5;j++){c.setLineDash([4+j*3,10+j*4]);c.beginPath();c.arc(0,0,Math.min(w,h)*(.08+j*.07),0,6.3);c.stroke()}c.restore();c.setLineDash([])}
  c.lineWidth=1.5;for(let k=Math.floor((t-p.l)/p.p);k<=Math.floor(t/p.p);k++)for(const o of p.o){const pr=(t-(k*p.p+o))/p.l;if(pr<0||pr>1)continue;c.strokeStyle=kk(.38*(1-pr)**1.5);c.beginPath();c.arc(ox,oy,pr*mx,0,6.3);c.stroke()}}
 else if(ty==='fog'){for(const d of P){d.x+=d.v*dt;if(d.x-d.r>w)d.x=-d.r;scBlob(d.x,d.y+Math.sin(t*.1+d.ph)*30,d.r,.12,p.e?.42:1)}}
 else if(ty==='storm'){for(const d of P.fog){d.x+=d.v*dt;if(d.x-d.r>w)d.x=-d.r;scBlob(d.x,d.y,d.r,.1,.6)}
  c.lineWidth=1;c.strokeStyle=kk(.22);c.beginPath();for(const d of P.rain){d.y+=d.v*dt;d.x-=d.v*dt*.18;if(d.y>h){d.y=-d.l;d.x=rnd(0,w+100)}c.moveTo(d.x,d.y);c.lineTo(d.x+d.l*.18,d.y-d.l)}c.stroke();
  if(t>P.nf&&!P.bolt){let x=rnd(w*.15,w*.85),y=0;const b=[[x,y]];while(y<h*.65){x+=rnd(-40,40);y+=rnd(24,50);b.push([x,y])}P.bolt=b;P.ft=t;P.nf=t+rnd(8,14)}
  if(P.bolt){const age=t-P.ft;if(age>.9)P.bolt=null;else{const f=Math.exp(-age*5)*(age<.12?1:age<.2?.35:.8);c.fillStyle=`rgba(225,235,255,${.16*f})`;c.fillRect(0,0,w,h);c.strokeStyle=`rgba(255,255,255,${f})`;c.lineWidth=2.2;c.shadowBlur=24;c.shadowColor=kk(1);c.beginPath();P.bolt.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();c.shadowBlur=0}}}
 else if(ty==='space'){const cx=w/2,cy=h*.42,S=Math.max(w,h)*.2;if(p.pl){const g=c.createRadialGradient(w/2,h*1.7,h*1.0,w/2,h*1.7,h*1.28);g.addColorStop(0,kk(.2));g.addColorStop(1,kk(0));c.fillStyle=g;c.fillRect(0,h*.4,w,h*.6)}
  for(const s of P){s.z-=dt*.02*p.v;if(s.z<.04){s.z=1;s.x=rnd(-1,1);s.y=rnd(-1,1)}const X=cx+s.x*S/s.z,Y=cy+s.y*S/s.z;if(X<0||X>w||Y<0||Y>h){s.z=1;s.x=rnd(-1,1);s.y=rnd(-1,1);continue}c.fillStyle=`rgba(235,248,255,${Math.min(1,(1-s.z)*1.1+.1)})`;c.beginPath();c.arc(X,Y,(1-s.z)*1.6+.4,0,6.3);c.fill()}}
 else if(ty==='hole'){const cx=w/2,cy=h*.46,R=Math.min(w,h)*.15;for(const s of P){const a=Math.max(0,Math.sin(t*s.s+s.ph));c.fillStyle=`rgba(235,248,255,${a*.7})`;c.beginPath();c.arc(s.x*w,s.y*h,1.2,0,6.3);c.fill()}
  scBlob(cx,cy,R*6,.22);c.lineWidth=R*.12;c.strokeStyle=kk(.55);c.beginPath();c.arc(cx,cy,R*1.55,Math.PI*1.08,Math.PI*1.92);c.stroke();c.beginPath();c.arc(cx,cy,R*1.55,Math.PI*.08,Math.PI*.92);c.stroke();
  c.fillStyle='#000';c.shadowBlur=R*.8;c.shadowColor=kk(1);c.beginPath();c.arc(cx,cy,R,0,6.3);c.fill();c.shadowBlur=0;
  const g=c.createLinearGradient(cx-R*3.4,0,cx+R*3.4,0);g.addColorStop(0,kk(0));g.addColorStop(.3,kk(.8));g.addColorStop(.5,'rgba(255,255,255,.95)');g.addColorStop(.7,kk(.8));g.addColorStop(1,kk(0));c.save();c.translate(cx,cy);c.scale(1,.1+.015*Math.sin(t*.8));c.fillStyle=g;c.beginPath();c.arc(0,0,R*3.4,0,6.3);c.fill();c.restore()}
 else if(ty==='aurora'){for(let i=0;i<4;i++){const y0=h*(.18+i*.1),g=c.createLinearGradient(0,y0-40,0,y0+h*.4);g.addColorStop(0,kk(0));g.addColorStop(.35,kk(.17-i*.025));g.addColorStop(1,kk(0));c.fillStyle=g;c.beginPath();c.moveTo(0,h);for(let x=0;x<=w+16;x+=16)c.lineTo(x,y0+Math.sin(x*.0045+t*.22+i*1.3)*h*.06+Math.sin(x*.011-t*.3+i)*h*.02);c.lineTo(w,h);c.fill()}}
 else if(ty==='dust'){for(const d of P){d.x+=d.v*dt;d.y+=Math.sin(t*.6+d.ph)*8*dt;if(d.x>w+4){d.x=-4;d.y=rnd(0,h)}c.fillStyle=kk(d.a);c.beginPath();c.arc(d.x,d.y,d.r,0,6.3);c.fill()}scGrad(h*.55,h,.1)}
 else if(ty==='twink'){for(const d of P){let a=Math.max(0,Math.sin(t*d.s+d.ph));a=a*a*a;if(a<.02)continue;c.strokeStyle=kk(a*.9);c.lineWidth=1;c.beginPath();c.moveTo(d.x-d.sz*a,d.y);c.lineTo(d.x+d.sz*a,d.y);c.moveTo(d.x,d.y-d.sz*a);c.lineTo(d.x,d.y+d.sz*a);c.stroke();c.fillStyle=`rgba(255,255,255,${a})`;c.beginPath();c.arc(d.x,d.y,1.6*a,0,6.3);c.fill()}}
 else if(ty==='bokeh'){for(const d of P){d.y-=d.v*dt;if(d.y<-d.r*2){d.y=h+d.r*2;d.x=rnd(0,w)}scBlob(d.x+Math.sin(t*.3+d.ph)*18,d.y,d.r*2,.12+.08*Math.sin(t*.6+d.ph))}}}
function scLoop(now){requestAnimationFrame(scLoop);const dt=Math.min(.05,(now-last2)/1000||0);last2=now;if(RM||!SCN.ty||(!window.SCP&&performance.now()>SCN.off))return;
 if(!(f2++%20)){const m=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim();let n=[];if(m[0]==='#'){const v=parseInt(m.slice(1),16);n=[v>>16,v>>8&255,v&255]}else n=(m.match(/[\d.]+/g)||[]).slice(0,3).map(Number);if(n.length===3)ac2=n}
 SCN.t+=dt;scDraw(dt)}
scSz();addEventListener('resize',()=>{scSz();if(SCN.ty)SCN.P=scMk(SCN.ty,SCN.p)});requestAnimationFrame(scLoop);
/* touch feedback */
document.addEventListener('pointerdown',e=>{const T=e.target.closest?e.target:null;if(!T)return;const h=T.closest('.card,.rec');if(h&&navigator.vibrate&&e.pointerType==='touch')navigator.vibrate(10);const b=T.closest('.btn,.play,.chip,.ib,.ix button,.tab');if(!b)return;
 const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2.4,q=document.createElement('span');q.className='rpl';q.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left}px;top:${e.clientY-r.top}px`;b.appendChild(q);setTimeout(()=>q.remove(),800);
 if(navigator.vibrate&&e.pointerType==='touch')navigator.vibrate(8)},{passive:true});
/* cursor */
(()=>{if(RM)return;const fine=matchMedia('(hover:hover) and (pointer:fine)').matches,ring=$('#cring'),dot=$('#cdot'),lab=ring.querySelector('span'),tc=$('#ctrail'),tx=tc.getContext('2d'),cb=new Uint8Array(256),SEL='.btn,.play,.chip,.ib,.ix button,.tab,.dk,.tm-b,.rec,.shr,.back,.links a,.badge,a.logo,.card';
 let x=-100,y=-100,rx=-100,ry=-100,vis=false,tgt=null,down=false,pts=[],lvl=0,hT,f=0,cc=[143,230,230];
 if(fine)document.documentElement.classList.add('cc');
 function tsz(){const d=Math.min(devicePixelRatio||1,2);tc.width=innerWidth*d;tc.height=innerHeight*d;tx.setTransform(d,0,0,d,0,0)}tsz();addEventListener('resize',tsz);
 function col(){const m=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim();let n;if(m[0]==='#'){const v=parseInt(m.slice(1),16);n=[v>>16,v>>8&255,v&255]}else n=(m.match(/[\d.]+/g)||[]).slice(0,3).map(Number);if(n.length===3)cc=n}
 function setT(el){if(el===tgt)return;tgt=el;ring.classList.remove('lb');lab.textContent='';ring.style.width=ring.style.height=ring.style.borderRadius='';if(!el)return;
  if(el.matches('.card')){ring.style.width=ring.style.height='86px';lab.textContent=el.classList.contains('on')&&playing?'Pause':'Play';ring.classList.add('lb');return}
  const r=el.getBoundingClientRect(),br=parseFloat(getComputedStyle(el).borderRadius)||0;ring.style.width=(r.width+14)+'px';ring.style.height=(r.height+14)+'px';ring.style.borderRadius=br>=Math.min(r.width,r.height)/2?'999px':(br+7)+'px'}
 function hide(){vis=false;ring.style.opacity=0;dot.style.opacity=0;setT(null)}
 function show(){vis=true;ring.style.opacity=1;dot.style.opacity=1}
 addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;if(!vis){rx=x;ry=y;show()}clearTimeout(hT);if(e.pointerType==='touch')hT=setTimeout(hide,600);else if(fine){const t=e.target;setT(t.closest?t.closest(SEL):null)}},{passive:true});
 addEventListener('pointerdown',e=>{down=true;if(e.pointerType==='touch'){x=rx=e.clientX;y=ry=e.clientY;clearTimeout(hT);show()}},{passive:true});
 addEventListener('pointerup',e=>{down=false;if(e.pointerType==='touch'){clearTimeout(hT);hT=setTimeout(hide,500)}},{passive:true});
 document.documentElement.addEventListener('mouseleave',hide);
 function fr(now){requestAnimationFrame(fr);if(!vis&&!pts.length)return;let px=x,py=y,sc=1,mo=false;
  if(tgt&&!tgt.matches('.card')){const r=tgt.getBoundingClientRect();px=r.left+r.width/2+(x-r.left-r.width/2)*.22;py=r.top+r.height/2+(y-r.top-r.height/2)*.22;mo=true}
  else{if(playing&&an){an.getByteTimeDomainData(cb);let s=0;for(let i=0;i<cb.length;i++){const v=(cb[i]-128)/128;s+=v*v}lvl+=(Math.sqrt(s/cb.length)-lvl)*.2;sc=1+Math.min(1.2,lvl*3)}if(down)sc*=.8}
  rx+=(px-rx)*(mo?.25:.18);ry+=(py-ry)*(mo?.25:.18);
  ring.style.transform=`translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${sc})`;ring.classList.toggle('mo',mo);dot.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${mo?0:1})`;
  if(vis&&(!pts.length||Math.hypot(x-pts[pts.length-1].x,y-pts[pts.length-1].y)>3))pts.push({x,y,t:now});while(pts.length&&now-pts[0].t>420)pts.shift();
  tx.clearRect(0,0,innerWidth,innerHeight);if(pts.length>1){if(!(f++%15))col();tx.lineCap='round';for(let i=1;i<pts.length;i++){const a=1-(now-pts[i].t)/420;tx.strokeStyle=`rgba(${cc[0]},${cc[1]},${cc[2]},${a*.55})`;tx.lineWidth=1+a*5;tx.beginPath();tx.moveTo(pts[i-1].x,pts[i-1].y);tx.lineTo(pts[i].x,pts[i].y);tx.stroke()}}}
 requestAnimationFrame(fr)})();
/* card scenes */
const CS=new Map();let cio=null,cl=0;
function swap(st,fn){const o=[c2,w2,h2,ac2,window.SCN];c2=st.ctx;w2=st.w;h2=st.h;ac2=st.ac;window.SCN=st;try{fn()}finally{[c2,w2,h2,ac2,window.SCN]=o}}
function mountCards(){if(!window.CSR||RM)return;cio=cio||new IntersectionObserver(es=>es.forEach(e=>{const s=CS.get(e.target);if(s)s.vis=e.isIntersecting}),{rootMargin:'80px'});
 $$('.card').forEach(card=>{const x=by(card.dataset.id),art=card.querySelector('.art');if(!x||!art||art.querySelector('canvas.cs'))return;const cv=document.createElement('canvas'),d=1.25,w=+card.dataset.cw||240,h=+card.dataset.ch||300;cv.className='cs';cv.width=w*d;cv.height=h*d;art.appendChild(cv);const ctx=cv.getContext('2d');ctx.setTransform(d,0,0,d,0,0);
  const[ty,p]=SM[x.id],hx=parseInt(x.a.slice(1),16),st={ty,p,t:Math.random()*5,ctx,w,h,ac:[hx>>16,hx>>8&255,hx&255],vis:false,P:[]};
  swap(st,()=>{let P=scMk(ty,p);const k=Math.max(.12,w*h/(innerWidth*innerHeight)*2.2),cut=(a,m)=>a.slice(0,Math.max(m,Math.round(a.length*k)));if(Array.isArray(P))P=cut(P,5);else if(P.s){P.s=cut(P.s,12);P.d=cut(P.d,4)}else if(P.rain){P.rain=cut(P.rain,8);P.fog=P.fog.slice(0,3)}st.P=P});
  CS.set(cv,st);cio.observe(cv)})}
function cdLoop(now){requestAnimationFrame(cdLoop);if(RM||document.hidden)return;const dt=Math.min(.06,(now-cl)/1000||0);if(dt<.033)return;cl=now;
 for(const[cv,st]of CS){if(!cv.isConnected){CS.delete(cv);continue}if(!st.vis)continue;st.t+=dt;swap(st,()=>scDraw(dt))}}
window.CSR=true;mountCards();requestAnimationFrame(cdLoop);
/* water fx */
(()=>{let AC=null,lastS=0,emit=()=>{};
 const acc=()=>{const m=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim();let n;if(m[0]==='#'){const v=parseInt(m.slice(1),16);n=[v>>16,v>>8&255,v&255]}else n=(m.match(/[\d.]+/g)||[]).slice(0,3).map(Number);return n.length===3?n:[160,230,220]};
 const bl=(at,f,pk,du)=>{const t=AC.currentTime+at,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*2.6,t+.075);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+du);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+du+.05)};
 function drop(){const now=performance.now();if(now-lastS<70)return;lastS=now;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const f=480+Math.random()*260;bl(0,f,.16,.3);bl(.012,f*1.5,.05,.18);bl(.13,f*.95,.045,.24)}catch(e){}}
 document.addEventListener('pointerdown',e=>{drop();emit(e.clientX,e.clientY,true)},{passive:true});
 if(RM)return;
 const cv=document.createElement('canvas');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:158;pointer-events:none';document.body.appendChild(cv);const c=cv.getContext('2d');let W,H,R=[],lx=-999,ly=-999,col=[160,230,220],fr=0,run=false;
 function sz(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}sz();addEventListener('resize',sz);
 function tick(now){if(!R.length){run=false;c.clearRect(0,0,W,H);return}requestAnimationFrame(tick);if(!(fr++%20))col=acc();c.clearRect(0,0,W,H);R=R.filter(r=>now-r.t<r.l+r.k*140);
  for(const r of R)for(let k=0;k<r.k;k++){const p=(now-r.t-k*140)/r.l;if(p<0||p>1)continue;const e=1-Math.pow(1-p,2.2),rr=4+e*r.m*(1-k*.12);c.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},${r.a*(1-p)*(1-k*.25)})`;c.lineWidth=1.4-k*.3;c.beginPath();c.ellipse(r.x,r.y,rr,rr*.4,0,0,6.3);c.stroke()}}
 emit=(x,y,big)=>{R.push({x,y,t:performance.now(),m:big?90:44,l:big?1500:1100,a:big?.5:.32,k:big?3:2});if(!run){run=true;requestAnimationFrame(tick)}};
 addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-lx,e.clientY-ly)>26){lx=e.clientX;ly=e.clientY;emit(lx,ly,false)}},{passive:true})})();
$('#favart').insertAdjacentHTML('afterbegin',art(by('universe'),31));
$('#qs').addEventListener('input',e=>{window.LQ=e.target.value.trim().toLowerCase();libR(window.LC||'All')});
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$(".links a[href='#intentions'],.links a[href='#rituals']").forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});['intentions','rituals'].forEach(id=>{const el=document.getElementById(id);el&&spy.observe(el)});
addEventListener('keydown',e=>{const tg=document.activeElement.tagName;if(tg==='INPUT'||tg==='TEXTAREA')return;if(e.code==='Space'&&tg!=='BUTTON'&&tg!=='A'){e.preventDefault();toggle()}else if(e.key==='ArrowRight')$('#nxt').click();else if(e.key==='ArrowLeft')$('#prv').click()});
const fvc=document.querySelector('.fvb');fvc&&fvc.addEventListener('pointermove',e=>{const r=fvc.getBoundingClientRect();fvc.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));fvc.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3))},{passive:true});
/* youtube */
window.YTK=0;
function ytCmd(f,a){const x=cur?by(cur):null;if(!x||!x.yt)return;const i=document.getElementById('ytf');i&&i.contentWindow&&i.contentWindow.postMessage(JSON.stringify({event:'command',func:f,args:a||[]}),'*')}
function ytVol(v){ytCmd('setVolume',[Math.round(Math.max(0,Math.min(1,v))*100)])}
function ytPlay(id,n){const box=document.getElementById('ytp'),fr=box.querySelector('.ytv'),tok=++window.YTK,og=location.origin&&location.origin!=='null'?'&origin='+encodeURIComponent(location.origin):'';box.classList.remove('blocked');
 fr.innerHTML=`<iframe id='ytf' title='YouTube player' src='https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&loop=1&playlist=${id}&rel=0&playsinline=1${og}' allow='autoplay; encrypted-media; picture-in-picture' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>`;
 box.querySelectorAll('.yta').forEach(a=>a.href='https://youtu.be/'+id);box.classList.add('on');
 document.getElementById('ytf').addEventListener('load',()=>setTimeout(()=>{ytVol(vol);ytCmd('playVideo')},500));
 n.push({stop(){if(window.YTK!==tok)return;box.classList.remove('on');setTimeout(()=>{if(window.YTK===tok&&!box.classList.contains('on'))fr.innerHTML=''},700)}})}
S.filter(x=>x.yt).forEach(x=>{B[x.id]=(o,n)=>ytPlay(x.yt,n)});
document.addEventListener('securitypolicyviolation',e=>{if(/youtube/.test(e.blockedURI||'')){const b=document.getElementById('ytp');b.classList.add('blocked','on')}});
/* motion v2 */
function split(el){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(nd=>{const f=document.createDocumentFragment();nd.textContent.split(/(\s+)/).forEach(tok=>{if(!tok)return;if(/^\s+$/.test(tok)){f.appendChild(document.createTextNode(' '));return}const wd=document.createElement('span');wd.className='wd';[...tok].forEach(c=>{const q=document.createElement('span');q.className='ch';q.textContent=c;wd.appendChild(q)});f.appendChild(wd)});nd.replaceWith(f)});return el.querySelectorAll('.ch')}
const SWH=['07','12','19','23'],DEF={a:'#B4EBCB',b:'#0A2B2A',f:'#123F3B'};let SI=-1;
$('#rt').innerHTML=`<div class='story' id='story'><div class='stage'><div class='sbig' id='sbig'>07</div><div class='stext'><div class='stm' id='stm'></div><h3 id='stn'></h3><p id='std'></p><button class='btn p' id='sbtn' data-rt='0'>Play this ritual</button><div class='sdots'>${R.map((r,i)=>`<button class='sd' data-sd='${i}'>${r.n.split(' ')[0].toUpperCase()}</button>`).join('')}</div></div><div class='sglass' id='sglass'><div class='sart' id='sart'></div><div class='sinfo'><b id='ssn'></b><span id='sss'></span></div></div></div></div>`;
function setStep(i){if(i===SI)return;const first=SI<0,g=window.gsap;SI=i;const r=R[i],x=by(r.m);
 $('#stm').textContent=r.t;$('#stn').textContent=r.n;$('#std').textContent=r.d;$('#sbtn').dataset.rt=i;$('#sbig').textContent=SWH[i];
 $('#sart').innerHTML=art(x,S.indexOf(x)+60);$('#ssn').textContent=x.n;$('#sss').textContent=x.s;
 $$('.sd').forEach((d,k)=>d.classList.toggle('on',k===i));
 if(!cur&&!first)theme(x);
 if(g&&!first&&!RM){const cs=split($('#stn'));g.from(cs,{yPercent:120,rotate:6,opacity:0,stagger:.03,duration:.9,ease:'expo.out'});g.from('#stm,#std,#sbtn',{y:22,opacity:0,stagger:.08,duration:.7,ease:'power3.out'});g.fromTo('#sbig',{opacity:0,scale:.92},{opacity:1,scale:1,duration:1.1,ease:'power3.out'});g.fromTo('#sglass',{rotateY:-16,y:30,opacity:.3},{rotateY:0,y:0,opacity:1,duration:1.1,ease:'expo.out'})}}
setStep(0);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-sd]');if(!b)return;const st=$('#story'),top=st.getBoundingClientRect().top+scrollY,h=st.offsetHeight-innerHeight;(window.LEN?LEN.scrollTo(top+(+b.dataset.sd+.5)/4*h,{duration:1.4}):scrollTo({top:top+(+b.dataset.sd+.5)/4*h,behavior:'smooth'}))});
const hm2=$('#home');[['16%',140,-90,'6%'],['44%',90,70,'88%'],['66%',200,-60,'3%'],['86%',110,90,'82%']].forEach(([t,sz,sp,l])=>{const e=document.createElement('i');e.className='shard';e.style.cssText=`top:${t};left:${l};width:${sz}px;height:${sz}px`;hm2.appendChild(e);if(window.gsap&&window.ScrollTrigger&&!RM)gsap.to(e,{y:sp*2,ease:'none',scrollTrigger:{trigger:hm2,start:'top top',end:'bottom bottom',scrub:.8}})});
[['#soundscapes','Listen'],['#intentions','Breathe']].forEach(([sel,t],k)=>{const el=$(sel);if(!el)return;el.insertAdjacentHTML('afterbegin',`<div class='bigtxt'>${t}</div>`);if(window.gsap&&window.ScrollTrigger&&!RM)gsap.fromTo(el.firstElementChild,{x:k?'-30%':'0%'},{x:k?'0%':'-30%',ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}})});
if(window.gsap&&window.ScrollTrigger&&!RM){
 ScrollTrigger.create({trigger:'#story',start:'top top',end:'bottom bottom',onUpdate:s=>{setStep(Math.min(3,Math.floor(s.progress*4)));$('#sbig').style.translate=`0 calc(-50% + ${(.5-s.progress)*140}px)`},onLeaveBack:()=>{if(!cur)theme(DEF)}});
 gsap.to('.himg i',{y:130,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
 gsap.utils.toArray('#grid .card').forEach(c=>{const a=c.querySelector('.art');gsap.fromTo(a,{yPercent:-7,scale:1.14},{yPercent:7,scale:1.14,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'bottom top',scrub:true}})});
 const mt=$('#mt');let pr=1,cr=1;ScrollTrigger.create({onUpdate:s=>{pr=1+Math.min(1.8,Math.abs(s.getVelocity())/600)*s.direction}});gsap.ticker.add(()=>{const a=mt.getAnimations()[0];if(!a)return;pr+=(1-pr)*.04;cr+=(pr-cr)*.1;a.playbackRate=cr})}
/* intro */
(()=>{const root=document.documentElement,iv=document.getElementById('intro');
 const end=()=>{root.classList.remove('intro');root.style.overflow='';if(window.LEN)LEN.start();if(iv)iv.remove()};
 if(!iv||RM||!window.gsap){end();return}
 root.style.overflow='hidden';
 const ch=split(iv.querySelector('.i-word')),tl=gsap.timeline({onComplete:end});
 tl.fromTo('.i-glow',{opacity:0,scale:.6},{opacity:1,scale:1,duration:1.6,ease:'power2.out'},0)
  .fromTo('.i-drop',{y:'-46vh',opacity:0,scaleY:1.8},{y:0,opacity:1,duration:.85,ease:'power2.in'},.25)
  .to('.i-drop',{scale:0,opacity:0,duration:.18,ease:'power2.out'},1.1)
  .fromTo('.i-rg i',{scale:0,opacity:.9},{scale:1,opacity:0,duration:2.1,ease:'power2.out',stagger:.22},1.08)
  .fromTo(ch,{yPercent:120,opacity:0,filter:'blur(14px)'},{yPercent:0,opacity:1,filter:'blur(0px)',duration:1.1,ease:'expo.out',stagger:.055},1.25)
  .fromTo('.i-word',{letterSpacing:'.7em'},{letterSpacing:'.38em',duration:2,ease:'power3.out'},1.25)
  .fromTo('.i-line',{scaleX:0},{scaleX:1,duration:1.4,ease:'power3.inOut'},1.6)
  .fromTo('.i-tag',{y:14,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out'},2)
  .to('.i-core',{y:-24,opacity:0,duration:.7,ease:'power2.in'},3.15)
  .to(iv,{clipPath:'circle(0% at 50% 50%)',duration:1.25,ease:'expo.inOut'},3.2);
 iv.addEventListener('click',()=>tl.timeScale(4));setTimeout(end,9000)})();
/* premium pass js */
(()=>{const cb=new Uint8Array(256),st=document.documentElement.style;let l=0;(function f(){requestAnimationFrame(f);let t=0;if(playing&&an){an.getByteTimeDomainData(cb);let s=0;for(let i=0;i<cb.length;i++){const v=(cb[i]-128)/128;s+=v*v}t=Math.min(1,Math.sqrt(s/cb.length)*3)}l+=(t-l)*.12;st.setProperty('--lvl',l.toFixed(3))})()})();
if(window.Lenis&&window.gsap&&!RM&&matchMedia('(hover:hover)').matches){const lenis=new Lenis({duration:1.15,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});window.LEN=lenis;if(document.documentElement.classList.contains('intro'))lenis.stop();if(window.ScrollTrigger)lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);$('#drawer').setAttribute('data-lenis-prevent','')}
if(window.gsap&&window.ScrollTrigger&&!RM){const fc=split($('.fbig'));
 gsap.fromTo(fc,{y:70,opacity:0,filter:'blur(12px)',rotate:8},{y:0,opacity:1,filter:'blur(0px)',rotate:0,duration:1.3,ease:'expo.out',stagger:.09,scrollTrigger:{trigger:'footer',start:'top 88%',once:true},onComplete:()=>gsap.to(fc,{y:-9,duration:2.2,ease:'sine.inOut',yoyo:true,repeat:-1,stagger:.16})});
 fc.forEach(c=>c.addEventListener('pointerenter',()=>gsap.fromTo(c,{yPercent:0},{yPercent:-16,duration:.4,yoyo:true,repeat:1,ease:'power2.out'})))}
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const q=e.target;q.classList.add('in');io.unobserve(q);setTimeout(()=>q.style.transitionDelay='0s',1700)}}),{threshold:.12});
$$('.rv').forEach(x=>io.observe(x));
ui();
if('mediaSession' in navigator){navigator.mediaSession.setActionHandler('play',()=>{if(!playing)toggle()});navigator.mediaSession.setActionHandler('pause',()=>{if(playing)toggle()})}
