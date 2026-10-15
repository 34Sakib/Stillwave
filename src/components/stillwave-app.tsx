import React from 'react';

export function StillwaveApp() {
  return (
    <div
      id="stillwave-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
<div class="orbs"><div class="orb"></div><div class="orb"></div><div class="orb"></div></div>
<div class="grain"></div><div class="sp" id="sp"></div><div class="cur" id="cur"></div><div class="pts" id="pts"></div><canvas class="scn" id="scene"></canvas><canvas class="ctrail" id="ctrail"></canvas><div class="cring" id="cring"><span></span></div><div class="cdot" id="cdot"></div>

<nav><div class="pill">
  <a class="logo" href="#top"><svg viewBox="0 0 24 24" class="logo-wave" aria-hidden="true"><path class="wave-track" d="M -24 12 Q -18 5, -12 12 T 0 12 Q 6 5, 12 12 T 24 12 Q 30 5, 36 12 T 48 12"/></svg>Stillwave</a>
  <div class="links"><a href="#/library" id="nl">Soundscapes</a><a href="#intentions">Intentions</a><a href="#rituals">Rituals</a></div>
  <div class="nr">
    <button class="badge" id="nb" aria-label="Open now playing"><span class="dot"></span><span class="nm" id="nbn">Silence</span></button>
    <button class="ib guitar-btn" id="nmoon" aria-label="Acoustic sanctuary modes"><svg viewBox="0 0 100 100" class="guitar-badge-icon" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="guitarBadgeClip"><circle cx="50" cy="50" r="37.5"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="#181A1B"/><circle cx="50" cy="50" r="44.5" stroke="#54A5B5" stroke-width="2.2"/><circle cx="50" cy="50" r="41.2" stroke="#E59E3F" stroke-width="2.4"/><circle cx="50" cy="50" r="37.5" stroke="#54A5B5" stroke-width="2.2" fill="#202325"/><g clip-path="url(#guitarBadgeClip)"><rect width="100" height="100" fill="#222527"/><g transform="translate(50, 52) rotate(-43)"><path d="M -26 -10 C -26 -28, -14 -38, 0 -38 C 14 -38, 26 -28, 26 -10 C 26 2, 17 8, 22 22 C 27 36, 18 50, 0 50 C -18 50, -27 36, -22 22 C -17 8, -26 2, -26 -10 Z" fill="#69ABB7"/><path d="M 0 -8 C 14 -8, 22 0, 22 18 L 38 48 L 0 48 Z" fill="#0F1618" fill-opacity="0.45"/><circle cx="0" cy="-6" r="14.5" stroke="#89C8D3" stroke-width="1.6" fill="#1C2123"/><circle cx="0" cy="-6" r="11.5" stroke="#528A94" stroke-width="1.2" fill="#0C0E0F"/><path d="M -7.5 -52 L 7.5 -52 L 7.5 -4 L -7.5 -4 Z" fill="#3D4448"/><line x1="-7.5" y1="-48" x2="7.5" y2="-48" stroke="#7E878C" stroke-width="0.7"/><line x1="-7.5" y1="-42" x2="7.5" y2="-42" stroke="#7E878C" stroke-width="0.7"/><line x1="-7.5" y1="-35" x2="7.5" y2="-35" stroke="#7E878C" stroke-width="0.7"/><line x1="-7.5" y1="-27" x2="7.5" y2="-27" stroke="#7E878C" stroke-width="0.7"/><line x1="-7.5" y1="-18" x2="7.5" y2="-18" stroke="#7E878C" stroke-width="0.7"/><line x1="-7.5" y1="-9" x2="7.5" y2="-9" stroke="#7E878C" stroke-width="0.7"/><circle cx="0" cy="-45" r="1.1" fill="#FFFFFF"/><circle cx="0" cy="-38.5" r="1.1" fill="#FFFFFF"/><circle cx="0" cy="-31" r="1.1" fill="#FFFFFF"/><circle cx="0" cy="-22.5" r="1.1" fill="#FFFFFF"/><rect x="-10" y="24" width="20" height="4.5" rx="1.5" fill="#262B2E"/><line x1="-5" y1="-52" x2="-5" y2="25" stroke="#DFE7EA" stroke-width="0.7" stroke-opacity="0.9"/><line x1="-3" y1="-52" x2="-3" y2="25" stroke="#DFE7EA" stroke-width="0.7" stroke-opacity="0.9"/><line x1="-1" y1="-52" x2="-1" y2="25" stroke="#DFE7EA" stroke-width="0.7" stroke-opacity="0.9"/><line x1="1" y1="-52" x2="1" y2="25" stroke="#DFE7EA" stroke-width="0.7" stroke-opacity="0.9"/><line x1="3" y1="-52" x2="3" y2="25" stroke="#DFE7EA" stroke-width="0.7" stroke-opacity="0.9"/><line x1="5" y1="-52" x2="5" y2="25" stroke="#DFE7EA" stroke-width="0.7" stroke-opacity="0.9"/></g></g></svg></button>
  </div>
</div></nav>

<main id="top"><div id="home"><div class="himg" id="himg" aria-hidden="true"><i></i></div>
<div class="wrap hero">
  
  
  <h1><span class="w" style="--i:0">A</span> <span class="w" style="--i:1">sanctuary</span> <span class="w" style="--i:2">for</span> <em class="w" style="--i:3">wandering</em> <span class="w" style="--i:4">minds.</span></h1>
  <p class="sub">Forty synthesized soundscapes, one at a time. Step away from the noise of the day and let the room change color around you.</p>
  <div class="cta"><button class="btn p" id="begin">Begin Session</button><a class="btn g" href="#/library">Explore Soundscapes</a></div>
  <canvas class="wv" id="wv"></canvas><a class="cue" href="#favourite">Scroll</a>
</div>

<div class="mq" aria-hidden="true"><div class="mt" id="mt"></div></div>

<section id="favourite" style="padding:80px 0 0"><div class="wrap"><div class="card fvb rv" data-id="universe" data-cw="960" data-ch="420"><div class="art" id="favart"></div>
<div class="fvt"><span class="fvk">Listener favourite</span><h3>Universe</h3><p>Deep space pads that swell slowly, like warm light spreading across a very large sky. The one most people keep coming back to.</p>
<div class="fvc"><span>Deep space pads</span><span>Seamless loop</span><span>Best with headphones</span></div></div>
<div class="fvo"><i class="r1"></i><i class="r2"></i><i class="r3"></i><i class="orb"></i><span class="pb">&#9654;</span></div>
<div class="fvw"><i style="--d:0.00;--s:0.35"></i><i style="--d:0.14;--s:0.85"></i><i style="--d:0.27;--s:0.64"></i><i style="--d:0.41;--s:0.42"></i><i style="--d:0.55;--s:0.92"></i><i style="--d:0.69;--s:0.71"></i><i style="--d:0.82;--s:0.49"></i><i style="--d:0.96;--s:0.99"></i><i style="--d:0.10;--s:0.78"></i><i style="--d:0.23;--s:0.56"></i><i style="--d:0.37;--s:0.35"></i><i style="--d:0.51;--s:0.85"></i><i style="--d:0.64;--s:0.64"></i><i style="--d:0.78;--s:0.42"></i><i style="--d:0.92;--s:0.92"></i><i style="--d:0.06;--s:0.71"></i><i style="--d:0.19;--s:0.49"></i><i style="--d:0.33;--s:0.99"></i><i style="--d:0.47;--s:0.78"></i><i style="--d:0.60;--s:0.56"></i><i style="--d:0.74;--s:0.35"></i><i style="--d:0.88;--s:0.85"></i><i style="--d:0.01;--s:0.64"></i><i style="--d:0.15;--s:0.42"></i><i style="--d:0.29;--s:0.92"></i><i style="--d:0.43;--s:0.71"></i><i style="--d:0.56;--s:0.49"></i><i style="--d:0.70;--s:0.99"></i><i style="--d:0.84;--s:0.78"></i><i style="--d:0.97;--s:0.56"></i><i style="--d:0.11;--s:0.35"></i><i style="--d:0.25;--s:0.85"></i><i style="--d:0.38;--s:0.64"></i><i style="--d:0.52;--s:0.42"></i><i style="--d:0.66;--s:0.92"></i><i style="--d:0.79;--s:0.71"></i><i style="--d:0.93;--s:0.49"></i><i style="--d:0.07;--s:0.99"></i><i style="--d:0.21;--s:0.78"></i><i style="--d:0.34;--s:0.56"></i><i style="--d:0.48;--s:0.35"></i><i style="--d:0.62;--s:0.85"></i><i style="--d:0.75;--s:0.64"></i><i style="--d:0.89;--s:0.42"></i><i style="--d:0.03;--s:0.92"></i><i style="--d:0.17;--s:0.71"></i><i style="--d:0.30;--s:0.49"></i><i style="--d:0.44;--s:0.99"></i><i style="--d:0.58;--s:0.78"></i><i style="--d:0.71;--s:0.56"></i><i style="--d:0.85;--s:0.35"></i><i style="--d:0.99;--s:0.85"></i><i style="--d:0.12;--s:0.64"></i><i style="--d:0.26;--s:0.42"></i><i style="--d:0.40;--s:0.92"></i><i style="--d:0.54;--s:0.71"></i></div></div></div></section>
<section id="soundscapes"><div class="wrap">
  <div class="sh rv"><div><div class="kick">Featured sounds</div><h2>Forty rooms, <em>one at a time.</em></h2></div><p class="note">Choosing a new sound crossfades the old one out. The whole interface takes on its color.</p></div>
  <div class="grid" id="grid"></div>
  <div style="text-align:center;margin-top:48px"><a class="btn g" href="#/library" style="display:inline-block">Browse All &rarr;</a></div>
  <div class="sh rv" style="margin:110px 0 36px"><div><div class="kick">Browse by mood</div><h2>Find your <em>state.</em></h2></div><p class="note">Sounds grouped by what they do for you. Open one to see them all.</p></div>
  <div class="ixg" id="cols"></div>
</div></section>

<section id="intentions"><div class="wrap">
  <div class="sh rv"><div><div class="kick">Start with a goal</div><h2>Start with <em>what you need.</em></h2></div><p class="note">Each intention opens with its lead sound and lines up a companion in the side panel.</p></div>
  <div class="ixg" id="ixg"></div>
</div></section>

<section id="rituals"><div class="wrap">
  <div class="sh rv"><div><div class="kick">Through the day</div><h2>A day, <em>scored.</em></h2></div></div>
  <div class="rt" id="rt"></div>
</div></section>
</div>
<div id="library" hidden><div class="wrap" style="padding:140px 0 60px;min-height:100svh"><a class="back" href="#top">&larr; Home</a><div class="sh"><div><div class="kick">Library</div><h2>All <em>soundscapes.</em></h2></div><p class="note" id="lc2"></p></div><div class="lbar"><label class="qs"><svg class="ico" viewBox="0 0 24 24" style="color:var(--t3);flex:none"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="qs" type="search" placeholder="Search all sounds" autocomplete="off" aria-label="Search sounds"></label><div class="fl" id="fl"></div></div><div class="grid" id="lgrid"></div></div></div>
<footer><b class='fb'>STILLWAVE</b><span>Calm sound for focus, sleep and quiet.</span><span class='fc'>Every sound is generated live in your browser, except Universe. Headphones recommended. Press Space to play or pause, and the arrow keys to switch sounds.</span></footer>
</main>

<div class="dock" id="dock">
  <button class="dk" id="dko" aria-label="Open now playing"><div class="th" id="dkt"></div><div style="min-width:0"><b id="dkn">Nothing playing</b><span id="dks">Choose a soundscape</span></div></button>
  <button class="tm-b" id="dtm"><i></i><svg class="ico" viewBox="0 0 24 24" style="width:13px;height:13px"><path d="M20 14.500A8 8 0 019.500 4 8 8 0 1020 14.500z"/></svg><span id="dtt">Timer</span></button>
  <div class="vol"><svg class="ico" viewBox="0 0 24 24" style="color:var(--t3);flex:none"><path d="M4 9v6h4l5 4V5L8 9H4zM17 9a4 4 0 010 6"/></svg><input type="range" id="v1" min="0" max="100" value="70" aria-label="Volume"></div>
  <button class="ib" id="dtog" aria-label="Toggle now playing panel" style="border:1px solid var(--hair)"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M15 4v16"/></svg></button><button class="play" id="dp" aria-label="Play or pause"></button>
</div>

<button class="tab" id="tab" aria-label="Open or close now playing panel"><span class="eq"><s></s><s></s><s></s></span><span class="tl">Now Playing</span><svg class="ico" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Now playing">
  <div class="dh"><div class="kick">Now Playing</div><button class="ib" id="dc" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
  <div class="bigart" id="bart"></div>
  <div class="dt"><h3 id="dn">Silence</h3><p id="dsb">Pick a soundscape to begin.</p><div class="cred" id="cred"></div><div class="meta" id="dm">— Hz &nbsp;·&nbsp; seamless loop</div></div>
  <canvas class="dv" id="dv"></canvas>
  <div class="ctl">
    <button class="ib sk" id="prv" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M19 5L9 12l10 7zM5 5v14"/></svg></button>
    <button class="play" id="dp2" aria-label="Play or pause"></button>
    <button class="ib sk" id="nxt" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M5 5l10 7-10 7zM19 5v14"/></svg></button>
  </div>
  <button class="btn g" id="dshare" style="display:flex;align-items:center;justify-content:center;gap:10px"><svg class="ico" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/></svg>Share this sound with friends</button>
  <div class="blk"><div class="lb"><span>Volume</span><span id="vp">70%</span></div><input type="range" id="v2" min="0" max="100" value="70" aria-label="Volume"></div>
  <div class="blk" id="tb"><div class="lb"><span>Sleep timer</span><span id="tst">Off</span></div>
    <div class="clock" id="clk">00:00</div>
    <div class="chips" id="tch"><button class="chip" data-m="15">15m</button><button class="chip" data-m="30">30m</button><button class="chip" data-m="60">60m</button><button class="chip" data-m="5" data-add="1">+5m</button><button class="chip" id="toff">Off</button></div>
    <div class="hint">Ends with a 30 second fade-out.</div></div>
  <div><div class="kick" style="margin-bottom:6px">Recommended</div><p style="color:var(--t3);font-size:13px;margin-bottom:10px" id="rwhy">Pairs well with what you are hearing.</p><div id="recs"></div></div>
</aside>

<!-- INLINE SCRIPT #3 OMITTED -->
<!-- UNI-DATA OMITTED (5.5MB) -->
` }}
    />
  );
}
