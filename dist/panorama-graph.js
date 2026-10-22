(function(){
  'use strict';

  const COLORS={l1:'#d8b572',l2:'#5ec8d8',l3:'#5fcf9b',l4:'#a78bfa',metric:'#7dd3fc'};
  const LABELS={l1:'责任中心',l2:'业务域',l3:'对象',l4:'主题',metric:'指标'};
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

  function unique(values){return [...new Set(values.filter(Boolean))]}
  function pairKey(a,b){return `${a}\u0000${b}`}

  function buildModel(){
    const source=window.KG_DATA||{directory:[],topicMetrics:{},relations:[]};
    const rows=source.directory||[],topicMetrics=source.topicMetrics||{},metricInfo=source.metricInfo||{};
    const groups={
      l1:unique(rows.map(x=>x['责任中心'])),
      l2:unique(rows.map(x=>x['业务域'])),
      l3:unique(rows.map(x=>x['对象'])),
      l4:unique(rows.map(x=>x['主题'])),
      metric:unique(Object.values(topicMetrics).flat())
    };
    const nodes=[],byKey=new Map();
    Object.entries(groups).forEach(([type,names])=>names.forEach((label,index)=>{
      const node={id:`${type}:${label}`,type,label,index,published:type==='metric'?metricInfo[label]?.['指标是否已注册']==='是':null,x:0,y:0,vx:0,vy:0,targetX:0,targetY:0};
      nodes.push(node);byKey.set(pairKey(type,label),node);
    }));
    const edges=[],seen=new Set();
    const add=(sourceNode,targetNode,kind='hierarchy',name='')=>{
      if(!sourceNode||!targetNode)return;
      const key=`${sourceNode.id}>${targetNode.id}:${kind}:${name}`;
      if(seen.has(key))return;seen.add(key);
      edges.push({source:sourceNode,target:targetNode,kind,name});
    };
    rows.forEach(row=>{
      add(byKey.get(pairKey('l1',row['责任中心'])),byKey.get(pairKey('l2',row['业务域'])));
      add(byKey.get(pairKey('l2',row['业务域'])),byKey.get(pairKey('l3',row['对象'])));
      add(byKey.get(pairKey('l3',row['对象'])),byKey.get(pairKey('l4',row['主题'])));
    });
    Object.entries(topicMetrics).forEach(([topic,metrics])=>metrics.forEach(metric=>add(byKey.get(pairKey('l4',topic)),byKey.get(pairKey('metric',metric)))));
    add(byKey.get(pairKey('l3','渠道')),byKey.get(pairKey('l3','客户')),'relation','关联');
    (source.relations||[]).forEach(rel=>add(byKey.get(pairKey('metric',rel.source)),byKey.get(pairKey('metric',rel.target)),'relation',rel.name||'关联'));
    return {nodes,edges,groups};
  }

  class PanoramaGraph{
    constructor(canvas){
      this.canvas=canvas;this.ctx=canvas.getContext('2d');this.model=buildModel();
      this.nodes=this.model.nodes;this.edges=this.model.edges;this.dpr=1;this.W=0;this.H=0;
      this.scale=1;this.tx=0;this.ty=0;this.dragNode=null;this.pan=null;this.hover=null;this.focus=null;
      this.pointerMoved=false;this.alpha=.28;this.raf=0;this.paused=canvas.dataset.paused==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.resizeObserver=new ResizeObserver(()=>this.resize());
      this.bind();this.resizeObserver.observe(canvas.parentElement);this.resize();this.layout();this.fit();this.loop();
    }
    destroy(){cancelAnimationFrame(this.raf);this.resizeObserver.disconnect();this.abort.abort()}
    bind(){
      this.abort=new AbortController();const opt={signal:this.abort.signal};
      this.canvas.addEventListener('pointerdown',e=>this.down(e),opt);
      this.canvas.addEventListener('pointermove',e=>this.move(e),opt);
      this.canvas.addEventListener('pointerup',e=>this.up(e),opt);
      this.canvas.addEventListener('pointercancel',e=>this.up(e),opt);
      this.canvas.addEventListener('pointerleave',()=>{if(!this.dragNode&&!this.pan){this.hover=null;this.hideTip();this.draw()}},opt);
      this.canvas.addEventListener('wheel',e=>this.wheel(e),{...opt,passive:false});
      this.canvas.addEventListener('keydown',e=>this.keydown(e),opt);
      this.canvas.addEventListener('dblclick',()=>this.fit(),opt);
      this.canvas.parentElement.querySelectorAll('[data-panorama-control]').forEach(button=>button.addEventListener('click',()=>{
        const action=button.dataset.panoramaControl;
        if(action==='fit')this.fit();else this.zoom(action==='in'?1.18:.84);
      },opt));
    }
    resize(){
      const rect=this.canvas.parentElement.getBoundingClientRect();
      this.W=Math.max(320,Math.round(rect.width));this.H=Math.max(360,Math.round(rect.height||this.W*.56));this.dpr=Math.min(devicePixelRatio||1,2);
      this.canvas.width=Math.round(this.W*this.dpr);this.canvas.height=Math.round(this.H*this.dpr);
      this.canvas.style.width=`${this.W}px`;this.canvas.style.height=`${this.H}px`;this.draw();
    }
    layout(){
      const layerY={l1:76,l2:180,l3:292,l4:420,metric:565};
      const usable=Math.max(820,this.W-110);
      Object.entries(this.model.groups).forEach(([type,names])=>{
        const count=names.length;
        names.forEach((name,index)=>{
          const node=this.nodes.find(n=>n.type===type&&n.label===name);
          const jitter=(index%2?1:-1)*Math.min(12,count*1.3);
          node.targetX=55+usable*(index+.5)/Math.max(1,count);
          node.targetY=layerY[type]+(type==='metric'?(index%3-1)*22:jitter);
          node.x=node.targetX;node.y=node.targetY;node.vx=0;node.vy=0;
        });
      });
    }
    radius(node){return node.type==='l1'?12:node.type==='l2'?11:node.type==='l3'?10:node.type==='l4'?8:5.5}
    screen(node){return {x:(node.x-this.W/2)*this.scale+this.W/2+this.tx,y:(node.y-this.H/2)*this.scale+this.H/2+this.ty}}
    graphPoint(event){const r=this.canvas.getBoundingClientRect(),px=(event.clientX-r.left)*(this.W/r.width),py=(event.clientY-r.top)*(this.H/r.height);return {x:(px-this.W/2-this.tx)/this.scale+this.W/2,y:(py-this.H/2-this.ty)/this.scale+this.H/2}}
    pick(event){const p=this.graphPoint(event);let best=null,distance=Infinity;for(const node of this.nodes){const d=(node.x-p.x)**2+(node.y-p.y)**2;if(d<distance){distance=d;best=node}}return best&&distance<(this.radius(best)+9/this.scale)**2?best:null}
    down(event){
      const node=this.pick(event);this.canvas.setPointerCapture(event.pointerId);this.pointerMoved=false;
      this.start={x:event.clientX,y:event.clientY};
      if(node){this.dragNode=node;this.focus=node;node.fx=node.x;node.fy=node.y;this.alpha=.22;this.canvas.classList.add('is-dragging');this.announce(`正在拖动${LABELS[node.type]}：${node.label}，已高亮 ${this.incident(node).length} 条关联边`)}
      else{this.pan={x:event.clientX,y:event.clientY,tx:this.tx,ty:this.ty};this.canvas.classList.add('is-panning')}
      this.draw();
    }
    move(event){
      if(this.dragNode){const p=this.graphPoint(event);this.dragNode.x=p.x;this.dragNode.y=p.y;this.dragNode.fx=p.x;this.dragNode.fy=p.y;this.pointerMoved=true;this.alpha=.18;this.draw();return}
      if(this.pan){this.tx=this.pan.tx+event.clientX-this.pan.x;this.ty=this.pan.ty+event.clientY-this.pan.y;this.pointerMoved=true;this.draw();return}
      const node=this.pick(event);if(node!==this.hover){this.hover=node;this.draw()}node?this.showTip(node,event):this.hideTip();this.canvas.style.cursor=node?'grab':'grab';
    }
    up(event){
      const released=this.dragNode;
      if(released){delete released.fx;delete released.fy;released.targetX=released.x;released.targetY=released.y;this.announce(this.pointerMoved?`${LABELS[released.type]} ${released.label} 已移动`:`已选择${LABELS[released.type]}：${released.label}`)}
      this.dragNode=null;this.pan=null;this.canvas.classList.remove('is-dragging','is-panning');
      if(this.canvas.hasPointerCapture(event.pointerId))this.canvas.releasePointerCapture(event.pointerId);
      if(released)this.focus=null;
      this.draw();
    }
    wheel(event){event.preventDefault();const factor=event.deltaY<0?1.12:.89;const before=this.graphPoint(event);this.scale=clamp(this.scale*factor,.42,2.6);const after=this.graphPoint(event);this.tx+=(after.x-before.x)*this.scale;this.ty+=(after.y-before.y)*this.scale;this.draw()}
    zoom(factor){this.scale=clamp(this.scale*factor,.42,2.6);this.draw()}
    fit(){
      const xs=this.nodes.map(n=>n.x),ys=this.nodes.map(n=>n.y),minX=Math.min(...xs)-70,maxX=Math.max(...xs)+70,minY=Math.min(...ys)-48,maxY=Math.max(...ys)+48;
      this.scale=clamp(Math.min((this.W-48)/(maxX-minX),(this.H-52)/(maxY-minY)),.48,1.25);
      this.tx=(this.W/2-(minX+maxX)/2)*this.scale;this.ty=(this.H/2-(minY+maxY)/2)*this.scale;this.draw();
    }
    incident(node){return this.edges.filter(edge=>edge.source===node||edge.target===node)}
    related(node){const result=new Set([node]);this.incident(node).forEach(edge=>{result.add(edge.source);result.add(edge.target)});return result}
    physics(){
      if(this.paused||this.alpha<.006||this.dragNode)return;
      for(const node of this.nodes){node.vx+=(node.targetX-node.x)*.007*this.alpha;node.vy+=(node.targetY-node.y)*.014*this.alpha}
      for(let i=0;i<this.nodes.length;i++)for(let j=i+1;j<this.nodes.length;j++){
        const a=this.nodes[i],b=this.nodes[j];if(a.type!==b.type)continue;let dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy+.1;if(d2>9000)continue;const force=140*this.alpha/d2;a.vx+=dx*force;a.vy+=dy*force;b.vx-=dx*force;b.vy-=dy*force;
      }
      for(const node of this.nodes){node.x+=node.vx;node.y+=node.vy;node.vx*=.82;node.vy*=.82}this.alpha*=.982;
    }
    loop(){cancelAnimationFrame(this.raf);const frame=()=>{this.physics();this.draw();if(!this.paused&&this.alpha>=.006)this.raf=requestAnimationFrame(frame);else this.raf=0};this.raf=requestAnimationFrame(frame)}
    draw(){
      if(!this.ctx||!this.W)return;const c=this.ctx,d=this.dpr;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,this.W,this.H);
      const glow=this.dragNode||this.focus,related=glow?this.related(glow):null;
      c.save();c.translate(this.W/2+this.tx,this.H/2+this.ty);c.scale(this.scale,this.scale);c.translate(-this.W/2,-this.H/2);
      for(const edge of this.edges){
        const active=!!glow&&(edge.source===glow||edge.target===glow),dim=!!glow&&!active;
        c.beginPath();c.moveTo(edge.source.x,edge.source.y);c.lineTo(edge.target.x,edge.target.y);
        c.strokeStyle=active?(edge.kind==='relation'?'#f0cf94':'#74d9eb'):(edge.kind==='relation'?'rgba(216,181,114,.30)':'rgba(116,145,180,.18)');
        c.lineWidth=(active?2.35:edge.kind==='relation'?1.15:.75)/this.scale;c.globalAlpha=dim?.12:active?1:1;
        if(active){c.shadowBlur=11/this.scale;c.shadowColor=c.strokeStyle}else c.shadowBlur=0;
        c.stroke();
        if(edge.kind==='relation'&&(active||this.scale>.82)){const mx=(edge.source.x+edge.target.x)/2,my=(edge.source.y+edge.target.y)/2;c.shadowBlur=0;c.globalAlpha=active?1:.72;c.fillStyle='#eef2f9';c.font=`${Math.max(8,9/this.scale)}px sans-serif`;c.textAlign='center';c.fillText(edge.name,mx,my-5/this.scale)}
      }
      c.shadowBlur=0;
      for(const node of this.nodes){
        const active=node===glow||node===this.hover,dim=related&&!related.has(node),r=this.radius(node);
        c.globalAlpha=dim?.22:1;c.beginPath();c.arc(node.x,node.y,r,0,Math.PI*2);c.fillStyle=COLORS[node.type];
        c.shadowBlur=active?18/this.scale:node.type==='metric'?5/this.scale:9/this.scale;c.shadowColor=COLORS[node.type];c.fill();
        c.lineWidth=(active?2.2:1)/this.scale;c.strokeStyle=active?'#fff':'rgba(255,255,255,.62)';c.stroke();
        if(node.type!=='metric'||active||this.scale>.62){c.shadowBlur=0;c.fillStyle=node.type==='l1'?'#f4e6c8':'#eef2f9';c.font=`${active?'600 ':''}${Math.max(8.5,10/this.scale)}px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif`;c.textAlign='center';c.textBaseline='top';const label=node.label.length>13?`${node.label.slice(0,13)}…`:node.label;c.fillText(label,node.x,node.y+r+7/this.scale)}
      }
      c.restore();c.globalAlpha=1;c.shadowBlur=0;
    }
    keydown(event){
      if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Enter',' '].includes(event.key))return;event.preventDefault();
      if(event.key==='Enter'||event.key===' '){if(this.focus)this.announce(this.summary(this.focus));return}
      const delta=(event.key==='ArrowRight'||event.key==='ArrowDown')?1:-1,index=this.focus?this.nodes.indexOf(this.focus):-1;this.focus=this.nodes[(index+delta+this.nodes.length)%this.nodes.length];this.announce(`${LABELS[this.focus.type]}：${this.focus.label}`);this.draw();
    }
    summary(node){const base=`${LABELS[node.type]}：${node.label}，${this.incident(node).length} 条关联`;return node.type!=='metric'?base:`${base}，发布状态：${node.published?'已发布，复核人金明哲，审批人蒋保平':'未发布'}`}
    showTip(node,event){const tip=this.canvas.parentElement.querySelector('.panorama-tooltip');if(!tip)return;const rect=this.canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;tip.hidden=false;tip.innerHTML=node.type==='metric'?`<b>${node.label}</b><span>指标 · ${this.incident(node).length} 条关联</span><dl><div><dt>发布状态</dt><dd class="${node.published?'published':'unpublished'}">${node.published?'已发布':'未发布'}</dd></div>${node.published?'<div><dt>复核人</dt><dd>金明哲</dd></div><div><dt>审批人</dt><dd>蒋保平</dd></div>':''}</dl>`:`<b>${node.label}</b><span>${LABELS[node.type]} · ${this.incident(node).length} 条关联</span>`;tip.style.left=`${clamp(x+14,8,rect.width-tip.offsetWidth-8)}px`;tip.style.top=`${y+tip.offsetHeight+16>rect.height?Math.max(8,y-tip.offsetHeight-12):y+12}px`}
    hideTip(){const tip=this.canvas.parentElement.querySelector('.panorama-tooltip');if(tip)tip.hidden=true}
    announce(text){const live=this.canvas.parentElement.querySelector('.panorama-live');if(live)live.textContent=text}
  }

  window.initPanoramaGraph=function(){
    const canvas=document.getElementById('panorama-canvas');
    if(!canvas){window.panoramaGraph?.destroy();window.panoramaGraph=null;return}
    window.panoramaGraph?.destroy();window.panoramaGraph=new PanoramaGraph(canvas);
  };
})();
