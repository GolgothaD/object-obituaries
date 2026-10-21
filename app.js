const G=JSON.parse(localStorage.obits||'[]'),pick=a=>a[Math.floor(Math.random()*a.length)],$=i=>document.getElementById(i);
const save=()=>localStorage.obits=JSON.stringify(G),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CAUSE={'dropped':['fell from a great height, as heroes often do','met the kitchen floor in a final, tragic embrace','slipped from our grasp, both literally and spiritually'],
'drowned':['was taken by the waters, like a tiny Titanic','went for one last swim and never came back up','perished in a liquid catastrophe no one saw coming'],
'simply wore out':['gave everything it had until there was nothing left','grew tired, as all things do','faded quietly, the way legends do'],
'was thrown away':['was sent to the great landfill in the sky','was released from service with full honors and a trash bag','departed by the curb on a cold Lansing Tuesday'],
'was lost forever':['vanished without a trace, and its whereabouts remain a mystery','wandered off into the void between the couch cushions','left us for the realm of lost socks'],
'burned':['went out in a blaze of glory','was consumed by flame, as foretold','met a fiery end worthy of a Viking'],
'was sat on':['was crushed beneath the weight of an unsuspecting rear','was flattened in a seating-related tragedy','died as it lived: underneath someone'],
'was eaten by the dog':['was consumed by a very good boy','became a snack in its final hour','was devoured, and the dog shows no remorse'],
'mysterious circumstances':['died under circumstances the authorities are still investigating','was found lifeless, and nobody is talking','perished, and the cat knows something']};
const OPEN=["It is with heavy hearts that we announce the passing of %N.","%N has left us.","Today the world is a little dimmer: %N is gone.","Let the record show that %N has departed this mortal plane.","We gather to mourn %N, taken from us far too soon. Or right on time. Opinions vary."];
const LIFE=["For %Y, it stood by Toothless through thick and thin.","In %Y of loyal service, it never once asked for anything but %C.","Over %Y, it witnessed things no object should see.","It served faithfully for %Y, which in object years is basically forever."];
const TRAIT=["It will be remembered for how it %T, a quirk we pretended to hate but secretly loved.","Friends recall that it %T, and honestly, that was its whole personality.","It %T. It never apologized for it. Icon behavior.","Those who knew it best remember that it %T, every single time."];
const CLOSE=["It is survived by its charger, a receipt, and a very confused owner.","In lieu of flowers, the family requests you buy a replacement on sale.","A small service will be held near the trash can. Snacks provided.","It is now at peace, probably in a drawer of electronics heaven.","Rest in pieces.","Gone but not forgotten, until the replacement arrives in 2-day shipping."];
const NEEDS={0:'occasional dusting',1:'a little respect'};
function yrs(y){y=+y;return y<1?`${Math.round(y*12)||1} month${Math.round(y*12)===1?'':'s'}`:`${y} year${y==1?'':'s'}`}
function compose(o){const n=o.name,Y=yrs(o.yrs),trait=(o.trait||'never complained').replace(/^(it )?/i,'');
 return[pick(OPEN),`On this day, it ${pick(CAUSE[o.cause])}.`,pick(LIFE).replace('%C',pick(['a charge','a gentle touch','to be left alone','batteries','love'])),pick(TRAIT).replace('%T',trait),pick(CLOSE)].join(' ').replace(/%N/g,n).replace(/%Y/g,Y)}
function show(o){$('out').innerHTML=`<div class="paper"><h2>${esc(o.name)}</h2><div class="dates">${yrs(o.yrs)} of service · ${new Date(o.at).toLocaleDateString()}</div><p>${esc(o.text)}</p><button id="share">📷 Share as image</button></div>`;$('share').onclick=()=>shareImg(o);$('out').scrollIntoView({behavior:'smooth'})}
function wrap(c,t,x,y,w,lh){const ws=t.split(' ');let l='';for(const w2 of ws){const tl=l+w2+' ';if(c.measureText(tl).width>w&&l){c.fillText(l,x,y);l=w2+' ';y+=lh}else l=tl}c.fillText(l,x,y);return y}
async function shareImg(o){const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;const c=cv.getContext('2d');
 try{await document.fonts.load('80px UnifrakturMaguntia');await document.fonts.load('40px "EB Garamond"')}catch(e){}
 c.fillStyle='#0f1410';c.fillRect(0,0,1080,1350);c.fillStyle='#f1e9d2';c.fillRect(60,60,960,1230);c.strokeStyle='#3b2f22';c.lineWidth=6;c.strokeRect(90,90,900,1170);
 c.fillStyle='#2a2418';c.textAlign='center';c.font='60px UnifrakturMaguntia';c.fillText('In Loving Memory',540,190);c.font='bold 72px "EB Garamond"';wrap(c,o.name,540,300,820,80);
 c.font='italic 36px "EB Garamond"';c.fillText(`${yrs(o.yrs)} of service · ${new Date(o.at).toLocaleDateString()}`,540,390);c.textAlign='left';c.font='38px "EB Garamond"';wrap(c,o.text,150,480,780,52);
 c.textAlign='center';c.font='italic 28px "EB Garamond"';c.fillText('Object Obituaries · golgothad.github.io/object-obituaries',540,1220);
 cv.toBlob(async b=>{const f=new File([b],'obituary.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'RIP '+o.name});return}catch(e){}}const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='obituary-'+o.name.replace(/\W+/g,'-')+'.png';a.click()})}
function yard(){$('yard').innerHTML=G.length?G.map((o,i)=>`<div class="stone" data-i="${i}"><b>${esc(o.name)}</b>RIP<br>${new Date(o.at).getFullYear()}</div>`).join(''):'<p style="grid-column:1/-1;text-align:center">The graveyard is empty. Your stuff is safe... for now.</p>'}
$('yard').onclick=e=>{const s=e.target.closest('.stone');if(s)show(G[s.dataset.i])};
$('write').onclick=()=>{const n=$('name').value.trim();if(!n)return $('name').focus();const o={name:n,yrs:$('yrs').value||1,cause:$('cause').value,trait:$('trait').value.trim(),at:Date.now()};o.text=compose(o);G.unshift(o);save();yard();show(o);$('name').value='';$('trait').value=''};
yard();
