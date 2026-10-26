(function(){
 var $=function(s){return document.querySelector(s)},$$=function(s){return document.querySelectorAll(s)};
 var root=document.documentElement;

 /* theme */
 try{var t=localStorage.getItem("theme");if(t)root.dataset.theme=t}catch(e){}
 $("#theme").onclick=function(){
  var n=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=n;
  try{localStorage.setItem("theme",n)}catch(e){}
 };

 /* mobile menu */
 var menu=$("#menu"),links=$("#links");
 menu.onclick=function(){var o=links.classList.toggle("open");menu.setAttribute("aria-expanded",o)};
 $$("#links a").forEach(function(a){a.addEventListener("click",function(){links.classList.remove("open");menu.setAttribute("aria-expanded","false")})});

 /* typed terminal */
 var host=location.host||"your-server";
 var script=[
  ["p","$ "],["t","curl -I http://"+host+"\n"],
  ["g","HTTP/1.1 200 OK\n"],["d","Server: nginx\nContent-Type: text/html\n\n"],
  ["p","$ "],["t","whoami\n"],["g","a developer learning the cloud\n\n"],
  ["p","$ "],["t","uptime --pretty\n"],["g","up and serving visitors\n\n"],["p","$ "]
 ];
 var term=$("#term"),out="",i=0,j=0;
 function render(){term.innerHTML=out+'<span class="cur"></span>'}
 function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")}
 function step(){
  if(i>=script.length){render();return}
  var cls=script[i][0],txt=script[i][1];
  if(cls==="t"){
   if(j<txt.length){out+=esc(txt[j++]);render();setTimeout(step,45);return}
   i++;j=0;setTimeout(step,200);return
  }
  out+='<span class="'+cls+'">'+esc(txt)+'</span>';i++;render();setTimeout(step,cls==="p"?120:380)
 }
 if(matchMedia("(prefers-reduced-motion:reduce)").matches){
  script.forEach(function(s){out+=s[0]==="t"?esc(s[1]):'<span class="'+s[0]+'">'+esc(s[1])+'</span>'});render()
 }else step();

 /* scroll: skill bars, counters, active link, back to top */
 function count(el){
  var end=+el.dataset.count,n=0,s=Math.max(1,Math.round(end/30));
  var id=setInterval(function(){n+=s;if(n>=end){n=end;clearInterval(id)}el.textContent=n},35)
 }
 var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
   if(!e.isIntersecting)return;
   e.target.querySelectorAll("[data-w]").forEach(function(b){b.style.width=b.dataset.w+"%"});
   e.target.querySelectorAll("[data-count]").forEach(count);
   io.unobserve(e.target)
  })
 },{threshold:.3});
 $$("#skills,#about").forEach(function(s){io.observe(s)});

 var secs=$$("main section[id]"),top=$("#top");
 addEventListener("scroll",function(){
  top.classList.toggle("show",scrollY>500);
  var cur="";secs.forEach(function(s){if(scrollY>=s.offsetTop-120)cur=s.id});
  $$("#links a").forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+cur)})
 },{passive:true});
 top.onclick=function(){scrollTo({top:0})};

 /* project filter */
 $$(".chip").forEach(function(c){c.onclick=function(){
  $$(".chip").forEach(function(x){x.setAttribute("aria-pressed","false")});
  c.setAttribute("aria-pressed","true");
  $$(".card").forEach(function(k){k.classList.toggle("hide",c.dataset.f!=="all"&&k.dataset.c!==c.dataset.f)})
 }});

 /* live info */
 $("#host").textContent=location.host||"local file";
 addEventListener("load",function(){
  var n=performance.getEntriesByType("navigation")[0];
  $("#load").textContent=n?Math.round(n.duration)+" ms":"fast"
 });
 function tick(){$("#clock").textContent=new Date().toLocaleTimeString()}
 tick();setInterval(tick,1000);
 $("#yr").textContent=new Date().getFullYear();

 /* contact form */
 $("#form").addEventListener("submit",function(ev){
  ev.preventDefault();
  var n=$("#n").value.trim(),e=$("#e").value.trim(),m=$("#m").value.trim(),ok=true;
  $("#en").textContent=n?"":"Enter your name.";
  $("#ee").textContent=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)?"":"Enter a valid email, like name@example.com.";
  $("#em").textContent=m.length>=10?"":"Write at least 10 characters.";
  ok=n&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)&&m.length>=10;
  if(!ok)return;
  $("#ok").style.display="block";
  location.href="mailto:you@example.com?subject="+encodeURIComponent("Message from "+n)+"&body="+encodeURIComponent(m+"\n\n"+e);
  this.reset()
 });
})();