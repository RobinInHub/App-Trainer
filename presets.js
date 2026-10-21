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