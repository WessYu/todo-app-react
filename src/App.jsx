import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'wess-todo-liquid-v1'
const rainGlyphs = ['W', 'E', 'S', 'S', '0', '1', 'T', 'O', 'D', 'O', '{', '}', '<', '/', '>']

const starterTasks = [
  { id: 'task-1', title: 'Estudar React por 30 minutos', done: false, createdAt: Date.now() },
  { id: 'task-2', title: 'Atualizar um projeto do GitHub', done: true, createdAt: Date.now() - 1000 },
  { id: 'task-3', title: 'Separar uma tarefa para amanha', done: false, createdAt: Date.now() - 2000 },
]

function createTask(title) {
  return {
    id: `task-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    title,
    done: false,
    createdAt: Date.now(),
  }
}

function CodeRain() {
  return (
    <div className="code-rain" aria-hidden="true">
      {Array.from({ length: 86 }, (_, index) => (
        <span
          key={index}
          style={{
            '--x': `${(index * 29) % 100}%`,
            '--delay': `${-((index * 0.41) % 9).toFixed(2)}s`,
            '--duration': `${5.2 + (index % 8) * 0.55}s`,
            '--size': `${0.72 + (index % 6) * 0.16}rem`,
            '--alpha': `${0.32 + (index % 5) * 0.1}`,
          }}
        >
          {rainGlyphs[index % rainGlyphs.length]}
        </span>
      ))}
    </div>
  )
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : starterTasks
  })
  const [taskTitle, setTaskTitle] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.done)
    if (filter === 'done') return tasks.filter((task) => task.done)
    return tasks
  }, [filter, tasks])

  const completed = tasks.filter((task) => task.done).length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  function addTask(event) {
    event.preventDefault()
    const title = taskTitle.trim()
    if (!title) return

    setTasks((current) => [createTask(title), ...current])
    setTaskTitle('')
  }

  function toggleTask(taskId) {
    setTasks((current) => current.map((task) => (
      task.id === taskId ? { ...task, done: !task.done } : task
    )))
  }

  function removeTask(taskId) {
    setTasks((current) => current.filter((task) => task.id !== taskId))
  }

  function clearDone() {
    setTasks((current) => current.filter((task) => !task.done))
  }

  return (
    <main className="app-shell">
      <CodeRain />

      <section className="todo-panel" aria-label="Lista de tarefas">
        <div className="panel-glow" aria-hidden="true" />

        <header className="hero-copy">
          <span>Liquid Todo</span>
          <h1>Organize o dia sem perder o clima.</h1>
          <p>Uma lista simples em React com persistencia local, filtros e fundo animado de codigo caindo.</p>
        </header>

        <div className="stats-grid">
          <article>
            <span>Total</span>
            <strong>{tasks.length}</strong>
          </article>
          <article>
            <span>Feitas</span>
            <strong>{completed}</strong>
          </article>
          <article>
            <span>Progresso</span>
            <strong>{progress}%</strong>
          </article>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Digite uma nova tarefa..."
            aria-label="Nova tarefa"
          />
          <button type="submit">Adicionar</button>
        </form>

        <div className="filter-row" aria-label="Filtros de tarefas">
          <button className={filter === 'all' ? 'active' : ''} type="button" onClick={() => setFilter('all')}>Todas</button>
          <button className={filter === 'active' ? 'active' : ''} type="button" onClick={() => setFilter('active')}>Pendentes</button>
          <button className={filter === 'done' ? 'active' : ''} type="button" onClick={() => setFilter('done')}>Concluidas</button>
        </div>

        <div className="task-list">
          {filteredTasks.map((task) => (
            <article className={task.done ? 'task-card done' : 'task-card'} key={task.id}>
              <button className="check-button" type="button" onClick={() => toggleTask(task.id)} aria-label="Alternar tarefa">
                {task.done ? 'OK' : ''}
              </button>
              <button className="task-title" type="button" onClick={() => toggleTask(task.id)}>
                {task.title}
              </button>
              <button className="delete-button" type="button" onClick={() => removeTask(task.id)} aria-label="Remover tarefa">
                X
              </button>
            </article>
          ))}

          {!filteredTasks.length && (
            <div className="empty-state">
              <strong>Nenhuma tarefa aqui.</strong>
              <p>Troque o filtro ou crie uma tarefa nova.</p>
            </div>
          )}
        </div>

        <footer className="panel-footer">
          <span>{tasks.length - completed} tarefa(s) pendente(s)</span>
          <button type="button" onClick={clearDone}>Limpar concluidas</button>
        </footer>
      </section>
    </main>
  )
}

export default App
