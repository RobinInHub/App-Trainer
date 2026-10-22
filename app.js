const KEY='app-trainer-data';
const $=id=>document.getElementById(id);
const copy=x=>JSON.parse(JSON.stringify(x));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
const stamp=()=>new Date().toISOString();
const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmt=ms=>{const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;};
function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f;}catch{return f;}}
function store(k,v){localStorage.setItem(k,JSON.stringify(v));}
const empty=()=>({version:8,restPolicyVersion:7,workouts:[],history:[],activeSession:null,_modifiedAt:''});
let data=read('trainer-guest-v8',empty()),session=data.activeSession||null,client=null,user=null,ready=false,sending=false,timer=null,generation=0,revision=0,dirty=false;
const status=t=>$('authStatus').textContent=t;
const accountKey=()=>user?`trainer-account-v8:${user.id}`:'trainer-guest-v8';
function valid(d){if(!d||!Array.isArray(d.workouts)||!Array.isArray(d.history))throw Error('Dados da nuvem inválidos.');return d;}
function cache(){store(accountKey(),{...data,activeSession:session});if(user)store(accountKey()+':pending',dirty);}
function touch(){data._modifiedAt=stamp();data.activeSession=session;revision++;dirty=!!user;try{cache();if(!user)store(KEY,data);}catch(e){status('Falha no armazenamento local: '+e.message);return;}schedule();}
function schedule(){clearTimeout(timer);if(user&&ready&&dirty)timer=setTimeout(sync,900);}
function merge(local,remote){
 if(!remote)return copy(local);valid(remote);
 const base=copy((local._modifiedAt||'')>(remote._modifiedAt||'')?local:remote);
 const records=new Map();
 for(const h of [...remote.history,...local.history]){const key=h.id||JSON.stringify([h.date,h.workout]);const prev=records.get(key);if(!prev||(h.updatedAt||h.finishedAt||'')>=(prev.updatedAt||prev.finishedAt||''))records.set(key,h);}
 base.history=[...records.values()].sort((a,b)=>(b.updatedAt||b.finishedAt||b.dateISO||'').localeCompare(a.updatedAt||a.finishedAt||a.dateISO||''));return base;
}
async function sync(){
 if(!client||!user||!ready||!dirty||sending)return;
 if(!navigator.onLine){status('Pendente — sem conexão. Dados guardados neste aparelho.');return;}
 sending=true;const owner=user.id,g= generation;status('Salvando automaticamente...');
 try{
  for(let attempt=0;attempt<4;attempt++){
   if(g!==generation)return;
   const n=revision,local=copy({...data,activeSession:session});
   const {data:row,error}=await client.from('app_data').select('data,updated_at').eq('user_id',owner).maybeSingle();if(error)throw error;if(g!==generation)return;
   const payload=merge(local,row?.data);const now=stamp();let result;
   if(row){let q=client.from('app_data').update({data:payload,updated_at:now}).eq('user_id',owner);q=row.updated_at===null?q.is('updated_at',null):q.eq('updated_at',row.updated_at);result=await q.select('user_id');}
   else result=await client.from('app_data').insert({user_id:owner,data:payload,updated_at:now}).select('user_id');
   if(result.error){if(result.error.code==='23505')continue;throw result.error;}
   if(!result.data?.length)continue;if(g!==generation)return;
   if(n===revision){data=payload;session=data.activeSession||null;dirty=false;cache();render();status('Sincronizado • '+new Date().toLocaleTimeString('pt-BR'));return;}
  }
  status('Alterações pendentes; nova tentativa automática.');
 }catch(e){if(g===generation)status('Pendente — '+e.message+'. Não limpe os dados do navegador.');}
 finally{sending=false;if(dirty&&user&&ready){clearTimeout(timer);timer=setTimeout(sync,5000);}}
}
async function profile(next){
 const id=next?.id||null;if(ready&&id===(user?.id||null))return;
 clearTimeout(timer);if(ready)try{cache();}catch{}
 generation++;const g=generation;ready=false;user=next;revision=0;
 data=valid(read(accountKey(),empty()));session=data.activeSession||null;dirty=!!user&&read(accountKey()+':pending',false);authUI();render();lock(true);
 try{
  if(user){status('Carregando sua conta...');const {data:row,error}=await client.from('app_data').select('data').eq('user_id',user.id).maybeSingle();if(error)throw error;if(g!==generation)return;
   if(row){data=merge(data,valid(row.data));session=data.activeSession||null;}else dirty=true;
   ready=true;cache();status(dirty?'Dados locais pendentes de envio.':'Dados da conta carregados.');
  }else{ready=true;status('Modo local. Entre para ativar a sincronização.');}
 }catch(e){if(g!==generation)return;ready=true;status('Sem carregar a nuvem: '+e.message+'. Usando cache desta conta.');}
 finally{if(g===generation){lock(false);render();schedule();}}
}
function lock(value){for(const id of ['workouts','run'])$(id).inert=value;}
function authUI(){const logged=!!user;$('logoutButton').classList.toggle('hidden',!logged);for(const id of ['authEmail','authPassword','loginButton','signupButton'])$(id).classList.toggle('hidden',logged);}
function node(tag,text,parent){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(parent)parent.append(e);return e;}
function btn(text,parent,fn){const b=node('button',text,parent);b.type='button';b.onclick=fn;return b;}
function tab(id){document.querySelectorAll('.tab').forEach(e=>e.classList.toggle('active',e.id===id));document.querySelectorAll('nav button').forEach(e=>e.classList.toggle('active',e.dataset.tab===id));records();}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
const plans=[
['Full Body A — Quadríceps e Peito',[['Leg press 45°',3,'10-12'],['Supino reto na máquina',3,'8-12'],['Remada baixa na polia',2,'10-12'],['Mesa flexora',2,'12-15'],['Elevação lateral',2,'12-15'],['Abdominal na máquina',2,'12-20']]],
['Full Body B — Costas e Posteriores',[['Cadeira flexora',3,'10-15'],['Puxada com pegada neutra',3,'8-12'],['Supino inclinado na máquina',2,'10-12'],['Cadeira extensora',2,'12-15'],['Peck deck invertido',2,'12-15'],['Panturrilha em pé',2,'15-20']]],
['Full Body C — Pernas e Ombros',[['Hack machine',3,'8-12'],['Desenvolvimento na máquina',3,'8-12'],['Remada unilateral com halter',2,'10-12 por lado'],['Cadeira flexora',2,'12-15'],['Supino reto na máquina',2,'10-12'],['Abdominal na máquina',2,'12-20']]],
['Full Body D — Metabólico',[['Leg press 45°',2,'15'],['Puxada com pegada neutra',2,'12-15'],['Supino inclinado na máquina',2,'12-15'],['Mesa flexora',2,'15'],['Elevação lateral',2,'15'],['Rosca alternada',2,'12-15'],['Tríceps corda',2,'12-15']]],
['Full Body E — Leve',[['Leg press 45°',2,'15-20'],['Puxada com pegada neutra',2,'12-15'],['Supino reto na máquina',2,'12-15'],['Cadeira flexora',2,'15'],['Cadeira adutora',2,'12-15'],['Elevação lateral',2,'15-20'],['Abdominal na máquina',2,'15-20']]],
['Cardio diário',[['Esteira',1,'10 min'],['Bicicleta ergométrica',1,'20-30 min']]]];
const catalog='Agachamento livre|Agachamento Smith|Agachamento búlgaro|Leg press 45°|Leg press horizontal|Hack machine|Cadeira extensora|Cadeira flexora|Mesa flexora|Afundo|Stiff com barra|Levantamento terra|Levantamento terra romeno|Panturrilha em pé|Panturrilha sentado|Cadeira adutora|Cadeira abdutora|Supino reto com barra|Supino inclinado com barra|Supino declinado com barra|Supino reto com halteres|Supino inclinado com halteres|Supino reto na máquina|Supino inclinado na máquina|Crucifixo na máquina|Peck deck|Crucifixo com halteres|Flexão de braço|Flexão inclinada|Paralelas|Puxada alta na polia|Puxada com pegada neutra|Puxada frontal|Remada baixa na polia|Remada curvada|Remada unilateral com halter|Remada máquina|Levantamento terra tradicional|Barra fixa|Remada invertida|Desenvolvimento com halteres|Desenvolvimento na máquina|Desenvolvimento com barra|Elevação lateral|Elevação frontal|Peck deck invertido|Encolhimento de ombros|Rosca direta|Rosca alternada|Rosca martelo|Rosca na máquina|Rosca na polia|Tríceps corda|Tríceps na máquina|Tríceps francês|Tríceps testa|Tríceps na polia|Mergulho no banco|Abdominal supra|Abdominal na máquina|Abdominal na polia|Prancha abdominal|Prancha lateral|Elevação de pernas|Esteira|Bicicleta ergométrica|Elíptico|Pular corda|Caminhada'.split('|');
catalog.forEach(name=>node('option',name,$('exerciseList')).value=name);
function workouts(){
 $('workoutList').replaceChildren();for(const w of data.workouts){const card=node('div',undefined,$('workoutList'));card.className='card';node('h3',w.name,card);
 w.exercises.forEach((e,i)=>{const row=node('div',undefined,card);row.className='exercise-row';for(const [field,label] of [['name','Exercício'],['sets','Séries'],['reps','Repetições'],['load','Carga'],['restSeconds','Descanso (s)']]){const wrap=node('label',label,row),input=node('input',undefined,wrap);input.value=e[field]??'';input.type=['sets','restSeconds'].includes(field)?'number':'text';if(field==='name')input.setAttribute('list','exerciseList');if(input.type==='number'){input.min=field==='sets'?'1':'0';input.max=field==='sets'?'100':'3600';input.step='1';}input.onchange=()=>{if(!ready)return;if(!input.checkValidity()||(input.type==='number'&&!input.value)){input.reportValidity();return;}e[field]=input.type==='number'?Number(input.value):input.value;touch();};}btn('Remover exercício',row,()=>{w.exercises.splice(i,1);touch();workouts();});});
 btn('Adicionar exercício',card,()=>{w.exercises.push({name:'',sets:3,reps:'10-12',load:'',restSeconds:40});touch();workouts();});btn('Excluir treino',card,()=>{if(confirm('Excluir este treino?')){data.workouts=data.workouts.filter(x=>x.id!==w.id);touch();workouts();}});}
 const select=$('selectWorkout'),previous=select.value;select.replaceChildren();node('option','Selecione...',select).value='';data.workouts.forEach(w=>node('option',w.name,select).value=w.id);select.value=previous;
}
$('createWorkout').onclick=()=>{if(!ready)return;const name=$('workoutName').value.trim();if(!name)return;data.workouts.push({id:uid(),name,exercises:[]});$('workoutName').value='';touch();workouts();};
$('addPresets').onclick=()=>{if(!ready)return;plans.forEach(([name,list])=>{if(data.workouts.some(w=>w.name===name))return;data.workouts.push({id:uid(),name,exercises:list.map(([name,sets,reps])=>({name,sets,reps,load:'',restSeconds:reps.includes('min')?0:40}))});});touch();workouts();};
const current=()=>session.items[session.index];
const elapsed=(now=Date.now())=>current().partialMs+(session.mode==='running'?Math.max(0,now-session.startedAt):0);
function settle(){if(session?.mode==='rest'&&Date.now()>=session.restUntil){session.startedAt=session.restUntil;session.restUntil=null;session.mode='running';touch();}}
function pause(){if(session.mode==='running')current().partialMs=elapsed();session.mode='ready';session.startedAt=null;}
function nextIndex(after){for(let n=1;n<=session.items.length;n++){const i=(after+n)%session.items.length;if(session.items[i].logs.length<session.items[i].sets)return i;}return -1;}
function choose(i){if(!session||i===session.index||session.items[i].logs.length>=session.items[i].sets)return;settle();pause();session.index=i;session.restUntil=null;touch();runner();}
$('startWorkout').onclick=()=>{if(!ready||session)return;const w=data.workouts.find(w=>w.id===$('selectWorkout').value);if(!w?.exercises.length)return alert('Escolha um treino com exercícios.');if(w.exercises.some(e=>!e.name.trim()||!Number.isInteger(Number(e.sets))||Number(e.sets)<1))return alert('Confira nomes e séries.');session={id:uid(),workoutName:w.name,index:0,mode:'ready',startedAt:null,restUntil:null,createdAt:stamp(),items:copy(w.exercises).map(e=>({...e,sets:Number(e.sets),logs:[],partialMs:0}))};touch();runner();};
$('toggleTimer').onclick=()=>{if(!ready||!session)return;settle();if(session.mode==='rest')return;if(session.mode==='running')pause();else{session.mode='running';session.startedAt=Date.now();}touch();runner();};
function recordProgress(completed=false){const exercises=session.items.filter(e=>e.logs.length).map(e=>({name:e.name,sets:e.logs.length,reps:e.reps,load:e.load,series:copy(e.logs)}));if(!exercises.length)return;const row={id:session.id,workout:session.workoutName,date:new Date().toLocaleString('pt-BR'),dateISO:dateKey(),updatedAt:stamp(),inProgress:!completed,completed,exercises,completedSets:exercises.reduce((n,e)=>n+e.sets,0),totalExerciseSeconds:Math.floor(exercises.reduce((n,e)=>n+e.series.reduce((m,l)=>m+l.durationMs,0),0)/1000)};const i=data.history.findIndex(h=>h.id===row.id);if(i<0)data.history.unshift(row);else data.history[i]=row;}
$('completeSet').onclick=()=>{if(!ready||!session)return;settle();if(session.mode==='rest')return;if(session.mode!=='running'&&current().partialMs<=0)return alert('Inicie o tempo.');const item=current();item.logs.push({durationMs:elapsed(),completedAt:stamp(),reps:item.reps,load:item.load});item.partialMs=0;recordProgress();const next=item.logs.length<item.sets?session.index:nextIndex(session.index);if(next<0){finish(true);return;}session.index=next;const seconds=Math.max(0,Number(item.restSeconds??40));session.mode=seconds?'rest':'running';session.restUntil=seconds?Date.now()+seconds*1000:null;session.startedAt=seconds?null:Date.now();touch();runner();records();};
$('skipRest').onclick=()=>{if(!ready||session?.mode!=='rest')return;session.mode='running';session.startedAt=Date.now();session.restUntil=null;touch();runner();};
$('skipExercise').onclick=()=>{if(session){const i=nextIndex(session.index);if(i>=0)choose(i);}};
function finish(completed){recordProgress(completed);const h=data.history.find(h=>h.id===session.id);if(h){h.inProgress=false;h.finishedAt=stamp();h.updatedAt=h.finishedAt;}session=null;touch();runner();records();tab('history');}
$('finishWorkout').onclick=()=>{if(session&&confirm('Finalizar? Apenas séries concluídas serão registradas.'))finish(false);};
let signature='';
function runner(){
 $('runner').classList.toggle('hidden',!session);if(!session){signature='';return;}settle();const e=current();$('currentExercise').textContent=e.name;$('currentInfo').textContent=`Série ${e.logs.length+1} de ${e.sets} • ${e.reps} • ${e.load||'livre'}`;$('timer').textContent=fmt(elapsed());$('timerLabel').textContent=session.mode==='rest'?'Próxima série inicia após o descanso':session.mode==='running'?'Tempo de execução — subindo':'Pronto / pausado';$('toggleTimer').textContent=session.mode==='running'?'Pausar tempo':'Iniciar / continuar tempo';$('toggleTimer').disabled=session.mode==='rest';$('completeSet').disabled=session.mode==='rest';$('restCard').classList.toggle('hidden',session.mode!=='rest');$('restTimer').textContent=session.mode==='rest'?fmt(Math.ceil(Math.max(0,session.restUntil-Date.now())/1000)*1000):'00:00';
 const sig=JSON.stringify([session.id,session.index,session.items.map(e=>[e.name,e.logs.length,e.sets])]);if(sig!==signature){signature=sig;$('sessionExercises').replaceChildren();session.items.forEach((e,i)=>{const b=btn(`${i===session.index?'▶ ':''}${e.name} — ${e.logs.length}/${e.sets} séries • ${e.reps} • ${e.load||'livre'}`,$('sessionExercises'),()=>choose(i));b.disabled=e.logs.length>=e.sets;});}
}
function records(){
 $('historyList').replaceChildren();data.history.forEach(h=>{const c=node('div',undefined,$('historyList'));c.className='card';node('h3',h.workout+(h.inProgress?' — em andamento':''),c);node('p',`${h.date} • ${h.completedSets} séries • ${fmt((h.totalExerciseSeconds||0)*1000)}`,c);(h.exercises||[]).forEach(e=>node('p',`${e.name}: ${e.sets} séries`,c));});
 const today=dateKey(),from=new Date();from.setDate(from.getDate()-6);const week=data.history.filter(h=>h.dateISO>=dateKey(from)&&h.dateISO<=today);const count=rows=>`${rows.reduce((n,h)=>n+(h.exercises||[]).length,0)} exercícios • ${rows.reduce((n,h)=>n+Number(h.completedSets||0),0)} séries`;$('todayStats').textContent=count(week.filter(h=>h.dateISO===today));$('weekStats').textContent=count(week);$('dailyRecords').replaceChildren();[...new Set(week.map(h=>h.dateISO))].sort().reverse().forEach(d=>node('p',`${d}: ${count(week.filter(h=>h.dateISO===d))}`,$('dailyRecords')));
}
$('clearHistory').hidden=true;
function render(){signature='';workouts();runner();records();}
async function authTask(fn){try{if(!client)throw Error('Nuvem indisponível.');await fn();}catch(e){status('Erro: '+e.message);}}
['loginButton','signupButton'].forEach(id=>$(id).onclick=()=>authTask(async()=>{const email=$('authEmail').value.trim(),password=$('authPassword').value;if(!email||!password)throw Error('Informe e-mail e senha.');status('Conectando...');const r=id==='loginButton'?await client.auth.signInWithPassword({email,password}):await client.auth.signUp({email,password});if(r.error)throw r.error;$('authPassword').value='';await profile(r.data.session?.user||null);if(!r.data.session&&id==='signupButton')status('Confirme o cadastro no seu e-mail.');}));
$('logoutButton').onclick=()=>authTask(async()=>{if(dirty){await sync();if(dirty&&!confirm('Existem alterações pendentes neste aparelho. Sair sem enviar agora? Elas ficam guardadas para a mesma conta.'))return;}const {error}=await client.auth.signOut();if(error)throw error;await profile(null);});
$('saveCloud').onclick=()=>{if(!user){status('Entre na conta primeiro.');return;}dirty=true;cache();sync();};
$('loadCloud').textContent='Sincronizar agora';$('loadCloud').onclick=()=>authTask(async()=>{if(!user)throw Error('Entre na conta.');const {data:row,error}=await client.from('app_data').select('data').eq('user_id',user.id).maybeSingle();if(error)throw error;if(row){data=merge({...data,activeSession:session},row.data);session=data.activeSession||null;cache();render();}dirty=true;cache();sync();});
$('testConnection').onclick=()=>authTask(async()=>{const {error}=await client.from('app_data').select('user_id').limit(1);if(error)throw error;status('Conexão disponível.');});
$('cloud').querySelectorAll('p').forEach(p=>{if(p.id!=='authStatus')p.textContent='Salvamento automático por conta: séries, alterações e sessão. Aguarde Sincronizado antes de fechar; sem internet, os dados ficam pendentes neste aparelho.';});
render();lock(true);
window.addEventListener('online',()=>{if(dirty)sync();else if(user){const u=user;ready=false;profile(u);}});
window.addEventListener('offline',()=>status('Sem conexão — alterações ficam neste aparelho.'));
document.addEventListener('visibilitychange',()=>{try{cache();}catch{}if(!document.hidden){runner();schedule();}});
window.addEventListener('pagehide',()=>{try{cache();}catch{}});
setInterval(()=>{if(ready)runner();},250);
setInterval(()=>{if(dirty)sync();},15000);
try{if(!window.supabase)throw Error('Biblioteca Supabase indisponível.');client=window.supabase.createClient('https://rysoaghymsiyyfgpfotc.supabase.co','sb_publishable_RLIESGfLNz0R0jlQGF4A6w_2e9HKgRV');client.auth.onAuthStateChange((event,s)=>{if(['SIGNED_OUT','SIGNED_IN'].includes(event))setTimeout(()=>profile(s?.user||null),0);});const r=await client.auth.getSession();if(r.error)throw r.error;await profile(r.data.session?.user||null);}catch(e){ready=true;lock(false);status('Modo local: '+e.message);}
$('startupStatus').textContent='Versão 8 — carregamento pela conta e salvamento automático contínuo. Cronômetro real e descanso de 40 s.';
