const SUPABASE_URL = "https://rysoaghymsiyyfgpfotc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RLIESGfLNz0R0jlQGF4A6w_2e9HKgRV";

const FULL_BODY_PRESETS = [
  {
    name: "Full Body A — Quadríceps e Peito",
    exercises: [
      { name: "Leg press 45°", sets: 3, reps: "10-12", load: "", restSeconds: 90 },
      { name: "Supino reto na máquina", sets: 3, reps: "8-12", load: "", restSeconds: 90 },
      { name: "Remada baixa", sets: 2, reps: "10-12", load: "", restSeconds: 75 },
      { name: "Mesa flexora", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Elevação lateral", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Abdominal na máquina", sets: 2, reps: "12-20", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Full Body B — Costas e Posteriores",
    exercises: [
      { name: "Cadeira flexora", sets: 3, reps: "10-15", load: "", restSeconds: 75 },
      { name: "Puxada com pegada neutra", sets: 3, reps: "8-12", load: "", restSeconds: 90 },
      { name: "Supino inclinado na máquina", sets: 2, reps: "10-12", load: "", restSeconds: 75 },
      { name: "Cadeira extensora", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Peck deck invertido", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Panturrilha na máquina", sets: 2, reps: "15-20", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Full Body C — Pernas e Ombros",
    exercises: [
      { name: "Hack machine ou agachamento Smith", sets: 3, reps: "8-12", load: "", restSeconds: 90 },
      { name: "Desenvolvimento na máquina", sets: 3, reps: "8-12", load: "", restSeconds: 90 },
      { name: "Remada unilateral", sets: 2, reps: "10-12 por lado", load: "", restSeconds: 75 },
      { name: "Cadeira flexora", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Supino reto na máquina", sets: 2, reps: "10-12", load: "", restSeconds: 75 },
      { name: "Abdominal na máquina", sets: 2, reps: "12-20", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Full Body D — Metabólico",
    exercises: [
      { name: "Leg press leve", sets: 2, reps: "15", load: "", restSeconds: 60 },
      { name: "Puxada neutra", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Supino inclinado na máquina", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Mesa flexora", sets: 2, reps: "15", load: "", restSeconds: 60 },
      { name: "Elevação lateral", sets: 2, reps: "15", load: "", restSeconds: 45 },
      { name: "Rosca alternada", sets: 2, reps: "12-15", load: "", restSeconds: 45 },
      { name: "Tríceps corda", sets: 2, reps: "12-15", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Full Body E — Leve",
    exercises: [
      { name: "Leg press leve", sets: 2, reps: "15-20", load: "", restSeconds: 60 },
      { name: "Puxada neutra", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Supino na máquina", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Cadeira flexora", sets: 2, reps: "15", load: "", restSeconds: 60 },
      { name: "Cadeira adutora", sets: 2, reps: "12-15", load: "", restSeconds: 45 },
      { name: "Elevação lateral", sets: 2, reps: "15-20", load: "", restSeconds: 45 },
      { name: "Abdominal na máquina", sets: 2, reps: "15-20", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Cardio diário",
    exercises: [
      { name: "Aquecimento na esteira — 5,0 a 5,5 km/h", sets: 1, reps: "10 min", load: "", restSeconds: 0 },
      { name: "Cardio pós-treino — bicicleta ou esteira", sets: 1, reps: "20-30 min", load: "intensidade moderada", restSeconds: 0 }
    ]
  }
];

const STORE_KEY = 'app-trainer-data';

let data = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  version: 1,
  workouts: [],
  history: []
};

let runState = null;
let timerInterval = null;
let currentUser = null;
let supabase = null;

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  document.querySelector(`nav button[data-tab="${name}"]`).classList.add('active');
}

document.querySelectorAll('nav button').forEach(button => {
  button.onclick = () => switchTab(button.dataset.tab);
});

function setAuthStatus(message) {
  document.getElementById('authStatus').textContent = message;
}

function initSupabase() {
  try {
    if (!window.supabase) {
      setAuthStatus('Erro: biblioteca do Supabase não carregou.');
      return;
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    setAuthStatus('Biblioteca carregada. Faça login ou teste a conexão.');
  } catch (error) {
    console.error(error);
    setAuthStatus('Erro ao iniciar Supabase: ' + error.message);
  }
}

function renderWorkouts() {
  const list = document.getElementById('workoutList');
  list.innerHTML = '';

  data.workouts.forEach(workout => {
    const div = document.createElement('div');
    div.className = 'workout-item';
    div.innerHTML = `
      <h3>${workout.name}</h3>
      <button class="add-exercise">Adicionar exercício</button>
      <button class="danger delete-workout">Excluir treino</button>
      <div class="exercises"></div>
    `;

    const exercisesDiv = div.querySelector('.exercises');

    function renderExercises() {
      exercisesDiv.innerHTML = '';
      workout.exercises.forEach((ex, index) => {
        const row = document.createElement('div');
        row.className = 'exercise-row';
        row.innerHTML = `
          <input value="${ex.name}" placeholder="Exercício" data-field="name">
          <input type="number" value="${ex.sets}" min="1" placeholder="Séries" data-field="sets">
          <input value="${ex.reps}" placeholder="Reps" data-field="reps">
          <input value="${ex.load}" placeholder="Carga" data-field="load">
          <input type="number" value="${ex.restSeconds}" min="0" placeholder="Descanso" data-field="restSeconds">
          <button class="danger remove-exercise">X</button>
        `;

        row.querySelectorAll('input').forEach(input => {
          input.oninput = () => {
            const field = input.dataset.field;
            workout.exercises[index][field] =
              field === 'sets' || field === 'restSeconds'
                ? Number(input.value) || 0
                : input.value;
            save();
          };
        });

        row.querySelector('.remove-exercise').onclick = () => {
          workout.exercises.splice(index, 1);
          save();
          renderExercises();
        };

        exercisesDiv.appendChild(row);
      });
    }

    div.querySelector('.add-exercise').onclick = () => {
      workout.exercises.push({
        name: '',
        sets: 3,
        reps: '10-12',
        load: '',
        restSeconds: 60
      });
      save();
      renderExercises();
    };

    div.querySelector('.delete-workout').onclick = () => {
      if (confirm(`Excluir o treino "${workout.name}"?`)) {
        data.workouts = data.workouts.filter(w => w.id !== workout.id);
        save();
        renderWorkouts();
        renderSelect();
      }
    };

    renderExercises();
    list.appendChild(div);
  });
}

document.getElementById('createWorkout').onclick = () => {
  const name = document.getElementById('workoutName').value.trim();
  if (!name) return alert('Digite o nome do treino.');

  data.workouts.push({ id: uid(), name, exercises: [] });
  document.getElementById('workoutName').value = '';
  save();
  renderWorkouts();
  renderSelect();
};

document.getElementById('addPresets').onclick = () => {
  let added = 0;

  FULL_BODY_PRESETS.forEach(preset => {
    const exists = data.workouts.some(w => w.name === preset.name);
    if (!exists) {
      data.workouts.push({
        id: uid(),
        name: preset.name,
        exercises: preset.exercises.map(ex => ({ ...ex }))
      });
      added++;
    }
  });

  save();
  renderWorkouts();
  renderSelect();
  alert(added ? `${added} treinos adicionados!` : 'Esses treinos já estão cadastrados.');
};

function renderSelect() {
  const select = document.getElementById('selectWorkout');
  select.innerHTML = '<option value="">Selecione...</option>';
  data.workouts.forEach(w => {
    select.innerHTML += `<option value="${w.id}">${w.name}</option>`;
  });
}

document.getElementById('startWorkout').onclick = () => {
  const id = document.getElementById('selectWorkout').value;
  const workout = data.workouts.find(w => w.id === id);

  if (!workout || workout.exercises.length === 0) {
    return alert('Selecione um treino com exercícios. Se a lista estiver vazia, vá em Treinos e clique em Adicionar treinos Full Body A-E.');
  }

  runState = {
    workoutId: workout.id,
    workoutName: workout.name,
    exerciseIndex: 0,
    setIndex: 1,
    completedSets: 0
  };

  document.getElementById('runner').classList.remove('hidden');
  showCurrentExercise();
};

function showCurrentExercise() {
  const workout = data.workouts.find(w => w.id === runState.workoutId);
  const exercise = workout.exercises[runState.exerciseIndex];

  document.getElementById('currentExercise').textContent = exercise.name || 'Exercício';
  document.getElementById('currentInfo').textContent =
    `Série ${runState.setIndex} de ${exercise.sets} • ${exercise.reps} reps • Carga: ${exercise.load || 'livre'}`;
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  let remaining = seconds;
  updateTimerDisplay(remaining);

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      alert('Descanso concluído!');
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${m}:${s}`;
}

document.getElementById('completeSet').onclick = () => {
  const workout = data.workouts.find(w => w.id === runState.workoutId);
  const exercise = workout.exercises[runState.exerciseIndex];

  runState.completedSets++;

  if (runState.setIndex < exercise.sets) {
    runState.setIndex++;
    showCurrentExercise();
    startTimer(exercise.restSeconds || 60);
  } else if (runState.exerciseIndex < workout.exercises.length - 1) {
    runState.exerciseIndex++;
    runState.setIndex = 1;
    showCurrentExercise();
    startTimer(exercise.restSeconds || 60);
  } else {
    finish();
  }
};

document.getElementById('skipExercise').onclick = () => {
  const workout = data.workouts.find(w => w.id === runState.workoutId);

  if (runState.exerciseIndex < workout.exercises.length - 1) {
    runState.exerciseIndex++;
    runState.setIndex = 1;
    showCurrentExercise();
  } else {
    finish();
  }
};

document.getElementById('finishWorkout').onclick = finish;

function finish() {
  clearInterval(timerInterval);

  data.history.unshift({
    id: uid(),
    date: new Date().toLocaleString('pt-BR'),
    workout: runState.workoutName,
    completedSets: runState.completedSets
  });

  save();
  runState = null;
  document.getElementById('runner').classList.add('hidden');
  renderHistory();
  switchTab('history');

  if (currentUser) saveToCloud(false);
}

function renderHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';

  if (data.history.length === 0) {
    list.innerHTML = '<div class="card">Nenhum treino registrado ainda.</div>';
    return;
  }

  data.history.forEach(item => {
    list.innerHTML += `
      <div class="workout-item">
        <strong>${item.workout}</strong><br>
        ${item.date}<br>
        Séries concluídas: ${item.completedSets}
      </div>
    `;
  });
}

document.getElementById('clearHistory').onclick = () => {
  if (confirm('Limpar todo o histórico?')) {
    data.history = [];
    save();
    renderHistory();
  }
};

document.getElementById('exportData').onclick = () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'app-trainer-backup.json';
  link.click();
};

document.getElementById('importData').onclick = () => {
  const file = document.getElementById('importFile').files[0];
  if (!file) return alert('Escolha um arquivo JSON.');

  const reader = new FileReader();
  reader.onload = event => {
    try {
      const imported = JSON.parse(event.target.result);
      if (!imported.workouts) throw new Error();
      data = imported;
      save();
      renderWorkouts();
      renderSelect();
      renderHistory();
      alert('Dados importados com sucesso!');
    } catch {
      alert('Arquivo inválido.');
    }
  };
  reader.readAsText(file);
};

function updateAuthInterface() {
  const logged = Boolean(currentUser);

  document.getElementById('loginButton').classList.toggle('hidden', logged);
  document.getElementById('signupButton').classList.toggle('hidden', logged);
  document.getElementById('logoutButton').classList.toggle('hidden', !logged);
  document.getElementById('authEmail').classList.toggle('hidden', logged);
  document.getElementById('authPassword').classList.toggle('hidden', logged);

  if (logged) setAuthStatus(`Conectado: ${currentUser.email}`);
}

document.getElementById('signupButton').onclick = async () => {
  if (!supabase) return alert('Supabase não foi inicializado.');

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

  if (!email || password.length < 6) {
    return alert('Informe um e-mail válido e uma senha com pelo menos 6 caracteres.');
  }

  setAuthStatus('Criando conta...');

  try {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error(error);
      setAuthStatus('Erro: ' + error.message);
      return alert('Erro ao criar conta: ' + error.message);
    }

    setAuthStatus('Conta criada. Confirme o e-mail, se solicitado.');
    alert('Conta criada! Confirme o e-mail, se o Supabase solicitar, e depois entre.');
  } catch (error) {
    console.error(error);
    setAuthStatus('Erro inesperado: ' + error.message);
  }
};

document.getElementById('loginButton').onclick = async () => {
  if (!supabase) return alert('Supabase não foi inicializado.');

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

  if (!email || !password) return alert('Informe e-mail e senha.');

  setAuthStatus('Conectando...');

  try {
    const { data: result, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error(error);
      setAuthStatus('Erro: ' + error.message);
      return alert('Erro ao entrar: ' + error.message);
    }

    currentUser = result.user;
    updateAuthInterface();
    alert('Login realizado!');
  } catch (error) {
    console.error(error);
    setAuthStatus('Erro inesperado: ' + error.message);
  }
};

document.getElementById('logoutButton').onclick = async () => {
  await supabase.auth.signOut();
  currentUser = null;
  updateAuthInterface();
  setAuthStatus('Não conectado.');
  alert('Você saiu da conta.');
};

document.getElementById('testConnection').onclick = async () => {
  if (!supabase) {
    setAuthStatus('Erro: Supabase não inicializado.');
    return alert('A biblioteca do Supabase não carregou. Atualize a página com Ctrl+F5.');
  }

  setAuthStatus('Testando conexão...');

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const { error } = await supabase.from('app_data').select('user_id').limit(1);

    if (error) {
      console.error(error);
      setAuthStatus('Conexão OK, mas erro na tabela: ' + error.message);
      return alert('Conexão com Supabase OK, mas a tabela app_data precisa ser criada.\n\nErro: ' + error.message);
    }

    setAuthStatus(sessionData.session ? 'Conexão OK e usuário logado.' : 'Conexão OK. Faça login.');
    alert('Conexão com o Supabase funcionando!');
  } catch (error) {
    console.error(error);
    setAuthStatus('Erro de conexão: ' + error.message);
  }
};

async function saveToCloud(showAlert = true) {
  if (!supabase) return alert('Supabase não foi inicializado.');
  if (!currentUser) return alert('Entre na sua conta primeiro.');

  setAuthStatus('Salvando na nuvem...');

  const { error } = await supabase
    .from('app_data')
    .upsert({
      user_id: currentUser.id,
      data: data,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error(error);
    setAuthStatus('Erro ao salvar: ' + error.message);
    return alert('Erro ao salvar na nuvem: ' + error.message);
  }

  setAuthStatus(`Conectado: ${currentUser.email}`);
  if (showAlert) alert('Treinos e histórico salvos na nuvem!');
}

document.getElementById('saveCloud').onclick = () => saveToCloud(true);

document.getElementById('loadCloud').onclick = async () => {
  if (!supabase) return alert('Supabase não foi inicializado.');
  if (!currentUser) return alert('Entre na sua conta primeiro.');

  setAuthStatus('Carregando da nuvem...');

  const { data: result, error } = await supabase
    .from('app_data')
    .select('data')
    .eq('user_id', currentUser.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    setAuthStatus('Erro ao carregar: ' + error.message);
    return alert('Erro ao carregar: ' + error.message);
  }

  if (!result || !result.data) {
    setAuthStatus(`Conectado: ${currentUser.email}`);
    return alert('Nenhum backup encontrado na nuvem.');
  }

  if (!confirm('Isso substituirá os treinos e o histórico locais pelos dados da nuvem. Continuar?')) return;

  data = result.data;
  save();
  renderWorkouts();
  renderSelect();
  renderHistory();
  setAuthStatus(`Conectado: ${currentUser.email}`);
  alert('Dados carregados da nuvem!');
};

async function checkSession() {
  if (!supabase) return;

  try {
    const { data: result } = await supabase.auth.getSession();
    currentUser = result.session?.user || null;
    updateAuthInterface();

    if (!currentUser) {
      setAuthStatus('Biblioteca carregada. Faça login ou teste a conexão.');
    }
  } catch (error) {
    console.error(error);
    setAuthStatus('Erro ao verificar sessão: ' + error.message);
  }
}

window.onerror = function(message) {
  setAuthStatus('Erro no app: ' + message);
};

renderWorkouts();
renderSelect();
renderHistory();
initSupabase();
checkSession();