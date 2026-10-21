# App Trainer

Aplicativo web para montar treinos, controlar séries, repetições, carga, descanso e histórico.

## Funcionalidades

- Treinos Full Body A-E prontos
- Criação de treinos personalizados
- Timer de descanso
- Histórico de treinos
- Exportação e importação em JSON
- Login por e-mail com Supabase
- Salvar e carregar treinos na nuvem

## Configuração do Supabase

No SQL Editor do Supabase, execute:

```sql
create table if not exists app_data (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table app_data enable row level security;

create policy "usuario acessa apenas seus dados"
on app_data
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Depois:

1. Abra a aba **Dados**.
2. Crie uma conta com e-mail e senha.
3. Confirme o e-mail, se solicitado.
4. Clique em **Salvar na nuvem**.
5. Em outro aparelho, entre com a mesma conta e clique em **Carregar da nuvem**.

## Publicar no GitHub Pages

1. Entre em **Settings** do repositório.
2. Abra **Pages**.
3. Escolha **Deploy from a branch**.
4. Selecione `main` e `/root`.
5. Salve.

O site ficará em:

`https://robininhub.github.io/App-Trainer/`
