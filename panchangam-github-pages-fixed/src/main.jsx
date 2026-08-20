import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import html2canvas from 'html2canvas';
import QRCode from 'qrcodejs';
import './styles.css';

const DEFAULT_MAP='https://maps.app.goo.gl/Et1CF7GhusVkcUgbA';
const DEFAULT_PHONE='919866121314';
const SAMPLE=`*శ్రీమతే రామానుజాయ నమః🙏

*ఈ రోజు.... పిండపితృయజ్ఞః, చుక్కలమావాస్య, గురుమౌఢ్యనివేత్తిః.....🚩🛕🚩.....*

తేదీ:- 12, ఆగష్టు 2026
సంవత్సరం:- శ్రీ పరాభవ
అయనం:- దక్షిణాయనం
ఋతువు:- గ్రీష్మఋతువు
మాసం:- ఆషాఢమాసం
పక్షం:- బహుళపక్షం
తిథి:- అమావాస్య రా.11.24 వరకు
వారం:- బుధవారం (సౌమ్యవాసరే)
నక్షత్రం:- పుష్యమి ఉ.08.49 వరకు
యోగం:- వ్యతీపాతం సా.05.36 వరకు
కరణం:- చతుష్పాత్ మ.12.42 వరకు
తదుపరి నాగవం రా.11.41 వరకు
వర్జ్యం:- రా.09.00 - 10.31 వరకు
దుర్ముహూర్తము:- ఉ.11.36 - 12.24 వరకు
అమృతకాలం:- లేదు
రాహుకాలం:- మ.12.00 - 01.30 వరకు
యమగండ/కేతుకాలం:- ఉ.07.30 - 09.00 వరకు
సూర్యరాశి:- కర్కాటకం
చంద్రరాశి:- కర్కాటకం
సూర్యోదయం:- 05.58
సూర్యాస్తమయం:- 06.44

*జై శ్రీమన్నారాయణ!🙏*`;

function parsePanchangam(text){
 const lines=text.split('\n').map(x=>x.trim()).filter(Boolean); let data=[],date='',todayMessage='';
 lines.forEach(line=>{const clean=line.replace(/\*/g,'').trim();
  if(clean.startsWith('తేదీ')){const p=clean.split(/[:-]+/); if(p.length>1) date=p.slice(1).join(':').trim(); return;}
  if(clean.includes('ఈ రోజు')||clean.includes('పిండపితృ')||clean.includes('చుక్కలమావాస్య')){todayMessage=clean.replace(/^[•\-*]+/,'').trim();return;}
  if(clean.includes(':-')||clean.includes(':')){const d=clean.includes(':-')?':-':':';const p=clean.split(d);const label=p.shift().trim();const value=p.join(d).trim();if(label&&value)data.push({label,value});}
  else if(clean.startsWith('తదుపరి')&&data.length)data[data.length-1].value+=' | '+clean;
 }); return {date,todayMessage,data};
}

function QR({value,label,type}){const ref=useRef(null);useEffect(()=>{if(!ref.current)return;ref.current.innerHTML='';new QRCode(ref.current,{text:value,width:100,height:100,colorDark:'#222',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M});},[value]);return <div className="qr-container"><div ref={ref} className="qr-box"/><div className={`qr-label ${type}`}>{label}</div></div>}

function App(){
 const [text,setText]=useState(''); const [theme,setTheme]=useState('classic'); const [fontSize,setFontSize]=useState(23); const [mapUrl,setMapUrl]=useState(DEFAULT_MAP); const [phone,setPhone]=useState(DEFAULT_PHONE); const [images,setImages]=useState([null,null,null,null]); const posterRef=useRef(null);
 const result=parsePanchangam(text); const sunrise=result.data.find(x=>x.label.includes('సూర్యోదయం'))?.value||'--'; const sunset=result.data.find(x=>x.label.includes('సూర్యాస్తమయం'))?.value||'--';
 useEffect(()=>{document.documentElement.style.setProperty('--grid-font-size',fontSize+'px')},[fontSize]);
 const upload=(i,file)=>{if(!file)return;const r=new FileReader();r.onload=e=>setImages(a=>a.map((x,j)=>j===i?e.target.result:x));r.readAsDataURL(file)};
 const download=async()=>{const canvas=await html2canvas(posterRef.current,{scale:2,useCORS:true,backgroundColor:null});const a=document.createElement('a');a.download=`Panchangam_${new Date().toISOString().slice(0,10)}.png`;a.href=canvas.toDataURL('image/png');a.click()};
 const whatsapp=async()=>{if(!text.trim()){alert('Please enter panchangam text first!');return;}const canvas=await html2canvas(posterRef.current,{scale:2,useCORS:true});canvas.toBlob(async blob=>{const file=new File([blob],`Panchangam_${new Date().toISOString().slice(0,10)}.png`,{type:'image/png'});if(navigator.canShare?.({files:[file]})){try{await navigator.share({title:'Daily Panchangam - Sai Teja Jewellery Works',text:`నమస్కారం! ఈ రోజు పంచాంగం - Sai Teja Jewellery Works\n📍 Store Location: ${mapUrl}`,files:[file]});return}catch(e){if(e.name==='AbortError')return;}}const msg=text.trim()+`\n\n✨ *Sai Teja Jewellery Works*\n📞 9866121314 | 9553121314\n📍 Beside Siddhartha Model High School, Kamalanagar, Vanasthalipuram, Hyderabad\n🗺️ Google Maps: ${mapUrl}`;window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(msg),'_blank');},'image/png')};
 const waUrl=`https://wa.me/${(phone||DEFAULT_PHONE).replace(/\D/g,'')}?text=${encodeURIComponent('నమస్కారం! Sai Teja Jewellery Works')}`;
 const imageDefaults=['https://lh3.googleusercontent.com/_NdVN8kpI-Pql1sA1DNyBMANzjNwFjSaFEROOkqrcQeJAhn8ahLsH3U9yYfk0kPXwHGJLelZSyEGZ1lFFg=w1265?auto=format&fit=crop&w=600&q=80','https://lh3.googleusercontent.com/szCYwgVzcsivXaQYDcgJsWZUH67b7OS4E6KAVL_Z7bBL9V6TIRR9ppSUZR2eS0tNBAKYJMZ9hdqo6Fy71w=w1265?auto=format&fit=crop&w=600&q=80','https://lh3.googleusercontent.com/Ax6RK-_mS_BdotKgVH6QTSnALBzbouSQOmb1wNZ5Ohdv3q4k4J8YKurMp-8YVRpBdIFto4cudTX1kMNy9w=w1265?auto=format&fit=crop&w=600&q=80','https://lh3.googleusercontent.com/G-_v4bXdzKcjzJORgfbD81pEeZVGjNJS2vHHn5Tkntbd8hoRDOGoDioLwNHhV2nRTLYNgQXSRvYNZKeNKA=w1265?auto=format&fit=crop&w=600&q=80'];
 return <><div className="controls-container"><h2>🛕 Daily Panchangam Poster Generator</h2><div className="toolbar"><div className="toolbar-group"><label>🎨 Theme:</label><select value={theme} onChange={e=>setTheme(e.target.value)}><option value="classic">Traditional Yellow</option><option value="royal-gold">Royal Gold</option><option value="maroon">Deep Maroon</option></select></div><div className="toolbar-group"><label>🔠 Telugu Text Size:</label><div className="font-stepper"><button onClick={()=>setFontSize(Math.max(16,fontSize-1))}>−</button><span>{fontSize}px</span><button onClick={()=>setFontSize(Math.min(30,fontSize+1))}>+</button></div></div><div className="toolbar-group"><label>📍 Location Link:</label><input value={mapUrl} onChange={e=>setMapUrl(e.target.value)} /></div><div className="toolbar-group"><label>📱 WhatsApp No:</label><input value={phone} onChange={e=>setPhone(e.target.value)} /></div></div><p>Paste Telugu Panchangam text below (changes apply instantly):</p><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your panchangam text here..."/><div className="uploads-grid">{[0,1,2,3].map(i=><div className="upload-box" key={i}><label>Image {i+1}</label><input type="file" accept="image/*" onChange={e=>upload(i,e.target.files[0])}/></div>)}</div><div className="action-buttons"><button className="whatsapp-btn" onClick={whatsapp}>📲 Share to WhatsApp</button><button onClick={download}>📥 Download Image (PNG)</button><button className="sample-btn" onClick={()=>setText(SAMPLE)}>📋 Load Sample</button><button className="secondary" onClick={()=>window.print()}>🖨️ Print / Save PDF</button><button className="clear-btn" onClick={()=>setText('')}>🗑️ Clear Text</button></div></div>
 <div className="poster-wrapper"><div ref={posterRef} className="poster" data-theme={theme==='classic'?undefined:theme}><div><div className="panchangam-header"><div className="om-symbol">🛕 🙏 🛕</div><div className="main-title">శ్రీమతే రామానుజాయ నమః</div><div className="sub-title">{result.todayMessage||'ఈ రోజు పంచాంగం'}</div></div><div className="date-box">📅 {result.date||'తేదీ'}</div><div className="panchangam-content"><div className="panchangam-grid">{result.data.filter(x=>!x.label.includes('సూర్యోదయం')&&!x.label.includes('సూర్యాస్తమయం')).map((x,i)=><div className="panchang-item" key={i}><span className="panchang-label">{x.label}:</span><span className="panchang-value">{x.value}</span></div>)}</div><div className="sun-section"><div className="sun-box">🌅 సూర్యోదయం: {sunrise}</div><div className="sun-box">🌇 సూర్యాస్తమయం: {sunset}</div></div></div></div><div className="branding"><div className="shop-name">SAI TEJA</div><div className="shop-subtitle">JEWELLERY WORKS</div><div className="tagline">ALL TYPES OF GOLD & SILVER ORNAMENTS MAKER</div><div className="jewellery-gallery">{imageDefaults.map((src,i)=><div className="jewellery-card" key={i}><img src={images[i]||src} crossOrigin="anonymous"/></div>)}</div><div className="hallmark">91.6 KDM GOLD • BIS HALLMARK AVAILABLE</div><div className="services"><div className="service">💍<br/>బంగారం & వెండి<br/>ఆభరణాలు</div><div className="service">💎<br/>మీకు నచ్చిన డిజైన్‌లో<br/>ఆర్డర్‌పై తయారీ</div><div className="service">🪔<br/>వెండి పూజా వస్తువులు<br/>లభించును</div></div><div className="contact-wrapper"><QR value={mapUrl||DEFAULT_MAP} label="📍 Location Map" type="map-label"/><div className="contact-info"><div className="phone">📞 9866121314 | 9553121314</div><div className="address">📍 Beside Siddhartha Model High School, Kamalanagar, Vanasthalipuram, Hyderabad – 500070</div><div className="instagram">📱 Instagram: @saitejajewellery</div></div><QR value={waUrl} label="💬 WhatsApp Chat" type="wa-label"/></div></div></div></div></div></>;
}
createRoot(document.getElementById('root')).render(<App/>);
