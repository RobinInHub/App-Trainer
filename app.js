const SUPABASE_URL = "https://rysoaghymsiyyfgpfotc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RLIESGfLNz0R0jlQGF4A6w_2e9HKgRV";

const EXERCISE_DATABASE = [
  { name: "Agachamento livre", group: "Pernas", equipment: "Barra" },
  { name: "Agachamento Smith", group: "Pernas", equipment: "Máquina" },
  { name: "Agachamento búlgaro", group: "Pernas", equipment: "Halteres" },
  { name: "Leg press 45°", group: "Pernas", equipment: "Máquina" },
  { name: "Leg press horizontal", group: "Pernas", equipment: "Máquina" },
  { name: "Hack machine", group: "Pernas", equipment: "Máquina" },
  { name: "Cadeira extensora", group: "Pernas", equipment: "Máquina" },
  { name: "Cadeira flexora", group: "Pernas", equipment: "Máquina" },
  { name: "Mesa flexora", group: "Pernas", equipment: "Máquina" },
  { name: "Afundo", group: "Pernas", equipment: "Halteres" },
  { name: "Stiff com barra", group: "Pernas", equipment: "Barra" },
  { name: "Levantamento terra", group: "Pernas", equipment: "Barra" },
  { name: "Levantamento terra romeno", group: "Pernas", equipment: "Barra" },
  { name: "Panturrilha em pé", group: "Pernas", equipment: "Máquina" },
  { name: "Panturrilha sentado", group: "Pernas", equipment: "Máquina" },
  { name: "Cadeira adutora", group: "Pernas", equipment: "Máquina" },
  { name: "Cadeira abdutora", group: "Pernas", equipment: "Máquina" },
  { name: "Supino reto com barra", group: "Peito", equipment: "Barra" },
  { name: "Supino inclinado com barra", group: "Peito", equipment: "Barra" },
  { name: "Supino declinado com barra", group: "Peito", equipment: "Barra" },
  { name: "Supino reto com halteres", group: "Peito", equipment: "Halteres" },
  { name: "Supino inclinado com halteres", group: "Peito", equipment: "Halteres" },
  { name: "Supino reto na máquina", group: "Peito", equipment: "Máquina" },
  { name: "Supino inclinado na máquina", group: "Peito", equipment: "Máquina" },
  { name: "Crucifixo na máquina", group: "Peito", equipment: "Máquina" },
  { name: "Peck deck", group: "Peito", equipment: "Máquina" },
  { name: "Crucifixo com halteres", group: "Peito", equipment: "Halteres" },
  { name: "Flexão de braço", group: "Peito", equipment: "Peso corporal" },
  { name: "Flexão inclinada", group: "Peito", equipment: "Peso corporal" },
  { name: "Paralelas", group: "Peito", equipment: "Peso corporal" },
  { name: "Puxada alta na polia", group: "Costas", equipment: "Máquina" },
  { name: "Puxada com pegada neutra", group: "Costas", equipment: "Máquina" },
  { name: "Puxada frontal", group: "Costas", equipment: "Máquina" },
  { name: "Remada baixa na polia", group: "Costas", equipment: "Máquina" },
  { name: "Remada curvada", group: "Costas", equipment: "Barra" },
  { name: "Remada unilateral com halter", group: "Costas", equipment: "Halteres" },
  { name: "Remada máquina", group: "Costas", equipment: "Máquina" },
  { name: "Levantamento terra tradicional", group: "Costas", equipment: "Barra" },
  { name: "Barra fixa", group: "Costas", equipment: "Peso corporal" },
  { name: "Remada invertida", group: "Costas", equipment: "Peso corporal" },
  { name: "Desenvolvimento com halteres", group: "Ombros", equipment: "Halteres" },
  { name: "Desenvolvimento na máquina", group: "Ombros", equipment: "Máquina" },
  { name: "Desenvolvimento com barra", group: "Ombros", equipment: "Barra" },
  { name: "Elevação lateral", group: "Ombros", equipment: "Halteres" },
  { name: "Elevação frontal", group: "Ombros", equipment: "Halteres" },
  { name: "Peck deck invertido", group: "Ombros", equipment: "Máquina" },
  { name: "Encolhimento de ombros", group: "Ombros", equipment: "Halteres" },
  { name: "Rosca direta", group: "Bíceps", equipment: "Barra" },
  { name: "Rosca alternada", group: "Bíceps", equipment: "Halteres" },
  { name: "Rosca martelo", group: "Bíceps", equipment: "Halteres" },
  { name: "Rosca na máquina", group: "Bíceps", equipment: "Máquina" },
  { name: "Rosca na polia", group: "Bíceps", equipment: "Máquina" },
  { name: "Tríceps corda", group: "Tríceps", equipment: "Máquina" },
  { name: "Tríceps na máquina", group: "Tríceps", equipment: "Máquina" },
  { name: "Tríceps francês", group: "Tríceps", equipment: "Halteres" },
  { name: "Tríceps testa", group: "Tríceps", equipment: "Barra" },
  { name: "Tríceps na polia", group: "Tríceps", equipment: "Máquina" },
  { name: "Mergulho no banco", group: "Tríceps", equipment: "Peso corporal" },
  { name: "Abdominal supra", group: "Abdômen", equipment: "Peso corporal" },
  { name: "Abdominal na máquina", group: "Abdômen", equipment: "Máquina" },
  { name: "Abdominal na polia", group: "Abdômen", equipment: "Máquina" },
  { name: "Prancha abdominal", group: "Abdômen", equipment: "Peso corporal" },
  { name: "Prancha lateral", group: "Abdômen", equipment: "Peso corporal" },
  { name: "Elevação de pernas", group: "Abdômen", equipment: "Peso corporal" },
  { name: "Esteira", group: "Cardio", equipment: "Máquina" },
  { name: "Bicicleta ergométrica", group: "Cardio", equipment: "Máquina" },
  { name: "Elíptico", group: "Cardio", equipment: "Máquina" },
  { name: "Pular corda", group: "Cardio", equipment: "Peso corporal" },
  { name: "Caminhada", group: "Cardio", equipment: "Peso corporal" }
];

const FULL_BODY_PRESETS = [
  {
    name: "Full Body A — Quadríceps e Peito",
    exercises: [
      { name: "Leg press 45°", sets: 3, reps: "10-12", load: "", restSeconds: 90 },
      { name: "Supino reto na máquina", sets: 3, reps: "8-12", load: "", restSeconds: 90 },
      { name: "Remada baixa na polia", sets: 2, reps: "10-12", load: "", restSeconds: 75 },
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
      { name: "Panturrilha em pé", sets: 2, reps: "15-20", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Full Body C — Pernas e Ombros",
    exercises: [
      { name: "Hack machine", sets: 3, reps: "8-12", load: "", restSeconds: 90 },
      { name: "Desenvolvimento na máquina", sets: 3, reps: "8-12", load: "", restSeconds: 90 },
      { name: "Remada unilateral com halter", sets: 2, reps: "10-12 por lado", load: "", restSeconds: 75 },
      { name: "Cadeira flexora", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Supino reto na máquina", sets: 2, reps: "10-12", load: "", restSeconds: 75 },
      { name: "Abdominal na máquina", sets: 2, reps: "12-20", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Full Body D — Metabólico",
    exercises: [
      { name: "Leg press 45°", sets: 2, reps: "15", load: "", restSeconds: 60 },
      { name: "Puxada com pegada neutra", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
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
      { name: "Leg press 45°", sets: 2, reps: "15-20", load: "", restSeconds: 60 },
      { name: "Puxada com pegada neutra", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Supino reto na máquina", sets: 2, reps: "12-15", load: "", restSeconds: 60 },
      { name: "Cadeira flexora", sets: 2, reps: "15", load: "", restSeconds: 60 },
      { name: "Cadeira adutora", sets: 2, reps: "12-15", load: "", restSeconds: 45 },
      { name: "Elevação lateral", sets: 2, reps: "15-20", load: "", restSeconds: 45 },
      { name: "Abdominal na máquina", sets: 2, reps: "15-20", load: "", restSeconds: 45 }
    ]
  },
  {
    name: "Cardio diário",
    exercises: [
      { name: "Esteira", sets: 1, reps: "10 min", load: "5,0-5,5 km/h", restSeconds: 0 },
      { name: "Bicicleta ergométrica", sets: 1, reps: "20-30 min", load: "intensidade moderada", restSeconds: 0 }
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
let exerciseTimer = null;
let restTimer = null;
let currentUser = null;
let supabase = null;

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
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

function renderExerciseList() {
  const datalist = document.getElementById('exerciseList');
  datalist.innerHTML = '';

  EXERCISE_DATABASE.forEach(ex => {
    datalist.innerHTML += `<option value="${ex.name}">${ex.group} • ${ex.equipment}</option>`;
  });
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
          <input list="exerciseList" value="${ex.name}" placeholder="Escolha ou digite o exercício" data-field="name">
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
    return alert('Selecione um treino com exercícios.');
  }

  runState = {
    workoutId: workout.id,
    workoutName: workout.name,
    exerciseIndex: 0,
    setIndex: 1,
    completedSets: 0,
    elapsedSeconds: 0,
    timerRunning: false,
    totalExerciseSeconds: 0,
    exerciseLog: {}
  };

  document.getElementById('runner').classList.remove('hidden');
  document.getElementById('restCard').classList.add('hidden');
  showCurrentExercise();
  resetExerciseTimer();
};

function showCurrentExercise() {
  const workout = data.workouts.find(w => w.id === runState.workoutId);
  const exercise = workout.exercises[runState.exerciseIndex];

  document.getElementById('currentExercise').textContent = exercise.name || 'Exercício';
  document.getElementById('currentInfo').textContent =
    `Série ${runState.setIndex} de ${exercise.sets} • ${exercise.reps} reps • Carga: ${exercise.load || 'livre'}`;
}

function resetExerciseTimer() {
  clearInterval(exerciseTimer);
  runState.elapsedSeconds = 0;
  runState.timerRunning = false;
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('timerLabel').textContent = 'Tempo do exercício';
  document.getElementById('toggleTimer').textContent = 'Iniciar tempo';
}

document.getElementById('toggleTimer').onclick = () => {
  if (!runState) return;

  if (runState.timerRunning) {
    clearInterval(exerciseTimer);
    runState.timerRunning = false;
    document.getElementById('toggleTimer').textContent = 'Continuar tempo';
    document.getElementById('timerLabel').textContent = 'Tempo pausado';
  } else {
    runState.timerRunning = true;
    document.getElementById('toggleTimer').textContent = 'Pausar tempo';
    document.getElementById('timerLabel').textContent = 'Tempo do exercício';

    exerciseTimer = setInterval(() => {
      runState.elapsedSeconds++;
      document.getElementById('timer').textContent = formatTime(runState.elapsedSeconds);
    }, 1000);
  }
};

function startRest(seconds) {
  clearInterval(restTimer);

  if (!seconds || seconds <= 0) {
    document.getElementById('restCard').classList.add('hidden');
    return;
  }

  let remaining = seconds;
  document.getElementById('restCard').classList.remove('hidden');
  document.getElementById('restTimer').textContent = formatTime(remaining);

  restTimer = setInterval(() => {
    remaining--;
    document.getElementById('restTimer').textContent = formatTime(remaining);

    if (remaining <= 0) {
      clearInterval(restTimer);
      document.getElementById('restCard').classList.add('hidden');
      alert('Descanso concluído! Inicie o tempo da próxima série.');
    }
  }, 1000);
}

document.getElementById('skipRest').onclick = () => {
  clearInterval(restTimer);
  document.getElementById('restCard').classList.add('hidden');
};

document.getElementById('completeSet').onclick = () => {
  if (!runState) return;

  clearInterval(exerciseTimer);
  runState.timerRunning = false;

  const timeSpent = runState.elapsedSeconds;
  runState.totalExerciseSeconds += timeSpent;
  runState.completedSets++;

  const workout = data.workouts.find(w => w.id === runState.workoutId);
  const exercise = workout.exercises[runState.exerciseIndex];
  const exerciseName = exercise.name || 'Exercício';

  runState.exerciseLog[exerciseName] = (runState.exerciseLog[exerciseName] || 0) + 1;

  alert(`Série concluída!\n${exerciseName}\nTempo: ${formatTime(timeSpent)}`);

  if (runState.setIndex < exercise.sets) {
    runState.setIndex++;
    showCurrentExercise();
    resetExerciseTimer();
    startRest(exercise.restSeconds || 60);
  } else if (runState.exerciseIndex < workout.exercises.length - 1) {
    runState.exerciseIndex++;
    runState.setIndex = 1;
    showCurrentExercise();
    resetExerciseTimer();
    startRest(exercise.restSeconds || 60);
  } else {
    finish();
  }
};

document.getElementById('skipExercise').onclick = () => {
  if (!runState) return;

  clearInterval(exerciseTimer);
  const workout = data.workouts.find(w => w.id === runState.workoutId);

  if (runState.exerciseIndex < workout.exercises.length - 1) {
    runState.exerciseIndex++;
    runState.setIndex = 1;
    showCurrentExercise();
    resetExerciseTimer();
  } else {
    finish();
  }
};

document.getElementById('finishWorkout').onclick = finish;

function finish() {
  if (!runState) return;

  clearInterval(exerciseTimer);
  clearInterval(restTimer);
  document.getElementById('restCard').classList.add('hidden');

  const exercisesDone = Object.entries(runState.exerciseLog).map(([name, sets]) => ({
    name,
    sets
  }));

  data.history.unshift({
    id: uid(),
    date: new Date().toLocaleString('pt-BR'),
    dateISO: todayISO(),
    workout: runState.workoutName,
    completedSets: runState.completedSets,
    totalExerciseSeconds: runState.totalExerciseSeconds,
    exercises: exercisesDone
  });

  save();
  runState = null;
  document.getElementById('runner').classList.add('hidden');
  renderHistory();
  renderRecords();
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
    const exercises = (item.exercises || [])
      .map(ex => `${ex.name}: ${ex.sets} série(s)`)
      .join('<br>');

    list.innerHTML += `
      <div class="workout-item">
        <strong>${item.workout}</strong><br>
        ${item.date}<br>
        Séries concluídas: ${item.completedSets}<br>
        Tempo total de exercício: ${formatTime(item.totalExerciseSeconds || 0)}<br>
        ${exercises}
      </div>
    `;
  });
}

function renderRecords() {
  const today = todayISO();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekAgoISO = weekAgo.toISOString().slice(0, 10);

  const todayRecords = data.history.filter(h => h.dateISO === today);
  const weekRecords = data.history.filter(h => h.dateISO >= weekAgoISO);

  function count(records) {
    let exercises = 0;
    let sets = 0;

    records.forEach(record => {
      (record.exercises || []).forEach(ex => {
        exercises++;
        sets += ex.sets;
      });
    });

    return { exercises, sets };
  }

  const todayCount = count(todayRecords);
  const weekCount = count(weekRecords);

  document.getElementById('todayStats').textContent =
    `Exercícios realizados: ${todayCount.exercises} • Séries concluídas: ${todayCount.sets}`;

  document.getElementById('weekStats').textContent =
    `Exercícios realizados: ${weekCount.exercises} • Séries concluídas: ${weekCount.sets}`;

  const daily = document.getElementById('dailyRecords');
  daily.innerHTML = '';

  const byDay = {};
  weekRecords.forEach(record => {
    byDay[record.dateISO] = byDay[record.dateISO] || [];
    byDay[record.dateISO].push(record);
  });

  Object.keys(byDay).sort().reverse().forEach(day => {
    const dayCount = count(byDay[day]);
    const names = [...new Set(byDay[day].flatMap(r => (r.exercises || []).map(e => e.name)))]
      .join(', ') || 'Nenhum exercício registrado';

    daily.innerHTML += `
      <div class="workout-item">
        <strong>${day}</strong><br>
        Exercícios: ${dayCount.exercises} • Séries: ${dayCount.sets}<br>
        ${names}
      </div>
    `;
  });
}

document.getElementById('clearHistory').onclick = () => {
  if (confirm('Limpar todo o histórico e registros?')) {
    data.history = [];
    save();
    renderHistory();
    renderRecords();
  }
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
  renderRecords();
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

renderExerciseList();
renderWorkouts();
renderSelect();
renderHistory();
renderRecords();
initSupabase();
checkSession();