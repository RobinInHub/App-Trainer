const KEY = 'app-trainer-data';
const SESSION = 'app-trainer-session-v7';
const $ = id => document.getElementById(id);
const clone = value => JSON.parse(JSON.stringify(value));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const day = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmt = ms => { const s = Math.max(0,Math.floor(ms/1000)); return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; };
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(key,JSON.stringify(value)); } catch { $('startupStatus').textContent = 'Não foi possível salvar no aparelho. Não feche o treino.'; } }
function normalize(value) { if (!value || !Array.isArray(value.workouts) || !Array.isArray(value.history)) throw Error('Dados de treino inválidos.'); return value; }
let data = normalize(read(KEY,{version:1,workouts:[],history:[]}));
let session = read(SESSION,null);
let client = null;
let user = null;
let busy = false;
const catalog = 'Agachamento livre|Agachamento Smith|Agachamento búlgaro|Leg press 45°|Leg press horizontal|Hack machine|Cadeira extensora|Cadeira flexora|Mesa flexora|Afundo|Stiff com barra|Levantamento terra|Levantamento terra romeno|Panturrilha em pé|Panturrilha sentado|Cadeira adutora|Cadeira abdutora|Supino reto com barra|Supino inclinado com barra|Supino declinado com barra|Supino reto com halteres|Supino inclinado com halteres|Supino reto na máquina|Supino inclinado na máquina|Crucifixo na máquina|Peck deck|Crucifixo com halteres|Flexão de braço|Flexão inclinada|Paralelas|Puxada alta na polia|Puxada com pegada neutra|Puxada frontal|Remada baixa na polia|Remada curvada|Remada unilateral com halter|Remada máquina|Levantamento terra tradicional|Barra fixa|Remada invertida|Desenvolvimento com halteres|Desenvolvimento na máquina|Desenvolvimento com barra|Elevação lateral|Elevação frontal|Peck deck invertido|Encolhimento de ombros|Rosca direta|Rosca alternada|Rosca martelo|Rosca na máquina|Rosca na polia|Tríceps corda|Tríceps na máquina|Tríceps francês|Tríceps testa|Tríceps na polia|Mergulho no banco|Abdominal supra|Abdominal na máquina|Abdominal na polia|Prancha abdominal|Prancha lateral|Elevação de pernas|Esteira|Bicicleta ergométrica|Elíptico|Pular corda|Caminhada'.split('|');
const templates = [
['Full Body A — Quadríceps e Peito', [['Leg press 45°',3,'10-12'],['Supino reto na máquina',3,'8-12'],['Remada baixa na polia',2,'10-12'],['Mesa flexora',2,'12-15'],['Elevação lateral',2,'12-15'],['Abdominal na máquina',2,'12-20']]],
['Full Body B — Costas e Posteriores', [['Cadeira flexora',3,'10-15'],['Puxada com pegada neutra',3,'8-12'],['Supino inclinado na máquina',2,'10-12'],['Cadeira extensora',2,'12-15'],['Peck deck invertido',2,'12-15'],['Panturrilha em pé',2,'15-20']]],
['Full Body C — Pernas e Ombros', [['Hack machine',3,'8-12'],['Desenvolvimento na máquina',3,'8-12'],['Remada unilateral com halter',2,'10-12 por lado'],['Cadeira flexora',2,'12-15'],['Supino reto na máquina',2,'10-12'],['Abdominal na máquina',2,'12-20']]],
['Full Body D — Metabólico', [['Leg press 45°',2,'15'],['Puxada com pegada neutra',2,'12-15'],['Supino inclinado na máquina',2,'12-15'],['Mesa flexora',2,'15'],['Elevação lateral',2,'15'],['Rosca alternada',2,'12-15'],['Tríceps corda',2,'12-15']]],
['Full Body E — Leve', [['Leg press 45°',2,'15-20'],['Puxada com pegada neutra',2,'12-15'],['Supino reto na máquina',2,'12-15'],['Cadeira flexora',2,'15'],['Cadeira adutora',2,'12-15'],['Elevação lateral',2,'15-20'],['Abdominal na máquina',2,'15-20']]],
['Cardio diário', [['Esteira',1,'10 min'],['Bicicleta ergométrica',1,'20-30 min']]]
];
function migrate() { if (data.restPolicyVersion === 7) return; data.workouts.forEach(w => (w.exercises || []).forEach(e => { if (!String(e.reps).includes('min')) e.restSeconds = 40; })); data.restPolicyVersion = 7; save(); }
function save() { write(KEY,data); }
function persist() { if (session) write(SESSION,session); else { try { localStorage.removeItem(SESSION); } catch {} } }
function el(tag,text,parent) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (parent) parent.append(node); return node; }
function button(text,parent,action) { const b = el('button',text,parent); b.type = 'button'; b.onclick = action; return b; }
function tab(name) { document.querySelectorAll('.tab').forEach(n => n.classList.toggle('active',n.id===name)); document.querySelectorAll('nav button').forEach(n => n.classList.toggle('active',n.dataset.tab===name)); if (name==='history' || name==='records') renderRecords(); }
document.querySelectorAll('nav button').forEach(b => b.onclick = () => tab(b.dataset.tab));
function renderWorkouts() {
 const list = $('workoutList'); list.replaceChildren();
 data.workouts.forEach(w => {
  const card = el('div',undefined,list); card.className = 'card'; el('h3',w.name,card);
  el('p',`${w.exercises.length} exercícios • ${w.exercises.reduce((n,e)=>n+Number(e.sets||0),0)} séries`,card);
  w.exercises.forEach((e,index) => {
   const row = el('div',undefined,card); row.className = 'exercise-row';
   [['name','Exercício'],['sets','Séries'],['reps','Repetições'],['load','Carga'],['restSeconds','Descanso (s)']].forEach(([field,label]) => {
    const wrap = el('label',label,row); const input = el('input',undefined,wrap); input.value = e[field] ?? ''; input.type = ['sets','restSeconds'].includes(field) ? 'number' : 'text';
    if (field==='name') input.setAttribute('list','exerciseList');
    if (input.type==='number') { input.min = field==='sets' ? '1' : '0'; input.max = field==='sets' ? '100' : '3600'; input.step='1'; }
    input.onchange = () => { if (!input.checkValidity() || (input.type==='number' && !input.value)) { input.reportValidity(); return; } e[field] = input.type==='number' ? Number(input.value) : input.value; save(); };
   });
   button('Remover exercício',row,()=>{ w.exercises.splice(index,1); save(); renderWorkouts(); });
  });
  button('Adicionar exercício',card,()=>{ w.exercises.push({name:'',sets:3,reps:'10-12',load:'',restSeconds:40}); save(); renderWorkouts(); });
  button('Excluir treino',card,()=>{ if (!confirm('Excluir este treino?')) return; data.workouts=data.workouts.filter(x=>x.id!==w.id); save(); renderAll(); });
 });
 const select=$('selectWorkout'); const previous=select.value; select.replaceChildren(); el('option','Selecione...',select).value=''; data.workouts.forEach(w=>el('option',w.name,select).value=w.id); select.value=previous;
}
$('createWorkout').onclick=()=>{ const name=$('workoutName').value.trim(); if(!name)return; data.workouts.push({id:uid(),name,exercises:[]}); $('workoutName').value=''; save(); renderWorkouts(); };
$('addPresets').onclick=()=>{ templates.forEach(([name,items])=>{ if(data.workouts.some(w=>w.name===name))return; data.workouts.push({id:uid(),name,exercises:items.map(([name,sets,reps])=>({name,sets,reps,load:'',restSeconds:reps.includes('min')?0:40}))}); }); save(); renderWorkouts(); };
function current() { return session.items[session.index]; }
function elapsed(now=Date.now()) { const item=current(); return item.partialMs + (session.mode==='running' ? Math.max(0,now-session.startedAt) : 0); }
function settle() {
 if(!session)return;
 const now=Date.now();
 if(session.mode==='rest' && now>=session.restUntil) { session.mode='running'; session.startedAt=session.restUntil; session.restUntil=null; persist(); }
}
function stopExecution() { if(session.mode==='running') current().partialMs=elapsed(); session.mode='ready'; session.startedAt=null; }
function nextPending(after) { for(let step=1;step<=session.items.length;step++){ const i=(after+step)%session.items.length; if(session.items[i].logs.length<session.items[i].sets)return i; } return -1; }
function selectExercise(index) {
 if(!session)return; settle();
 if(index===session.index || session.items[index].logs.length>=session.items[index].sets)return;
 stopExecution(); session.restUntil=null; session.index=index; persist(); renderRunner();
}
$('startWorkout').onclick=()=>{
 if(session){ tab('run'); return; }
 const w=data.workouts.find(x=>x.id===$('selectWorkout').value);
 if(!w || !w.exercises.length)return alert('Escolha um treino com exercícios.');
 if(w.exercises.some(e=>!e.name.trim() || !Number.isInteger(Number(e.sets)) || Number(e.sets)<1))return alert('Preencha os nomes e séries dos exercícios.');
 session={id:uid(),workoutId:w.id,workoutName:w.name,index:0,mode:'ready',startedAt:null,restUntil:null,createdAt:new Date().toISOString(),items:clone(w.exercises).map(e=>({...e,sets:Number(e.sets),logs:[],partialMs:0}))}; persist(); renderRunner();
};
$('toggleTimer').onclick=()=>{
 if(!session)return; settle(); if(session.mode==='rest')return;
 if(session.mode==='running')stopExecution(); else {session.mode='running';session.startedAt=Date.now();}
 persist(); renderRunner();
};
$('completeSet').onclick=()=>{
 if(!session)return; settle(); if(session.mode==='rest')return;
 if(session.mode!=='running' && current().partialMs<=0)return alert('Inicie o tempo antes de concluir a série.');
 const item=current(); const ms=elapsed(); item.logs.push({durationMs:ms,completedAt:new Date().toISOString(),reps:item.reps,load:item.load}); item.partialMs=0;
 const oldIndex=session.index; const next=item.logs.length<item.sets ? oldIndex : nextPending(oldIndex);
 if(next<0){ finish(true); return; }
 session.index=next; session.startedAt=null;
 const seconds=Math.max(0,Number(item.restSeconds ?? 40));
 session.mode=seconds>0?'rest':'running'; session.restUntil=seconds>0?Date.now()+seconds*1000:null;
 if(!seconds)session.startedAt=Date.now(); persist(); renderRunner();
};
$('skipRest').onclick=()=>{ if(!session || session.mode!=='rest')return; session.mode='running';session.startedAt=Date.now();session.restUntil=null;persist();renderRunner(); };
$('skipExercise').onclick=()=>{if(!session)return;const next=nextPending(session.index);if(next>=0)selectExercise(next);};
$('finishWorkout').onclick=()=>{if(session && confirm('Finalizar e registrar apenas as séries concluídas? A série em andamento não será contada.'))finish(false);};
function finish(completed) {
 const s=session; const exercises=s.items.filter(i=>i.logs.length).map(i=>({name:i.name,sets:i.logs.length,reps:i.reps,load:i.load,series:i.logs}));
 if(exercises.length && !data.history.some(h=>h.id===s.id))data.history.unshift({id:s.id,date:new Date().toLocaleString('pt-BR'),dateISO:day(),finishedAt:new Date().toISOString(),workout:s.workoutName,completed,exercises,completedSets:exercises.reduce((n,e)=>n+e.sets,0),totalExerciseSeconds:Math.floor(exercises.reduce((n,e)=>n+e.series.reduce((m,l)=>m+l.durationMs,0),0)/1000)});
 save();session=null;persist();renderRunner();renderRecords();tab('history');if(user)cloudSave();
}
function renderRunner() {
 $('runner').classList.toggle('hidden',!session); $('startWorkout').textContent=session?'Treino em andamento':'Iniciar treino';
 if(!session)return;settle();const item=current();
 $('currentExercise').textContent=item.name;
 $('currentInfo').textContent=`Série ${item.logs.length+1} de ${item.sets} • ${item.reps} • Carga: ${item.load||'livre'}`;
 $('timer').textContent=fmt(elapsed());
 $('timerLabel').textContent=session.mode==='rest'?'Próxima série inicia automaticamente após o descanso':session.mode==='running'?'Tempo de execução — subindo':'Pronto / pausado';
 $('toggleTimer').textContent=session.mode==='running'?'Pausar tempo':'Iniciar / continuar tempo';
 $('toggleTimer').disabled=session.mode==='rest';$('completeSet').disabled=session.mode==='rest';
 $('restCard').classList.toggle('hidden',session.mode!=='rest');
 $('restTimer').textContent=session.mode==='rest'?fmt(Math.ceil(Math.max(0,session.restUntil-Date.now())/1000)*1000):'00:00';
 const list=$('sessionExercises');list.replaceChildren();
 session.items.forEach((e,i)=>{const done=e.logs.length>=e.sets; const b=button(`${i===session.index?'▶ ':''}${e.name} — ${e.logs.length}/${e.sets} séries • ${e.reps} • ${e.load||'livre'}${done?' — concluído':''}`,list,()=>selectExercise(i));b.disabled=done;b.classList.toggle('active',i===session.index);});
}
function renderRecords() {
 const list=$('historyList');list.replaceChildren();
 data.history.forEach(h=>{ const card=el('div',undefined,list);card.className='card';el('h3',h.workout,card);el('p',`${h.date} • ${h.completedSets} séries • ${fmt((h.totalExerciseSeconds||0)*1000)} de execução`,card);(h.exercises||[]).forEach(e=>el('p',`${e.name}: ${e.sets} séries`,card)); });
 const now=day();const start=new Date();start.setDate(start.getDate()-6);const lower=day(start);
 const week=data.history.filter(h=>h.dateISO>=lower && h.dateISO<=now);
 const count=rows=>`${rows.reduce((n,h)=>n+(h.exercises||[]).length,0)} exercícios realizados • ${rows.reduce((n,h)=>n+Number(h.completedSets||0),0)} séries`;
 $('todayStats').textContent=count(week.filter(h=>h.dateISO===now));$('weekStats').textContent=count(week);
 $('dailyRecords').replaceChildren();[...new Set(week.map(h=>h.dateISO))].sort().reverse().forEach(d=>el('p',`${d}: ${count(week.filter(h=>h.dateISO===d))}`,$('dailyRecords')));
}
$('clearHistory').onclick=()=>{if(confirm('Apagar todo o histórico?')){data.history=[];save();renderRecords();}};
function renderAll(){renderWorkouts();renderRunner();renderRecords();}
function authStatus(text){$('authStatus').textContent=text;}
function authUI(){ $('logoutButton').classList.toggle('hidden',!user);['authEmail','authPassword','loginButton','signupButton'].forEach(id=>$(id).classList.toggle('hidden',!!user));authStatus(user?`Conectado: ${user.email}`:'Não conectado.'); }
async function task(fn){if(busy)return;busy=true;try{if(!client)throw Error('Biblioteca da nuvem indisponível. Os treinos locais continuam funcionando.');await fn();}catch(e){authStatus('Erro: '+e.message);}finally{busy=false;}}
async function cloudSave(){return task(async()=>{if(!user)throw Error('Entre na conta primeiro.');authStatus('Salvando...');const {error}=await client.from('app_data').upsert({user_id:user.id,data,updated_at:new Date().toISOString()});if(error)throw error;authStatus('Dados salvos na nuvem.');});}
$('saveCloud').onclick=cloudSave;
$('loadCloud').onclick=()=>task(async()=>{if(session)throw Error('Finalize o treino em andamento antes de carregar dados.');if(!user)throw Error('Entre na conta primeiro.');const {data:row,error}=await client.from('app_data').select('data').eq('user_id',user.id).maybeSingle();if(error)throw error;if(!row)throw Error('Nenhum dado encontrado.');normalize(row.data);if(!confirm('Substituir dados locais pelos da nuvem? Descansos antigos serão ajustados para 40 s nesta primeira atualização.'))return;data=row.data;migrate();save();renderAll();authStatus('Dados carregados.');});
['loginButton','signupButton'].forEach(id=>$(id).onclick=()=>task(async()=>{const email=$('authEmail').value.trim(),password=$('authPassword').value;if(!email||!password)throw Error('Informe e-mail e senha.');authStatus('Conectando...');const result=id==='loginButton'?await client.auth.signInWithPassword({email,password}):await client.auth.signUp({email,password});if(result.error)throw result.error;user=result.data.session?.user||null;$('authPassword').value='';authUI();if(!user && id==='signupButton')authStatus('Confira o e-mail para confirmar o cadastro.');}));
$('logoutButton').onclick=()=>task(async()=>{const {error}=await client.auth.signOut();if(error)throw error;user=null;authUI();});
$('testConnection').onclick=()=>task(async()=>{const {error}=await client.from('app_data').select('user_id').limit(1);if(error)throw error;authStatus('Conexão disponível. Login e salvamento precisam ser testados separadamente.');});
migrate();catalog.forEach(name=>el('option',name,$('exerciseList')).value=name);
if(session && (!Array.isArray(session.items)||!session.items[session.index]))session=null;
renderAll();if(session)tab('run');
setInterval(()=>{if(session)renderRunner();},250);
document.addEventListener('visibilitychange',()=>{persist();if(!document.hidden)renderRunner();});
window.addEventListener('pagehide',persist);window.addEventListener('pageshow',()=>renderRunner());
try{if(window.supabase){client=window.supabase.createClient('https://rysoaghymsiyyfgpfotc.supabase.co','sb_publishable_RLIESGfLNz0R0jlQGF4A6w_2e9HKgRV');const result=await client.auth.getSession();if(result.error)throw result.error;user=result.data.session?.user||null;authUI();}else authStatus('Nuvem indisponível; treino local disponível.');}catch(e){authStatus('Erro na nuvem: '+e.message);}
$('startupStatus').textContent='Versão 7 — relógio real, lista de exercícios e descanso de 40 s. A retomada automática conta desde o fim do descanso, inclusive com a tela bloqueada.';
