"use client";

import {
  AlarmClock,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  TimerReset,
  X,
} from "lucide-react";
import { startTransition, useEffect, useState, type FormEvent } from "react";
import { dailyBlocks, questionGoals, revisionIntervals, studyWeeks, weeklyRoutine, type StudyWeek } from "./study-plan";

type View = "overview" | "subjects" | "plan" | "schedule" | "notes";
type Task = { id: number; title: string; subject: string; time: string; done: boolean };
const initialTasks: Task[] = [];
const weeks = studyWeeks.map((week) => ({
  period: week.period,
  common: week.topics.filter((item) => item.track === "COMUM").map((item) => `${item.subject}: ${item.detail}`).join(" "),
  pmpe: week.topics.filter((item) => item.track === "PMPE").map((item) => `${item.subject}: ${item.detail}`).join(" "),
  pcpe: week.topics.filter((item) => item.track === "PCPE AGENTE").map((item) => `${item.subject}: ${item.detail}`).join(" "),
}));
const storageKeys = {
  tasks: "acompanhamento-v4-tasks",
  notes: "acompanhamento-v4-notes",
  timer: "acompanhamento-v4-timer",
  days: "acompanhamento-v4-days",
};
const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const planStartDate = new Date(2026, 9, 19);

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function studyDateFor(weekIndex: number, dayIndex: number) {
  const date = new Date(planStartDate);
  date.setDate(date.getDate() + weekIndex * 7 + dayIndex);
  return date;
}

const navigation = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "subjects", label: "Matérias", icon: BookOpen },
  { id: "plan", label: "Cronograma", icon: CalendarDays },
  { id: "notes", label: "Anotações", icon: FileText },
] as const;

const subjectGroups = [
  {
    title: "Base compartilhada",
    note: "Estude uma vez e confira no edital de cada banca as diferenças de profundidade.",
    items: [
      ["Língua Portuguesa", "Interpretação, coesão, gramática e ortografia."],
      ["Raciocínio Lógico", "Conjuntos, proporções, lógica e resolução de problemas."],
      ["Informática", "Sistemas, ferramentas de escritório, internet e segurança."],
      ["Direito Constitucional", "Princípios, direitos e organização do Estado, respeitando o recorte de cada edital."],
      ["Direitos Humanos", "Tópicos relacionados nos dois editais; extensão e legislação variam."],
    ],
  },
  {
    title: "Específicas · PMPE Soldado",
    items: [
      ["História de Pernambuco", "Colonização, movimentos históricos, período republicano e cultura."],
      ["Direitos Humanos e legislação", "Leis e conteúdos do bloco específico do edital PMPE."],
      ["Redação e TAF", "Treino de redação e preparação física conforme os índices do edital."],
    ],
  },
  {
    title: "Específicas · PCPE Agente",
    items: [
      ["Legislação Estadual", "Constituição de Pernambuco, estatutos e leis estaduais indicadas."],
      ["Direito Administrativo", "Princípios, atos, poderes, organização e controle da Administração."],
      ["Direito Penal e Processual Penal", "Teoria do crime, leis penais, inquérito, provas e procedimentos."],
      ["Contabilidade Geral e Estatística", "Disciplinas específicas previstas para Agente."],
      ["Atualidades e discursiva", "Atualidades de segurança pública para a prova discursiva."],
    ],
  },
];

const defaultNote = "";

const dayFocus = [
  { day: "Segunda", key: "Português", track: "COMUM" },
  { day: "Terça", key: "História", track: "PMPE" },
  { day: "Quarta", key: "Raciocínio", track: "COMUM" },
  { day: "Quinta", key: "Informática", track: "COMUM" },
  { day: "Sexta", key: "Constitucional", track: "COMUM" },
];

function dailyPlanFor(week: StudyWeek) {
  const catchAll = week.topics.find((item) => item.subject === "Segunda a sábado");
  const findDetails = (key: string) => week.topics.filter((item) => item.subject.includes(key)).map((item) => item.detail);
  const makeBlocks = (subject: string, detail: string) => {
    const goal = questionGoals.find((item) => item.subject.includes(subject) || subject.includes(item.subject));
    return [
      { ...dailyBlocks[0], detail: `Estude este tópico: ${detail} Em Direito, leia também os dispositivos legais pertinentes.` },
      { ...dailyBlocks[1], detail: `Resolva ${goal?.count || "10–20"} questões de ${subject}, corrija cada resposta e registre os erros.` },
      { ...dailyBlocks[2], detail: "Faça recordação sem consulta, encaixe revisões D+1/D+7/D+30 e analise o caderno de erros." },
    ];
  };

  const weekdays = dayFocus.map(({ day, key, track }) => {
    const details = findDetails(key);
    const detail = details.length ? details.join(" ") : catchAll?.detail || `Revisão dos tópicos anteriores de ${key} e questões dos assuntos com menor aproveitamento.`;
    return {
      day,
      subject: key === "Raciocínio" ? "Raciocínio Lógico" : key,
      track,
      detail,
      blocks: makeBlocks(key, detail),
    };
  });

  const saturdayDetails = week.topics.filter((item) => item.subject.includes("Direitos Humanos") || item.subject.includes("Legislação"));
  const pcpeTopics = week.topics.filter((item) => item.track === "PCPE AGENTE");
  weekdays.push({
    day: "Sábado",
    subject: "Direitos Humanos + Legislação",
    track: "PMPE + PCPE",
    detail: `${saturdayDetails.length ? saturdayDetails.map((item) => item.detail).join(" ") : "Divida o estudo entre Direitos Humanos e legislação extravagante do edital PMPE."}${pcpeTopics.length ? ` PCPE Agente, nas questões: ${pcpeTopics.map((item) => `${item.subject}: ${item.detail}`).join(" ")}` : " PCPE Agente: use o bloco de questões para revisar a matéria específica da semana."}`,
    blocks: makeBlocks("Direitos Humanos + Legislação", saturdayDetails.map((item) => item.detail).join(" ") || "Direitos Humanos e legislação extravagante do edital PMPE."),
  });

  weekdays.push({
    day: "Domingo",
    subject: "Revisão + simulado + redação",
    track: "ALTERNAR PMPE / PCPE",
    detail: "Priorize os pontos fracos, questões mistas e treino discursivo. A cada domingo, registre os três assuntos com pior desempenho.",
    blocks: [
      { time: "45 min", label: "Revisão programada", detail: "Revisões D+1, D+7 e D+30; retome os erros antigos." },
      { time: "1h15", label: "Simulado e questões", detail: "Questões mistas cronometradas; alterne o foco PMPE/PCPE." },
      { time: "1h", label: "Redação", detail: "Produza um texto e revise estrutura, argumentação e gramática." },
    ],
  });

  return weekdays;
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [notes, setNotes] = useState(defaultNote);
  const [completedDays, setCompletedDays] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerDeadline, setTimerDeadline] = useState<number | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [today, setToday] = useState("");
  const [calendarNow, setCalendarNow] = useState(planStartDate.getTime());

  useEffect(() => {
    const currentDateValue = new Date();
    const currentDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(currentDateValue);
    let savedTasks: string | null = null;
    let savedNotes: string | null = null;
    let savedTimer: string | null = null;
    let savedDays: string | null = null;
    try {
      savedTasks = localStorage.getItem(storageKeys.tasks);
      savedNotes = localStorage.getItem(storageKeys.notes);
      savedTimer = localStorage.getItem(storageKeys.timer);
      savedDays = localStorage.getItem(storageKeys.days);
    } catch {
      localStorage.removeItem(storageKeys.tasks);
      localStorage.removeItem(storageKeys.timer);
      localStorage.removeItem(storageKeys.days);
    }
    startTransition(() => {
      setToday(currentDate);
      setCalendarNow(currentDateValue.getTime());
      if (savedTasks) setTasks(JSON.parse(savedTasks) as Task[]);
      if (savedNotes !== null) setNotes(savedNotes);
      if (savedDays) setCompletedDays(JSON.parse(savedDays) as Record<string, string>);
      if (savedTimer) {
        const timer = JSON.parse(savedTimer) as { minutes?: number; remaining?: number; deadline?: number | null; completed?: number };
        const minutes = timer.minutes || 25;
        const remaining = timer.deadline ? Math.max(0, Math.ceil((timer.deadline - Date.now()) / 1000)) : timer.remaining ?? minutes * 60;
        setSelectedMinutes(minutes);
        setSecondsLeft(remaining);
        setTimerDeadline(timer.deadline && remaining > 0 ? timer.deadline : null);
        setCompletedSessions(timer.completed || 0);
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
  }, [ready, tasks]);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKeys.notes, notes);
  }, [ready, notes]);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKeys.days, JSON.stringify(completedDays));
  }, [ready, completedDays]);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKeys.timer, JSON.stringify({ minutes: selectedMinutes, remaining: secondsLeft, deadline: timerDeadline, completed: completedSessions }));
  }, [ready, selectedMinutes, secondsLeft, timerDeadline, completedSessions]);

  useEffect(() => {
    if (!timerDeadline) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setTimerDeadline(null);
        if (selectedMinutes === 25) setCompletedSessions((count) => count + 1);
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [timerDeadline, selectedMinutes]);

  const completedTasks = tasks.filter((task) => task.done).length;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const now = new Date(calendarNow);
  const elapsedDays = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - planStartDate.getTime()) / 86400000);
  const activeWeekIndex = Math.max(0, Math.min(studyWeeks.length - 1, Math.floor(elapsedDays / 7)));
  const activeWeek = studyWeeks[activeWeekIndex];
  const activeWeekDates = dayLabels.map((label, dayIndex) => {
    const date = studyDateFor(activeWeekIndex, dayIndex);
    const key = localDateKey(date);
    return { label, date, key, done: Boolean(completedDays[key]) };
  });
  const completedDaysThisWeek = activeWeekDates.filter((day) => day.done).length;
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const planDatesThisMonth = studyWeeks.flatMap((_, weekIndex) => dayLabels.map((_, dayIndex) => studyDateFor(weekIndex, dayIndex))).filter((date) => localDateKey(date).startsWith(currentMonthKey));
  const completedDaysThisMonth = planDatesThisMonth.filter((date) => Boolean(completedDays[localDateKey(date)])).length;
  const monthlyTargetHours = planDatesThisMonth.length * 3;
  const completedWeeks = studyWeeks.map((_, weekIndex) => dayLabels.every((_, dayIndex) => Boolean(completedDays[localDateKey(studyDateFor(weekIndex, dayIndex))])) ? weekIndex : -1).filter((weekIndex) => weekIndex >= 0);

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    setTasks((current) => [...current, { id: Date.now(), title: taskTitle.trim(), subject: taskSubject, time: taskTime, done: false }]);
    setTaskTitle("");
    setTaskSubject("");
    setTaskTime("");
    setIsTaskFormOpen(false);
  }

  function selectTimer(minutes: number) {
    setTimerDeadline(null);
    setSelectedMinutes(minutes);
    setSecondsLeft(minutes * 60);
  }

  function toggleTimer() {
    if (timerDeadline) {
      setSecondsLeft(Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000)));
      setTimerDeadline(null);
      return;
    }
    const remaining = secondsLeft || selectedMinutes * 60;
    setSecondsLeft(remaining);
    setTimerDeadline(Date.now() + remaining * 1000);
  }

  function resetTimer() {
    setTimerDeadline(null);
    setSecondsLeft(selectedMinutes * 60);
  }

  function toggleWeek(index: number) {
    const keys = dayLabels.map((_, dayIndex) => localDateKey(studyDateFor(index, dayIndex)));
    const allDone = keys.every((key) => Boolean(completedDays[key]));
    setCompletedDays((current) => {
      const updated = { ...current };
      keys.forEach((key) => {
        if (allDone) delete updated[key];
        else if (!updated[key]) updated[key] = new Date().toISOString();
      });
      return updated;
    });
  }

  function toggleStudyDay(key: string) {
    setCompletedDays((current) => {
      if (current[key]) {
        const remaining = { ...current };
        delete remaining[key];
        return remaining;
      }
      return { ...current, [key]: new Date().toISOString() };
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <a className="brand" href="#inicio" onClick={(event) => { event.preventDefault(); setView("overview"); }}>
          <span className="brand-mark"><ShieldCheck size={19} strokeWidth={2} /></span>
          <span><strong>Acompanhamento</strong><small>DE ESTUDOS</small></span>
        </a>
        <div className="nav-caption">ÁREA DE ESTUDOS</div>
        <nav className="nav-list" aria-label="Seções do painel">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button className={`nav-link ${view === id ? "active" : ""}`} key={id} type="button" onClick={() => setView(id)} aria-current={view === id ? "page" : undefined}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{view === id && <ChevronRight className="nav-chevron" size={14} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="field-note"><span>LEMBRETE DE CAMPO</span><p>Consistência hoje. Confiança no dia da prova.</p></div>
          <div className="profile"><span className="avatar">AE</span><span><strong>Plano integrado</strong><small>PMPE Soldado + PCPE Agente</small></span></div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>PAINEL</span><ChevronRight size={13} /><strong>{navigation.find((item) => item.id === view)?.label}</strong></div>
          <div className="topbar-right"><span className="today-label">{today}</span><span className="status-pill"><span /> PLANO ATIVO</span></div>
        </header>

        <div className={`content-grid ${view === "plan" ? "plan-mode" : ""}`}>
          <main className="main-content">
            {view === "overview" && (
              <section className="view-panel" aria-labelledby="page-title">
                <p className="eyebrow"><span className="eyebrow-mark" /> PLANO INTEGRADO · 2026 / 2027</p>
                <div className="hero-row"><div><h1 id="page-title">Pronto para avançar?</h1><p className="page-lead">Duas provas. Uma base compartilhada. Um plano claro para cada etapa.</p></div><div className="countdown"><span>PRÓXIMA PROVA</span><strong>21<span>FEV</span></strong><small>PMPE · SOLDADO</small></div></div>
                <div className="stats-grid">
                  <article className="stat-card"><div className="stat-label"><ClipboardCheck size={15} /> TAREFAS DO DIA</div><strong>{tasks.length}</strong><small>No seu plano de estudos</small></article>
                  <article className="stat-card"><div className="stat-label"><CheckCircle2 size={15} /> CONCLUÍDAS</div><strong>{completedTasks}<span>/{tasks.length}</span></strong><small>Marque cada avanço</small></article>
                  <article className="stat-card"><div className="stat-label"><CalendarDays size={15} /> DIAS ATÉ A PCPE</div><strong>143</strong><small>Agente · prova em 07 mar</small></article>
                </div>
                <div className="section-heading"><div><span className="section-index">01 / HOJE</span><h2>Ordem do dia</h2></div><button className="command-button" type="button" onClick={() => setIsTaskFormOpen(true)}><Plus size={16} /> Adicionar tarefa</button></div>
                {isTaskFormOpen && <form className="task-form" onSubmit={addTask}><label>Nova tarefa<input autoFocus maxLength={90} onChange={(event) => setTaskTitle(event.target.value)} placeholder="O que você vai estudar?" required value={taskTitle} /></label><label>Matéria<select onChange={(event) => setTaskSubject(event.target.value)} required value={taskSubject}><option disabled value="">Selecione</option><option>Base comum</option><option>PMPE · Soldado</option><option>PCPE · Agente</option></select></label><label>Horário<input onChange={(event) => setTaskTime(event.target.value)} type="time" value={taskTime} /></label><button className="primary-button" type="submit">Salvar tarefa</button><button aria-label="Cancelar" className="icon-action" onClick={() => setIsTaskFormOpen(false)} type="button"><X size={17} /></button></form>}
                <div className="task-list" aria-live="polite">{tasks.length ? tasks.map((task) => <article className={`task-row ${task.done ? "done" : ""}`} key={task.id}><button aria-label={`${task.done ? "Reabrir" : "Concluir"}: ${task.title}`} aria-pressed={task.done} className="task-check" onClick={() => toggleTask(task.id)} type="button"><Check size={14} /></button><div className="task-copy"><strong>{task.title}</strong><small>{task.subject}</small></div><time>{task.time}</time></article>) : <p className="empty-state">Sem tarefas por enquanto. Adicione uma para começar.</p>}</div>
                <section className="week-summary" aria-labelledby="pace-heading">
                  <div className="section-heading"><div><span className="section-index">02 / PROGRESSO</span><h2 id="pace-heading">Ritmo de estudo</h2></div><button className="text-link" onClick={() => setView("plan")} type="button">Ver cronograma <ArrowRight size={15} /></button></div>
                  <div className="pace-grid">
                    <article className="pace-card">
                      <div className="pace-card-heading"><div><span>SEMANA {String(activeWeekIndex + 1).padStart(2, "0")} · {activeWeek.title.toUpperCase()}</span><strong>{activeWeek.period}</strong></div><b>{completedDaysThisWeek}<small>/7 dias</small></b></div>
                      <div className="pace-bar" role="progressbar" aria-label="Progresso da semana planejada" aria-valuenow={Math.round(completedDaysThisWeek / 7 * 100)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${completedDaysThisWeek / 7 * 100}%` }} /></div>
                      <div className="pace-days">{activeWeekDates.map((day) => <button className={day.done ? "day-marked" : ""} key={day.key} onClick={() => toggleStudyDay(day.key)} type="button" aria-pressed={day.done} aria-label={`${day.done ? "Desmarcar" : "Marcar"} ${day.label}, dia ${day.date.getDate()}, como estudado`}><span>{day.label}</span><strong>{day.date.getDate()}</strong><Check size={12} /></button>)}</div>
                      <small className="pace-caption">{completedDaysThisWeek * 3}h de 21h registradas nesta semana</small>
                    </article>
                    <article className="pace-card monthly-pace">
                      <div className="pace-card-heading"><div><span>RITMO DO MÊS</span><strong>{new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(now)}</strong></div><b>{completedDaysThisMonth * 3}<small>h</small></b></div>
                      <div className="pace-bar" role="progressbar" aria-label="Dias de estudo concluídos neste mês" aria-valuenow={planDatesThisMonth.length ? Math.round(completedDaysThisMonth / planDatesThisMonth.length * 100) : 0} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${planDatesThisMonth.length ? completedDaysThisMonth / planDatesThisMonth.length * 100 : 0}%` }} /></div>
                      <p className="monthly-detail">{completedDaysThisMonth} de {planDatesThisMonth.length} dias planejados · meta estimada de {monthlyTargetHours}h</p>
                      <small className="pace-caption">Base: 3h por dia previsto no cronograma</small>
                    </article>
                  </div>
                </section>
              </section>
            )}

            {view === "subjects" && (
              <section className="view-panel" aria-labelledby="page-title"><p className="eyebrow"><span className="eyebrow-mark" /> EDITAIS PMPE + PCPE</p><h1 id="page-title">Matérias da missão</h1><p className="page-lead">A base comum é estudada uma vez. As disciplinas específicas ficam identificadas por concurso.</p>{subjectGroups.map((group) => <section className="subject-group" key={group.title}><div className="section-heading"><div><span className="section-index">{group.title.startsWith("Base") ? "BASE COMPARTILHADA" : "CONTEÚDO ESPECÍFICO"}</span><h2>{group.title}</h2></div></div>{group.note && <p className="group-note">{group.note}</p>}<div className="subject-list">{group.items.map(([title, description], index) => <article className="subject-row" key={title}><span className="subject-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{title}</strong><small>{description}</small></span><BookOpen className="subject-book" size={17} /></article>)}</div></section>)}</section>
            )}

            {view === "plan" && (
              <section className="view-panel" aria-labelledby="page-title">
                <p className="eyebrow"><span className="eyebrow-mark" /> PLANO PMPE · 12 SEMANAS + EXTENSÃO</p>
                <h1 id="page-title">Cronograma de estudos</h1>
                <p className="page-lead">Plano-base de Soldado PMPE integrado à preparação para PCPE Agente. O ciclo de 12 semanas é uma proposta de organização, não uma previsão oficial da prova.</p>

                <div className="exam-banner">
                  <article><span>PMPE · SOLDADO</span><strong>21 fev 2027</strong><small>60 questões objetivas + redação</small></article>
                  <article><span>PCPE · AGENTE</span><strong>07 mar 2027</strong><small>Prova objetiva + discursiva · tarde</small></article>
                </div>

                <section className="routine-section">
                  <div className="section-heading"><div><span className="section-index">CARGA SEMANAL</span><h2>3h por dia · 21h por semana</h2></div><span className="status-pill"><span /> DOMINGO INCLUÍDO</span></div>
                  <p className="group-note">Distribuição sugerida para cada dia de estudo:</p>
                  <div className="routine-grid block-grid">{dailyBlocks.map((block) => <article className="routine-day" key={block.label}><strong>{block.time}</strong><b>{block.label}</b><span>{block.detail}</span></article>)}</div>
                  <div className="section-heading routine-heading"><div><span className="section-index">GRADE FIXA</span><h2>O foco de cada dia</h2></div></div>
                  <div className="routine-list">{weeklyRoutine.map((item) => <article className="routine-row" key={item.day}><strong>{item.day}</strong><span><b>{item.subject}</b><small>{item.focus}</small></span><em>{item.track}</em></article>)}</div>
                </section>

                <section className="plan-section">
                  <div className="section-heading"><div><span className="section-index">CONTEÚDO VERTICALIZADO + RETA FINAL</span><h2>Metas semana a semana</h2></div><span className="week-total">{completedWeeks.length}/{studyWeeks.length} concluídas</span></div>
                  <p className="group-note">Abra uma semana, estude os tópicos do dia e marque-o como feito. A semana só conta como concluída quando os sete dias forem realizados.</p>
                  <div className="plan-list">{studyWeeks.map((week, index) => <article className={`plan-week ${completedWeeks.includes(index) ? "week-done" : ""}`} key={week.period}>
                    <details className="week-details" open={index === 0}>
                      <summary className="week-summary-head"><span className="week-number">SEMANA {String(index + 1).padStart(2, "0")}</span><span className="week-heading"><strong>{week.period}</strong><small>{week.title} · {dayLabels.filter((_, dayIndex) => completedDays[localDateKey(studyDateFor(index, dayIndex))]).length}/7 dias feitos</small></span><span className="week-open">VER DIAS <ChevronRight size={15} /></span></summary>
                      <div className="daily-plan-grid">{dailyPlanFor(week).map((day, dayIndex) => {
                        const date = studyDateFor(index, dayIndex);
                        const dateKey = localDateKey(date);
                        const isDone = Boolean(completedDays[dateKey]);
                        return <article className={`day-plan ${day.track.includes("PMPE") ? "day-pmpe" : ""} ${day.track.includes("PCPE") ? "day-pcpe" : ""} ${isDone ? "day-done" : ""}`} key={day.day}>
                          <div className="day-plan-header"><span>{String(dayIndex + 1).padStart(2, "0")}</span><div><strong>{day.day} · {new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(date)}</strong><small>{day.track}</small></div></div>
                          <h3>{day.subject}</h3><p className="day-topic">{day.detail}</p>
                          <ol className="day-block-list">{day.blocks.map((block) => <li key={`${block.time}-${block.label}`}><div><strong>{block.time}</strong><small>{block.label}</small></div><p>{block.detail}</p></li>)}</ol>
                          <button className="day-complete" type="button" onClick={() => toggleStudyDay(dateKey)} aria-pressed={isDone}><Check size={14} /> {isDone ? "Dia concluído" : "Marcar dia feito"}</button>
                        </article>;
                      })}</div>
                    </details>
                  </article>)}</div>
                </section>

                <section className="routine-section">
                  <div className="section-heading"><div><span className="section-index">REVISÃO PROGRAMADA</span><h2>Revisitar para fixar</h2></div></div>
                  <div className="routine-grid review-grid">{revisionIntervals.map((item) => <article className="routine-day" key={item.interval}><strong>{item.interval}</strong><b>{item.duration}</b><span>{item.activity}</span></article>)}</div>
                  <p className="group-note">Use os 45 minutos diários de revisão para estes retornos e para corrigir erros antigos. Se acumular, priorize o que você mais erra.</p>
                </section>

                <section className="routine-section">
                  <div className="section-heading"><div><span className="section-index">REFERÊNCIAS, NÃO OBRIGAÇÕES</span><h2>Meta inicial de questões</h2></div></div>
                  <div className="goal-list">{questionGoals.map((goal) => <div className="goal-row" key={goal.subject}><span>{goal.subject}</span><strong>{goal.count} por sessão</strong></div>)}</div>
                  <p className="group-note">Em questões complexas, priorize correção e entendimento em vez de perseguir volume.</p>
                </section>

                <section className="routine-section">
                  <div className="section-heading"><div><span className="section-index">MÉTODO</span><h2>Caderno de erros</h2></div></div>
                  <div className="error-method"><p><strong>01</strong><span><b>Assunto</b> Registre o tópico exato da questão.</span></p><p><strong>02</strong><span><b>Motivo</b> Identifique desconhecimento, confusão conceitual ou falta de atenção.</span></p><p><strong>03</strong><span><b>Correção</b> Anote a regra, o conceito ou o dispositivo legal a rever.</span></p><p><strong>DOM</strong><span><b>Revisão semanal</b> Escolha os três assuntos com pior desempenho para priorizar na semana seguinte.</span></p></div>
                </section>

                <section className="routine-section exam-format">
                  <div className="section-heading"><div><span className="section-index">PMPE · SOLDADO</span><h2>Formato da prova</h2></div></div>
                  <div><strong>60 questões objetivas</strong><span>60 pontos</span></div><div><strong>Redação</strong><span>40 pontos</span></div>
                  <p className="group-note">A redação merece treino semanal. A conclusão do conteúdo em 12 semanas depende do seu nível e ritmo; se algo ficar pendente, conclua antes de repetir assunto já dominado.</p>
                </section>

                <p className="disclaimer"><TimerReset size={15} /> A grade de 12 semanas foi transcrita do cronograma enviado. A extensão posterior organiza revisão e preparação até as datas previstas nos editais.</p>
              </section>
            )}

            {view === "schedule" && (
              <section className="view-panel" aria-labelledby="page-title"><p className="eyebrow"><span className="eyebrow-mark" /> CICLO DE ESTUDO · 20 SEMANAS</p><h1 id="page-title">Cronograma operacional</h1><p className="page-lead">Prioridade PMPE até 21 de fevereiro; na sequência, foco total em PCPE Agente até 7 de março.</p><div className="exam-banner"><article><span>PMPE · SOLDADO</span><strong>21 fev 2027</strong><small>Prova objetiva + redação</small></article><article><span>PCPE · AGENTE</span><strong>07 mar 2027</strong><small>Prova objetiva + discursiva · tarde</small></article></div><section className="routine-section"><div className="section-heading"><div><span className="section-index">DISTRIBUIÇÃO SEMANAL</span><h2>Rotina-base · 15h por semana</h2></div><span className="status-pill"><span /> 3 BLOCOS / DIA</span></div><p className="group-note">Proposta provisória: 3 blocos de 50 minutos, de segunda a sábado, e descanso aos domingos. Ajustável ao seu cronograma atual.</p><div className="routine-grid">{[["SEG", "Português", "Raciocínio Lógico", "Legislação Estadual · PCPE"], ["TER", "Constitucional · comum", "História de Pernambuco · PMPE", "Administrativo · PCPE"], ["QUA", "Informática · comum", "Direitos Humanos", "Penal · PCPE"], ["QUI", "Português + redação · PMPE", "Processual Penal · PCPE", "História de Pernambuco · PMPE"], ["SEX", "Contabilidade · PCPE", "Estatística · PCPE", "Redação / discursiva"], ["SÁB", "Simulado alternado", "Caderno de erros", "Treino físico · TAF"]].map(([day, ...subjects]) => <article className="routine-day" key={day}><strong>{day}</strong>{subjects.map((subject) => <span key={subject}>{subject}</span>)}</article>)}</div></section><section className="plan-section"><div className="section-heading"><div><span className="section-index">METAS PROGRESSIVAS</span><h2>Semana a semana</h2></div><span className="week-total">{completedWeeks.length}/{weeks.length} concluídas</span></div><p className="group-note">Marque a semana concluída para acompanhar o avanço. Faça questões ao fim de cada bloco e registre os erros.</p><div className="plan-list">{weeks.map((week, index) => <article className={`plan-week ${completedWeeks.includes(index) ? "week-done" : ""}`} key={week.period}><div className="plan-week-date"><span>SEMANA {String(index + 1).padStart(2, "0")}</span><strong>{week.period}</strong><small>{index < 18 ? "PMPE + PCPE" : "FOCO PCPE"}</small></div><div className="plan-week-focus"><p><strong>COMUM</strong>{week.common}</p><p className="pmpe-track"><strong>PMPE</strong>{week.pmpe}</p><p className="pcpe-track"><strong>PCPE AGENTE</strong>{week.pcpe}</p></div><button aria-label={`${completedWeeks.includes(index) ? "Desmarcar" : "Marcar"} semana ${index + 1} como concluída`} aria-pressed={completedWeeks.includes(index)} className="week-toggle" onClick={() => toggleWeek(index)} type="button"><Check size={16} /></button></article>)}</div></section><p className="disclaimer"><TimerReset size={15} /> Carga horária provisória: o cronograma de 12 semanas que você mencionou ainda não foi anexado.</p></section>
            )}

            {view === "notes" && (
              <section className="view-panel" aria-labelledby="page-title"><p className="eyebrow"><span className="eyebrow-mark" /> CADERNO PESSOAL</p><h1 id="page-title">Anotações de campo</h1><p className="page-lead">Registre aprendizados, dúvidas e pontos para revisar. O salvamento é automático neste navegador.</p><label className="notes-label" htmlFor="notes-area">Caderno de estudos</label><textarea className="notes-area" id="notes-area" onChange={(event) => setNotes(event.target.value)} placeholder="Uma ideia importante de hoje..." value={notes} /><p className="save-status">{ready ? "Salvo automaticamente neste dispositivo." : "Carregando suas anotações..."}</p></section>
            )}
          </main>

          <aside className="right-column" aria-label="Ferramentas de foco">
            <section className="focus-card"><div className="focus-photo"><span className="focus-photo-caption">CENTRO DE OPERAÇÕES <span>● ONLINE</span></span></div><div className="focus-body"><span className="focus-kicker"><AlarmClock size={14} /> TÉCNICA POMODORO</span><h2>Foco na próxima etapa.</h2><div className="timer-display" role="timer" aria-live="off">{minutes}:{seconds}</div><div className="timer-modes" aria-label="Duração da sessão" role="group">{[25, 5, 15].map((value) => <button className={selectedMinutes === value ? "selected" : ""} key={value} onClick={() => selectTimer(value)} type="button">{value === 25 ? "Foco 25" : `Pausa ${value}`}</button>)}</div><div className="timer-actions"><button className="timer-start" onClick={toggleTimer} type="button">{timerDeadline ? <><Pause size={15} /> Pausar sessão</> : <><Play size={15} /> {secondsLeft < selectedMinutes * 60 && secondsLeft > 0 ? "Continuar sessão" : "Iniciar sessão"}</>}</button><button aria-label="Reiniciar timer" className="timer-reset" onClick={resetTimer} title="Reiniciar" type="button"><RotateCcw size={16} /></button></div><p className="focus-count">{completedSessions} {completedSessions === 1 ? "sessão de foco concluída" : "sessões de foco concluídas"} hoje</p></div></section>
            <section className="mission-card"><div className="mission-icon"><GraduationCap size={17} /></div><div><span>LEMBRETE</span><p>Consistência hoje. Confiança no dia da prova.</p></div></section>
            <section className="storage-card"><ListChecks size={16} /><span>Tarefas, notas, progresso semanal e timer ficam salvos neste dispositivo.</span></section>
          </aside>
        </div>
      </div>
    </div>
  );
}