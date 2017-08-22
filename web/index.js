;(_=>{
const a=document.body.querySelectorAll('[id]'),I={};for(let i=0;i<a.length;i++)I[a[i].id]=a[i]
const hp={} // hash params
if(location.hash){const a=location.hash.substring(1).split(',');for(let i=0;i<a.length;i++){const[k,v]=a[i].split('=')
                  hp[k]=unescape(v)}}
I.code.value=hp.code||'';I.code.focus()
I.perm.onmouseover=I.perm.onfocus=_=>{I.perm.href='#code='+escape(I.code.value);return!1}
I.go.onclick=_=>{
  try{
    const s=I.code.value;I.result.classList.remove('err')
    if(s===')t'){I.result.textContent='Running tests...\n';setTimeout(runDocTests,1)}
    else{I.result.textContent=apl.fmt(apl(s)).join('\n')+'\n'}
  }catch(e){
    console&&console.error&&console.error(e.stack);I.result.classList.add('err');I.result.textContent=e
  }
  return!1
}
hp.run&&I.go.click()
I.code.focus()
I.code.onkeydown=x=>{switch(x.ctrlKey+2*x.shiftKey+4*x.altKey+8*x.metaKey+100*x.which){
  case 1301:{I.go.click();return!1}
  case  900:{const e=I.code,i=e.selectionStart,v=e.value,s=v.slice(i-2,i),c=tc[s]
             if(c){e.value=v.slice(0,i-2)+c+v.slice(i);e.selectionStart=e.selectionEnd=i-1}
             return!1}
}}
const hc={'<':'&lt;','&':'&amp;',"'":'&apos;','"':'&quot;'},he=x=>x.replace(/[<&'"]/g,c=>hc[c])
const tcs='<-←xx×:-÷*o⍟[-⌹oo○ff⌈FF⌈ll⌊LL⌊tt⊥TT⊤-|⊣|-⊢~~≈=/≠<=≤>=≥==≡=-≢vv∨^^∧^~⍲v~⍱^|↑v|↓<<⊂>>⊃[|⌷A|⍋V|⍒ii⍳ee∊e-⍷'+
'uu∪nn∩/-⌿\\-⍀,-⍪rr⍴pp⍴o|⌽o-⊖o\\⍉..¨~:⍨*:⍣o.∘[\'⍞[]⎕[:⍠[=⌸ot⍎oT⍕<>⋄on⍝aa⍺ww⍵a-⍶w-⍹VV∇--¯88∞0~⍬V~⍫//↗[/⍁'
const lbs=['←assign','+conjugate;add','-negate;subtract','×signum;multiply','÷reciprocal;divide','*exp;power','⍟ln;log',
'⌹matrix inverse;matrix divide','○pi;circular','!factorial;binomial','?roll;deal','|magnitude;residue',
'⌈ceiling;max','⌊floor;min','⊥decode','⊤encode','⊣left','⊢right','=equals','≈approx','≠not equals',
'≤lesser or equal to','<less than','>greater than','≥greater or equal to','≡depth;match','≢tally;not match','∨or',
'∧and','⍲nand','⍱nor','↑mix;take','↓split;drop','⊂enclose','⊃first;pick','⌷index','⍋grade up',
'⍒grade down','⍳indices;index of','∊flatten;member of','⍷find','∪unique;union','∩intersection','~not;without',
'/reduce;replicate','\\scan','⌿1st axis reduce;1st axis replicate','⍀1st axis scan',',enlist;catenate',
'⍪table;1st axis catenate','⍴shape of;reshape','⌽reverse;rotate','⊖1st axis reverse;1st axis rotate',
'⍉transpose;reorder axes','¨each','⍨selfie;commute','⍣power operator','.inner product',
'∘compose','⍞stdin;stdout','⎕"eval\'ed stdin;stdout"','⍠combine monadic-dyadic fns',
'⌸key operator','⍎execute','⍕format','⋄statement separator','⍝comment','⍺left argument','⍵right argument',
'⍶left operand','⍹right operand','∇recursion','¯negative','∞infinity','⍬empty numeric vector',
'⍫"return" reified as a function','↗throw','⍁identity element operator']
const tc={} // tab completions
for(let i=0;i<tcs.length;i+=3)tc[tcs[i]+tcs[i+1]]=tcs[i+2]
for(let i=0;i<tcs.length;i+=3){let k=tcs[i+1]+tcs[i];tc[k]=tc[k]||tcs[i+2]}
let lbh='';for(let i=0;i<lbs.length;i++){
  const ks=[];for(let j=0;j<tcs.length;j+=3)if(tcs[j+2]===lbs[i][0])ks.push('\n'+tcs[j]+' '+tcs[j+1]+' <tab>')
  lbh+='<b title="'+he(lbs[i].slice(1))+(ks.length?'\n'+ks.join(''):'')+'">'+lbs[i][0]+'</b>'
}
I.lb.innerHTML=lbh
I.lb.onmousedown=x=>{
  if(x.target.nodeName!=='B')return
  const e=I.code,i=e.selectionStart,j=e.selectionEnd,v=e.value,s=x.target.textContent
  if(i!=null&&j!=null){e.value=v.slice(0,i)+s+v.slice(j);e.selectionStart=e.selectionEnd=i+s.length}
  return!1
}
const get=(x,f)=>{const r=new XMLHttpRequest;r.open('get',x)
                  r.onreadystatechange=x=>{r.readyState===4&&f(r.responseText)};r.send()}
const runDocTests=_=>{
  get('../apl.js',x=>{
    const t=collectTests(x)
    I.result.classList.remove('err');I.result.classList.textContent=''
    let ne=0,nf=0,t0=+new Date // ne:number of executed, nf:number of failed
    for(let i=0;i<t.length;i++){
      ne++;let x=t[i],o=runDocTest(x,apl,apl.aprx)
      if(o){
        nf++
        I.result.textContent+='Test failed: '+JSON.stringify(x[0])+'\n'+
                              '             '+JSON.stringify(x[2])+'\n'+
                              (o.m?o.m+'\n':'')+(o.e?o.e.stack+'\n':'')
      }
    }
    I.result.textContent+=(nf?nf+' out of '+ne+' tests failed':'All '+ne+' tests passed')+' in '+(new Date-t0)+' ms.\n'
  })
}
})();
