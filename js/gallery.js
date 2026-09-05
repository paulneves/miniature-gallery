let catalog={miniatures:[]};
const $=s=>document.querySelector(s);
const gallery=$('#gallery'),search=$('#search'),universe=$('#universe'),faction=$('#faction'),subfaction=$('#subfaction'),viewer=$('#viewer');
const unique=arr=>[...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));

function optionList(el,values,label,current=''){
  el.innerHTML=`<option value="">All ${label}</option>`+values.map(v=>`<option ${v===current?'selected':''}>${v}</option>`).join('');
}

function imageOf(m){
  return (m.images||[]).find(i=>i.type==='miniature')||(m.images||[])[0]||{url:''};
}

// Cards always prefer a lightweight thumbnail. If no thumbnail is configured,
// they fall back to the full image URL for backwards compatibility.
function thumbnailUrl(im){
  return im.thumbnail||im.thumb||im.url||'';
}

// The viewer loads the original/full-resolution image only after the user opens
// a miniature and selects that image.
function fullUrl(im){
  return im.url||im.full||im.thumbnail||im.thumb||'';
}

function refreshFilters(){
  const u=universe.value,f=faction.value,s=subfaction.value;
  optionList(universe,unique(catalog.miniatures.map(m=>m.universe)),'universes',u);
  let list=catalog.miniatures.filter(m=>!u||m.universe===u);
  optionList(faction,unique(list.map(m=>m.faction)),'factions',f);
  list=list.filter(m=>!f||m.faction===f);
  optionList(subfaction,unique(list.map(m=>m.subfaction)),'subfactions',s);
}

function filtered(){
  const q=search.value.trim().toLowerCase();
  return catalog.miniatures.filter(m=>(!universe.value||m.universe===universe.value)&&(!faction.value||m.faction===faction.value)&&(!subfaction.value||m.subfaction===subfaction.value)&&(!q||[m.name,m.universe,m.faction,m.subfaction,m.description,...(m.tags||[])].filter(Boolean).join(' ').toLowerCase().includes(q)));
}

function render(){
  const items=filtered();
  $('#count').textContent=`${items.length} miniature${items.length===1?'':'s'}`;
  $('#empty').hidden=items.length>0;
  gallery.innerHTML=items.map(m=>{
    const im=imageOf(m);
    return `<article class="card" data-id="${m.id}" tabindex="0"><div class="thumb"><img loading="lazy" decoding="async" src="${thumbnailUrl(im)}" alt="${m.name}" onerror="this.style.opacity='.18'"></div><div class="card-body"><div class="path">${[m.universe,m.faction,m.subfaction].filter(Boolean).join(' · ')}</div><h2>${m.name}</h2><span class="badge">${(m.images||[]).length} image${(m.images||[]).length===1?'':'s'}</span></div></article>`;
  }).join('');
  gallery.querySelectorAll('.card').forEach(c=>{
    c.onclick=()=>openItem(c.dataset.id);
    c.onkeydown=e=>{if(e.key==='Enter')openItem(c.dataset.id)};
  });
}

function openItem(id){
  const m=catalog.miniatures.find(x=>x.id===id);
  if(!m)return;
  $('#viewer-title').textContent=m.name;
  $('#viewer-path').textContent=[m.universe,m.faction,m.subfaction].filter(Boolean).join(' / ');
  $('#viewer-description').textContent=m.description||'';
  $('#viewer-tags').innerHTML=(m.tags||[]).map(t=>`<span>${t}</span>`).join('');
  const tabs=$('#image-tabs');
  tabs.innerHTML=(m.images||[]).map((im,i)=>`<button data-i="${i}">${im.title||im.type||`Image ${i+1}`}</button>`).join('');
  tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>showImage(m,+b.dataset.i));
  showImage(m,0);
  viewer.showModal();
}

function showImage(m,i){
  const im=(m.images||[])[i];
  if(!im)return;
  const viewerImage=$('#viewer-image');
  viewerImage.src=fullUrl(im);
  viewerImage.alt=im.title||m.name;
  document.querySelectorAll('#image-tabs button').forEach((b,n)=>b.classList.toggle('active',n===i));
  const link=$('#source-link');
  if(im.link){
    link.href=im.link;
    link.hidden=false;
    link.textContent=im.credit?`Source: ${im.credit} ↗`:'Open source page ↗';
  }else{
    link.hidden=true;
    link.removeAttribute('href');
  }
}

[universe,faction,subfaction].forEach(el=>el.addEventListener('change',()=>{refreshFilters();render()}));
search.addEventListener('input',render);
$('#close').onclick=()=>viewer.close();
viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});

fetch('catalog.json',{cache:'no-store'})
  .then(r=>{if(!r.ok)throw new Error('catalog.json not found');return r.json()})
  .then(data=>{
    catalog=data;
    const site=data.site||{};
    $('#site-title').textContent=site.title||'Miniature Painting Collection';
    $('#site-subtitle').textContent=site.subtitle||'';
    $('#eyebrow').textContent=site.eyebrow||'COLLECTION';
    document.title=site.title||document.title;
    if(site.accent)document.documentElement.style.setProperty('--accent',site.accent);
    refreshFilters();
    render();
  })
  .catch(err=>{gallery.innerHTML=`<p>Unable to load catalogue: ${err.message}</p>`});
