const STORE_KEY = 'app-trainer-data';

let data = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  version: 1,
  workouts: [],
  history: []
};

let runState = null;
let timerInterval = null;

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

renderWorkouts();
renderSelect();
renderHistory();