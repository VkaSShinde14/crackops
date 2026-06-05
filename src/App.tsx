import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  CircleDollarSign,
  Flame,
  GitBranch,
  Gauge,
  Home,
  Layers3,
  MessageSquare,
  Moon,
  Network,
  Play,
  RotateCcw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  companyPacks,
  contentStats,
  costModules,
  enrichedQuestions as questions,
  enrichedTopics as topics,
  incidents,
  knowledgeNodes,
  projectStories,
  tools,
} from "./data/phase2";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type {
  CompanyPack,
  Difficulty,
  ExperienceLevel,
  FollowUpNode,
  IncidentPlaybook,
  InterviewType,
  KnowledgeNode,
  Profile,
  ProjectStory,
  ProgressMap,
  Question,
  QuestionStatus,
  RevisionCadence,
  ToolPage,
  Topic,
  ViewId,
} from "./types";

const defaultProfile: Profile = {
  experience: "3-5 yrs",
  interviewType: "Azure DevOps Engineer",
  daysLeft: 21,
  focusTopics: ["pipelines", "yaml", "service-connections", "terraform"],
};

const navItems: Array<{ id: ViewId; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "tools", label: "Tools", icon: Boxes },
  { id: "incidents", label: "Issues", icon: Wrench },
  { id: "mock", label: "Mock", icon: Play },
];

const experienceLevels: ExperienceLevel[] = ["fresher", "1-3 yrs", "3-5 yrs", "5+ yrs"];
const interviewTypes: InterviewType[] = [
  "Azure DevOps Engineer",
  "DevOps Engineer",
  "Cloud DevOps",
  "Senior DevOps",
];
const statuses: QuestionStatus[] = ["new", "known", "weak", "revision"];
const difficulties: Difficulty[] = ["basic", "intermediate", "senior"];
const revisionOptions: RevisionCadence[] = ["today", "tomorrow", "3 days", "7 days"];

function getProgress(progress: ProgressMap, id: string) {
  return progress[id] ?? { status: "new", bookmarked: false };
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function App() {
  const [view, setView] = useState<ViewId>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useLocalStorage<Profile>("ado-profile", defaultProfile);
  const [progress, setProgress] = useLocalStorage<ProgressMap>("ado-progress", {});
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [activeQuestionId, setActiveQuestionId] = useState(questions[0].id);
  const [selectedToolId, setSelectedToolId] = useState(tools[0].id);
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0].id);
  const [selectedPackId, setSelectedPackId] = useState(companyPacks[0].id);
  const [selectedProjectId, setSelectedProjectId] = useState(projectStories[0].id);
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState(knowledgeNodes[0].id);
  const [mock, setMock] = useState(() => createMockSession());
  const questionBank = useMemo(() => [...questions, ...tools.flatMap((tool) => tool.interviewQuestions)], []);

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  const activeQuestion = questionBank.find((question) => question.id === activeQuestionId) ?? questions[0];
  const selectedTool = tools.find((tool) => tool.id === selectedToolId) ?? tools[0];
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId) ?? incidents[0];
  const selectedPack = companyPacks.find((pack) => pack.id === selectedPackId) ?? companyPacks[0];
  const selectedProject = projectStories.find((project) => project.id === selectedProjectId) ?? projectStories[0];
  const selectedGraphNode = knowledgeNodes.find((node) => node.id === selectedGraphNodeId) ?? knowledgeNodes[0];
  const readinessModel = useMemo(() => getReadinessModel(progress), [progress]);
  const readiness = readinessModel.score;
  const weakTopics = useMemo(() => getWeakTopics(progress), [progress]);
  const studyPath = useMemo(() => getStudyPath(profile, progress), [profile, progress]);
  const todaysPlan = studyPath.slice(0, 4);
  const revisionCount = questions.filter((question) => {
    const item = getProgress(progress, question.id);
    return item.bookmarked || item.status === "weak" || item.status === "revision";
  }).length;

  const updateQuestion = (id: string, patch: Partial<ReturnType<typeof getProgress>>) => {
    setProgress((current) => ({
      ...current,
      [id]: {
        ...getProgress(current, id),
        ...patch,
        lastReviewed: new Date().toISOString(),
      },
    }));
  };

  const openTopic = (topic: Topic) => {
    setSelectedTopicId(topic.id);
    setView("learn");
  };

  const openQuestion = (question: Question) => {
    setActiveQuestionId(question.id);
    setView("practice");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="icon-btn"
          onClick={() => setSettingsOpen((open) => !open)}
          aria-label={settingsOpen ? "Close settings" : "Open settings"}
          aria-expanded={settingsOpen}
          aria-controls="settings-drawer"
        >
          <Settings2 size={20} />
        </button>
        <div>
          <BrandMark />
          <h1>{pageTitle(view)}</h1>
        </div>
        <div className="streak" aria-label="Readiness score">
          <Flame size={16} />
          {readiness}%
        </div>
      </header>

      <section className="content-area">
        {view === "home" && (
          <HomeDashboard
            profile={profile}
            readiness={readiness}
            weakTopics={weakTopics}
            todaysPlan={todaysPlan}
            revisionCount={revisionCount}
            readinessModel={readinessModel}
            onNavigate={setView}
            onOpenTopic={openTopic}
            onOpenQuestion={openQuestion}
          />
        )}
        {view === "setup" && (
          <SetupView profile={profile} setProfile={setProfile} studyPath={studyPath} onDone={() => setView("home")} />
        )}
        {view === "learn" && (
          <LearningView
            profile={profile}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopicId}
            progress={progress}
            onOpenQuestion={openQuestion}
          />
        )}
        {view === "practice" && (
          <PracticeView
            activeQuestion={activeQuestion}
            setActiveQuestion={setActiveQuestionId}
            progress={progress}
            updateQuestion={updateQuestion}
          />
        )}
        {view === "revise" && (
          <RevisionView progress={progress} updateQuestion={updateQuestion} onOpenQuestion={openQuestion} />
        )}
        {view === "mock" && (
          <MockView
            mock={mock}
            setMock={setMock}
            progress={progress}
            updateQuestion={updateQuestion}
          />
        )}
        {view === "tools" && (
          <ToolsView selectedTool={selectedTool} setSelectedTool={setSelectedToolId} onOpenQuestion={openQuestion} />
        )}
        {view === "incidents" && (
          <IncidentsView
            selectedIncident={selectedIncident}
            setSelectedIncident={setSelectedIncidentId}
          />
        )}
        {view === "cost" && <CostView />}
        {view === "packs" && (
          <CompanyPacksView selectedPack={selectedPack} setSelectedPack={setSelectedPackId} />
        )}
        {view === "project" && (
          <ProjectBuilderView selectedProject={selectedProject} setSelectedProject={setSelectedProjectId} />
        )}
        {view === "graph" && (
          <KnowledgeGraphView
            selectedNode={selectedGraphNode}
            setSelectedNode={setSelectedGraphNodeId}
            onNavigate={setView}
          />
        )}
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={cx("nav-item", view === item.id && "active")}
              onClick={() => setView(item.id)}
              aria-current={view === item.id ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
        setProfile={setProfile}
        studyPath={studyPath}
      />
    </main>
  );
}

function SettingsDrawer({
  open,
  onClose,
  profile,
  setProfile,
  studyPath,
}: {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  studyPath: Topic[];
}) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("drawer-open");
    window.setTimeout(() => drawerRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("drawer-open");
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside
        id="settings-drawer"
        ref={drawerRef}
        className="settings-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Interview profile settings"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          startX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchMove={(event) => {
          if (startX.current === null) return;
          const currentX = event.touches[0]?.clientX ?? startX.current;
          if (startX.current - currentX > 70) onClose();
        }}
        onTouchEnd={() => {
          startX.current = null;
        }}
      >
        <div className="drawer-head">
          <BrandMark />
          <button className="icon-btn" onClick={onClose} aria-label="Close settings drawer">
            <ChevronLeft size={20} />
          </button>
        </div>
        <SetupView profile={profile} setProfile={setProfile} studyPath={studyPath} onDone={onClose} />
      </aside>
      <button className="drawer-scrim" onMouseDown={onClose} aria-label="Close settings by tapping outside" />
    </div>
  );
}

function HomeDashboard({
  profile,
  readiness,
  weakTopics,
  todaysPlan,
  revisionCount,
  readinessModel,
  onNavigate,
  onOpenTopic,
  onOpenQuestion,
}: {
  profile: Profile;
  readiness: number;
  weakTopics: Topic[];
  todaysPlan: Topic[];
  revisionCount: number;
  readinessModel: ReturnType<typeof getReadinessModel>;
  onNavigate: (view: ViewId) => void;
  onOpenTopic: (topic: Topic) => void;
  onOpenQuestion: (question: Question) => void;
}) {
  const continueQuestion = questions[0];

  return (
    <div className="stack">
      <section className="hero-card">
        <div className="score-ring" style={{ "--score": `${readiness}%` } as React.CSSProperties}>
          <span>{readiness}</span>
          <small>ready</small>
        </div>
        <div>
          <p className="eyebrow">Target: {profile.interviewType}</p>
          <h2>{profile.daysLeft} days left to sharpen the edge</h2>
          <p className="muted">Focus path adapts from your selected topics and practice confidence.</p>
        </div>
      </section>

      <div className="metrics-grid">
        <Metric icon={CalendarDays} label="Interview" value={`${profile.daysLeft} days`} />
        <Metric icon={Moon} label="Content bank" value={`${contentStats.questions}+ Qs`} />
        <Metric icon={Bell} label="Revisions" value={`${revisionCount} due`} />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Readiness engine</p>
            <h3>Coverage signals</h3>
          </div>
          <Gauge size={20} />
        </div>
        <div className="score-grid">
          <Metric icon={BookOpen} label="Topics" value={`${readinessModel.topicCoverage}%`} />
          <Metric icon={Target} label="Questions" value={`${readinessModel.questionCoverage}%`} />
          <Metric icon={Wrench} label="Incidents" value={`${readinessModel.incidentCoverage}%`} />
          <Metric icon={Boxes} label="Tools" value={`${readinessModel.toolCoverage}%`} />
          <Metric icon={CircleDollarSign} label="Cost" value={`${readinessModel.costCoverage}%`} />
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Priority</p>
            <h3>Recommended daily plan</h3>
          </div>
          <Sparkles size={20} />
        </div>
        <div className="plan-list">
          {readinessModel.dailyPlan.map((item, index) => (
            <div className="plan-row static" key={item}>
              <span>{index + 1}</span>
              <div>
                <strong>{item}</strong>
                <small>Recommended from weak coverage and enterprise interview patterns</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Today</p>
            <h3>Study plan</h3>
          </div>
          <button className="text-btn" onClick={() => onNavigate("learn")}>View all</button>
        </div>
        <div className="plan-list">
          {todaysPlan.map((topic, index) => (
            <button key={topic.id} className="plan-row" onClick={() => onOpenTopic(topic)}>
              <span>{index + 1}</span>
              <div>
                <strong>{topic.title}</strong>
                <small>{topic.category} - Priority {topic.priority}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="continue-card" onClick={() => onOpenQuestion(continueQuestion)} role="button" tabIndex={0}>
        <div className="continue-icon">
          <Zap size={22} />
        </div>
        <div>
          <p className="eyebrow">Continue Learning</p>
          <h3>{continueQuestion.question}</h3>
          <p className="muted">{continueQuestion.interviewVersion}</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Weak areas</p>
            <h3>Top 5 topics</h3>
          </div>
          <ShieldCheck size={20} />
        </div>
        <div className="chip-wrap">
          {weakTopics.map((topic) => (
            <button key={topic.id} className="topic-chip" onClick={() => onOpenTopic(topic)}>
              {topic.title}
            </button>
          ))}
        </div>
      </section>

      <section className="quick-actions" aria-label="Quick actions">
        {[
          ["Learn", "learn", BookOpen],
          ["Practice", "practice", Target],
          ["Revise", "revise", RotateCcw],
          ["Tools", "tools", Boxes],
          ["Issues", "incidents", Wrench],
          ["Cost", "cost", CircleDollarSign],
          ["Packs", "packs", Building2],
          ["Project", "project", BriefcaseBusiness],
          ["Graph", "graph", Network],
          ["Mock", "mock", Play],
        ].map(([label, target, Icon]) => (
          <button key={label as string} onClick={() => onNavigate(target as ViewId)}>
            <Icon size={20} />
            <span>{label as string}</span>
          </button>
        ))}
      </section>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="CrackOps - Learn. Practice. Crack.">
      <span className="brand-logo" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <path className="logo-cloud" d="M20 41h27a10 10 0 0 0 .8-20 15 15 0 0 0-28.5-4.2A11.5 11.5 0 0 0 20 41Z" />
          <path className="logo-flow" d="M17 32h10l5-7 6 14 5-7h8" />
          <path className="logo-hex" d="M32 9 44 16v14L32 37 20 30V16Z" />
          <path className="logo-terminal" d="m18 47 6 4-6 4M29 55h13" />
          <circle className="logo-target" cx="49" cy="15" r="7" />
          <circle className="logo-target-dot" cx="49" cy="15" r="2.2" />
        </svg>
      </span>
      <span>
        <strong>CrackOps</strong>
        <small>Learn. Practice. Crack.</small>
      </span>
    </div>
  );
}

function SetupView({
  profile,
  setProfile,
  studyPath,
  onDone,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  studyPath: Topic[];
  onDone: () => void;
}) {
  return (
    <div className="stack">
      <section className="panel setup-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Profile</p>
            <h3>Interview target setup</h3>
          </div>
          <Award size={22} />
        </div>

        <Field label="Experience level">
          <div className="segmented">
            {experienceLevels.map((level) => (
              <button
                key={level}
                className={profile.experience === level ? "selected" : ""}
                onClick={() => setProfile((current) => ({ ...current, experience: level }))}
              >
                {level}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Interview type">
          <div className="select-grid">
            {interviewTypes.map((type) => (
              <button
                key={type}
                className={profile.interviewType === type ? "selected" : ""}
                onClick={() => setProfile((current) => ({ ...current, interviewType: type }))}
              >
                {type}
              </button>
            ))}
          </div>
        </Field>

        <Field label={`Days left: ${profile.daysLeft}`}>
          <input
            type="range"
            min="1"
            max="90"
            value={profile.daysLeft}
            onChange={(event) => setProfile((current) => ({ ...current, daysLeft: Number(event.target.value) }))}
          />
        </Field>

        <Field label="Current focus topics">
          <div className="chip-wrap">
            {topics.map((topic) => {
              const selected = profile.focusTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  className={cx("topic-chip", selected && "selected")}
                  onClick={() =>
                    setProfile((current) => ({
                      ...current,
                      focusTopics: selected
                        ? current.focusTopics.filter((id) => id !== topic.id)
                        : [...current.focusTopics, topic.id],
                    }))
                  }
                >
                  {topic.title}
                </button>
              );
            })}
          </div>
        </Field>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Generated path</p>
            <h3>Priority order</h3>
          </div>
          <Sparkles size={20} />
        </div>
        <div className="plan-list">
          {studyPath.slice(0, 8).map((topic, index) => (
            <div className="plan-row static" key={topic.id}>
              <span>{index + 1}</span>
              <div>
                <strong>{topic.title}</strong>
                <small>{topic.category} - {topic.definition}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="primary-btn" onClick={onDone}>Save profile</button>
    </div>
  );
}

function LearningView({
  profile,
  selectedTopic,
  setSelectedTopic,
  progress,
  onOpenQuestion,
}: {
  profile: Profile;
  selectedTopic: Topic;
  setSelectedTopic: (id: string) => void;
  progress: ProgressMap;
  onOpenQuestion: (question: Question) => void;
}) {
  const relatedQuestions = questions.filter((question) => question.topicId === selectedTopic.id);

  return (
    <div className="learn-layout">
      <section className="horizontal-tabs" aria-label="Topics">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className={selectedTopic.id === topic.id ? "selected" : ""}
            onClick={() => setSelectedTopic(topic.id)}
          >
            {profile.focusTopics.includes(topic.id) && <Star size={13} fill="currentColor" />}
            {topic.title}
          </button>
        ))}
      </section>

      <section className="topic-detail">
        <p className="eyebrow">{selectedTopic.category}</p>
        <h2>{selectedTopic.title}</h2>
        <AnswerBlock title="Definition" body={selectedTopic.definition} />
        {selectedTopic.whyExists && <AnswerBlock title="Why it exists" body={selectedTopic.whyExists} />}
        {selectedTopic.businessProblem && <AnswerBlock title="Business problem solved" body={selectedTopic.businessProblem} />}
        <AnswerBlock title="Interview answer" body={selectedTopic.interviewAnswer} />
        <AnswerBlock title="Deep answer" body={selectedTopic.deepAnswer} />
        <AnswerBlock title="Real-world use case" body={selectedTopic.useCase} />
        {selectedTopic.endToEndWorkflow && <ListBlock title="End-to-end workflow" items={selectedTopic.endToEndWorkflow} />}
        {selectedTopic.securityConsiderations && <ListBlock title="Security considerations" items={selectedTopic.securityConsiderations} />}
        {selectedTopic.costConsiderations && <ListBlock title="Cost considerations" items={selectedTopic.costConsiderations} />}
        {selectedTopic.commonMistakes && <ListBlock title="Common mistakes" items={selectedTopic.commonMistakes} />}
        {selectedTopic.troubleshootingApproach && <ListBlock title="Troubleshooting approach" items={selectedTopic.troubleshootingApproach} />}
        {selectedTopic.productionIncidentExamples && <ListBlock title="Production incident examples" items={selectedTopic.productionIncidentExamples} />}
        {selectedTopic.architectDiscussion && <AnswerBlock title="Architect-level discussion" body={selectedTopic.architectDiscussion} />}
        {selectedTopic.architecture && <ArchitectureExplorer architecture={selectedTopic.architecture} />}
        <KnowledgeLinks topic={selectedTopic} />
        <div className="answer-block">
          <h4>Common follow-ups</h4>
          {selectedTopic.followUps.map((followUp) => (
            <p key={followUp}>{followUp}</p>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Practice from this topic</h3>
          <span className="pill">{relatedQuestions.length || "More soon"}</span>
        </div>
        <div className="question-list">
          {(relatedQuestions.length ? relatedQuestions : questions.slice(0, 2)).map((question) => {
            const state = getProgress(progress, question.id);
            return (
              <button className="question-card" key={question.id} onClick={() => onOpenQuestion(question)}>
                <div>
                  <span className="pill">{question.difficulty}</span>
                  <h4>{question.question}</h4>
                  <p>{question.shortAnswer}</p>
                </div>
                {state.bookmarked && <Bookmark size={18} fill="currentColor" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PracticeView({
  activeQuestion,
  setActiveQuestion,
  progress,
  updateQuestion,
}: {
  activeQuestion: Question;
  setActiveQuestion: (id: string) => void;
  progress: ProgressMap;
  updateQuestion: (id: string, patch: Partial<ReturnType<typeof getProgress>>) => void;
}) {
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | "all">("all");

  const filtered = questions.filter((question) => {
    const state = getProgress(progress, question.id);
    const matchesQuery = question.question.toLowerCase().includes(query.toLowerCase());
    const matchesTopic = topicFilter === "all" || question.topicId === topicFilter;
    const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "all" || state.status === statusFilter;
    return matchesQuery && matchesTopic && matchesDifficulty && matchesStatus;
  });
  const state = getProgress(progress, activeQuestion.id);
  const topic = topics.find((item) => item.id === activeQuestion.topicId);

  return (
    <div className="practice-layout">
      <section className="filters panel">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions" />
        </label>
        <select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)}>
          <option value="all">All topics</option>
          {topics.map((topicItem) => (
            <option key={topicItem.id} value={topicItem.id}>{topicItem.title}</option>
          ))}
        </select>
        <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value as Difficulty | "all")}>
          <option value="all">All difficulty</option>
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>{difficulty}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as QuestionStatus | "all")}>
          <option value="all">All status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </section>

      <section className="question-list">
        {filtered.length === 0 && <EmptyState title="No matching questions" body="Try clearing one filter or search term." />}
        {filtered.map((question) => (
          <button
            key={question.id}
            className={cx("question-card", activeQuestion.id === question.id && "selected")}
            onClick={() => setActiveQuestion(question.id)}
          >
            <div>
              <span className="pill">{topics.find((item) => item.id === question.topicId)?.title}</span>
              <h4>{question.question}</h4>
            </div>
            <span className={cx("status-dot", getProgress(progress, question.id).status)} />
          </button>
        ))}
      </section>

      <section className="detail-card">
        <button className="back-link" onClick={() => setActiveQuestion(filtered[0]?.id ?? activeQuestion.id)}>
          <ChevronLeft size={17} /> Question
        </button>
        <div className="panel-head">
          <div>
            <p className="eyebrow">{topic?.title} - {activeQuestion.difficulty}</p>
            <h2>{activeQuestion.question}</h2>
          </div>
          <button
            className={cx("icon-btn", state.bookmarked && "active")}
            onClick={() => updateQuestion(activeQuestion.id, { bookmarked: !state.bookmarked })}
            aria-label="Toggle bookmark"
          >
            <Bookmark size={19} fill={state.bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        <AnswerBlock title="Short answer" body={activeQuestion.shortAnswer} />
        <AnswerBlock title="Detailed answer" body={activeQuestion.detailedAnswer} />
        {activeQuestion.internalWorking && <AnswerBlock title="Internal working" body={activeQuestion.internalWorking} />}
        {activeQuestion.architectureDiagram && <AnswerBlock title="Architecture diagram description" body={activeQuestion.architectureDiagram} />}
        {activeQuestion.productionUsage && <AnswerBlock title="Production usage example" body={activeQuestion.productionUsage} />}
        {activeQuestion.securityConsiderations && <ListBlock title="Security considerations" items={activeQuestion.securityConsiderations} />}
        {activeQuestion.costConsiderations && <ListBlock title="Cost considerations" items={activeQuestion.costConsiderations} />}
        {activeQuestion.commonMistakes && <ListBlock title="Common mistakes" items={activeQuestion.commonMistakes} />}
        {activeQuestion.troubleshootingGuide && <ListBlock title="Troubleshooting guide" items={activeQuestion.troubleshootingGuide} />}
        {activeQuestion.realIncidentExample && <AnswerBlock title="Real incident example" body={activeQuestion.realIncidentExample} />}
        {activeQuestion.commandsAndLogs && <CommandBlock title="Commands and logs" items={activeQuestion.commandsAndLogs} />}
        {activeQuestion.advancedDiscussion && <AnswerBlock title="Advanced discussion" body={activeQuestion.advancedDiscussion} />}
        {activeQuestion.architectDiscussion && <AnswerBlock title="Architect-level discussion" body={activeQuestion.architectDiscussion} />}
        <AnswerBlock title="Senior-level answer" body={activeQuestion.seniorAnswer} />
        <AnswerBlock title="Interview speaking version" body={activeQuestion.interviewVersion} />
        <FollowUpTree nodes={activeQuestion.followUps ?? []} />
        <div className="status-actions">
          {statuses.slice(1).map((status) => (
            <button
              key={status}
              className={state.status === status ? "selected" : ""}
              onClick={() => updateQuestion(activeQuestion.id, { status })}
            >
              {status === "known" && <CheckCircle2 size={17} />}
              {status === "weak" && <Target size={17} />}
              {status === "revision" && <Clock3 size={17} />}
              {status}
            </button>
          ))}
        </div>
        <div className="revision-actions">
          {revisionOptions.map((revision) => (
            <button
              key={revision}
              className={state.revision === revision ? "selected" : ""}
              onClick={() => updateQuestion(activeQuestion.id, { revision, status: "revision" })}
            >
              {revision}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function RevisionView({
  progress,
  updateQuestion,
  onOpenQuestion,
}: {
  progress: ProgressMap;
  updateQuestion: (id: string, patch: Partial<ReturnType<typeof getProgress>>) => void;
  onOpenQuestion: (question: Question) => void;
}) {
  const revisionQuestions = questions.filter((question) => {
    const state = getProgress(progress, question.id);
    return state.bookmarked || state.status === "weak" || state.status === "revision";
  });

  return (
    <div className="stack">
      <section className="hero-card compact">
        <div className="continue-icon">
          <Bell size={22} />
        </div>
        <div>
          <p className="eyebrow">In-app reminders</p>
          <h2>{revisionQuestions.length} questions queued for revision</h2>
          <p className="muted">Push notifications are intentionally left for a later phase. This MVP keeps reminders visible in the app.</p>
        </div>
      </section>

      {revisionQuestions.length === 0 && (
        <EmptyState title="No weak or bookmarked questions yet" body="Mark questions as weak, revision, or bookmarked during practice." />
      )}

      {revisionOptions.map((cadence) => {
        const list = revisionQuestions.filter((question) => getProgress(progress, question.id).revision === cadence);
        return (
          <section className="panel" key={cadence}>
            <div className="panel-head">
              <h3>{cadence}</h3>
              <span className="pill">{list.length}</span>
            </div>
            <div className="question-list">
              {(list.length ? list : revisionQuestions.filter((question) => !getProgress(progress, question.id).revision).slice(0, cadence === "today" ? 5 : 0)).map((question) => {
                const state = getProgress(progress, question.id);
                return (
                  <div className="question-card revision-card" key={question.id}>
                    <button onClick={() => onOpenQuestion(question)}>
                      <span className="pill">{topics.find((topic) => topic.id === question.topicId)?.title}</span>
                      <h4>{question.question}</h4>
                      <p>{state.status}{state.bookmarked ? " - bookmarked" : ""}</p>
                    </button>
                    <div className="mini-actions">
                      <button onClick={() => updateQuestion(question.id, { status: "known" })}>Known</button>
                      <button onClick={() => updateQuestion(question.id, { revision: cadence, status: "revision" })}>Set</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ToolsView({
  selectedTool,
  setSelectedTool,
  onOpenQuestion,
}: {
  selectedTool: ToolPage;
  setSelectedTool: (id: string) => void;
  onOpenQuestion: (question: Question) => void;
}) {
  return (
    <div className="learn-layout">
      <section className="horizontal-tabs" aria-label="Tools">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={selectedTool.id === tool.id ? "selected" : ""}
            onClick={() => setSelectedTool(tool.id)}
          >
            <Boxes size={14} />
            {tool.name}
          </button>
        ))}
      </section>
      <section className="topic-detail">
        <p className="eyebrow">{selectedTool.category}</p>
        <h2>{selectedTool.name}</h2>
        <AnswerBlock title="Purpose" body={selectedTool.purpose} />
        <ListBlock title="Internal flow" items={selectedTool.internalFlow} />
        <ListBlock title="Components" items={selectedTool.components} />
        <ArchitectureExplorer architecture={selectedTool.architecture} />
        <AnswerBlock title="Real-world usage" body={selectedTool.realWorldUsage} />
        {selectedTool.advantages && <ListBlock title="Advantages" items={selectedTool.advantages} />}
        {selectedTool.disadvantages && <ListBlock title="Disadvantages" items={selectedTool.disadvantages} />}
        <ListBlock title="Alternatives" items={selectedTool.alternatives} />
        {selectedTool.comparison && <ComparisonTable rows={selectedTool.comparison} />}
        <ListBlock title="Limitations" items={selectedTool.limitations} />
        <ListBlock title="Security notes" items={selectedTool.securityNotes} />
        {selectedTool.costImpact && <ListBlock title="Cost impact" items={selectedTool.costImpact} />}
        {selectedTool.productionIncidents && <ListBlock title="Production incidents" items={selectedTool.productionIncidents} />}
        {selectedTool.bestPractices && <ListBlock title="Best practices" items={selectedTool.bestPractices} />}
        <FollowUpTree nodes={selectedTool.followUps} />
      </section>
      <section className="panel">
        <div className="panel-head">
          <h3>Interview Q&A</h3>
          <span className="pill">{selectedTool.interviewQuestions.length}</span>
        </div>
        <div className="question-list">
          {selectedTool.interviewQuestions.map((question) => (
            <button key={question.id} className="question-card" onClick={() => onOpenQuestion(question)}>
              <div>
                <span className="pill">{question.difficulty}</span>
                <h4>{question.question}</h4>
                <p>{question.interviewVersion}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function IncidentsView({
  selectedIncident,
  setSelectedIncident,
}: {
  selectedIncident: IncidentPlaybook;
  setSelectedIncident: (id: string) => void;
}) {
  return (
    <div className="learn-layout">
      <section className="horizontal-tabs" aria-label="Incidents">
        {incidents.map((incident) => (
          <button
            key={incident.id}
            className={selectedIncident.id === incident.id ? "selected" : ""}
            onClick={() => setSelectedIncident(incident.id)}
          >
            <Wrench size={14} />
            {incident.title}
          </button>
        ))}
      </section>
      <section className="topic-detail">
        <p className="eyebrow">{selectedIncident.area}</p>
        <h2>{selectedIncident.title}</h2>
        <ListBlock title="Symptoms" items={selectedIncident.symptoms} />
        <ListBlock title="Likely root causes" items={selectedIncident.likelyRootCauses} />
        <ListBlock title="Investigation flow" items={selectedIncident.investigationFlow} />
        {selectedIncident.logsToCheck && <ListBlock title="Logs to check" items={selectedIncident.logsToCheck} />}
        {selectedIncident.commandsToRun && <CommandBlock title="Commands to run" items={selectedIncident.commandsToRun} />}
        {selectedIncident.rootCauseAnalysis && <ListBlock title="Root cause analysis" items={selectedIncident.rootCauseAnalysis} />}
        <ListBlock title="Fix" items={selectedIncident.fix} />
        <ListBlock title="Prevention" items={selectedIncident.prevention} />
        <AnswerBlock title="Interview answer" body={selectedIncident.interviewAnswer} />
        <FollowUpTree nodes={selectedIncident.followUps} />
      </section>
    </div>
  );
}

function CostView() {
  return (
    <div className="stack">
      <section className="hero-card compact">
        <div className="continue-icon">
          <CircleDollarSign size={22} />
        </div>
        <div>
          <p className="eyebrow">Cost optimization</p>
          <h2>Talk like an engineer who owns the bill</h2>
          <p className="muted">Use these modules to explain tradeoffs, rightsizing, autoscaling, and idle cleanup in interviews.</p>
        </div>
      </section>
      {costModules.map((module) => (
        <section className="panel" key={module.id}>
          <div className="panel-head">
            <div>
              <p className="eyebrow">{module.area}</p>
              <h3>{module.title}</h3>
            </div>
            <CircleDollarSign size={20} />
          </div>
          {module.costDrivers && <ListBlock title="Current cost drivers" items={module.costDrivers} />}
          <ListBlock title="Reduction strategies" items={module.strategies} />
          {module.savingsPotential && <AnswerBlock title="Savings potential" body={module.savingsPotential} />}
          <ListBlock title="Tradeoffs" items={module.tradeoffs} />
          <ListBlock title="Interview checklist" items={module.interviewChecklist} />
          {module.interviewAnswer && <AnswerBlock title="Interview-ready answer" body={module.interviewAnswer} />}
        </section>
      ))}
    </div>
  );
}

function CompanyPacksView({
  selectedPack,
  setSelectedPack,
}: {
  selectedPack: CompanyPack;
  setSelectedPack: (id: string) => void;
}) {
  return (
    <div className="learn-layout">
      <section className="horizontal-tabs" aria-label="Company packs">
        {companyPacks.map((pack) => (
          <button
            key={pack.id}
            className={selectedPack.id === pack.id ? "selected" : ""}
            onClick={() => setSelectedPack(pack.id)}
          >
            <Building2 size={14} />
            {pack.company}
          </button>
        ))}
      </section>
      <section className="topic-detail">
        <p className="eyebrow">MNC pack</p>
        <h2>{selectedPack.company}</h2>
        <AnswerBlock title="Interview style" body={selectedPack.style} />
        <AnswerBlock title="Expected difficulty" body={selectedPack.difficulty} />
        <ListBlock title="Frequently asked topics" items={selectedPack.frequentTopics} />
        <ListBlock title="Round-wise pattern" items={selectedPack.roundPattern} />
        <ListBlock title="Common scenario questions" items={selectedPack.scenarios} />
        <ListBlock title="Answer style guidance" items={selectedPack.answerGuidance} />
      </section>
    </div>
  );
}

function ProjectBuilderView({
  selectedProject,
  setSelectedProject,
}: {
  selectedProject: ProjectStory;
  setSelectedProject: (id: string) => void;
}) {
  return (
    <div className="learn-layout">
      <section className="horizontal-tabs" aria-label="Project stories">
        {projectStories.map((project) => (
          <button
            key={project.id}
            className={selectedProject.id === project.id ? "selected" : ""}
            onClick={() => setSelectedProject(project.id)}
          >
            <BriefcaseBusiness size={14} />
            {project.name}
          </button>
        ))}
      </section>
      <section className="topic-detail">
        <p className="eyebrow">{selectedProject.combination.join(" + ")}</p>
        <h2>{selectedProject.name}</h2>
        <AnswerBlock title="30-second intro" body={selectedProject.intro30} />
        <AnswerBlock title="2-minute explanation" body={selectedProject.explanation2Min} />
        <AnswerBlock title="Deep technical explanation" body={selectedProject.deepTechnical} />
        <ListBlock title="Responsibilities" items={selectedProject.responsibilities} />
        <ListBlock title="Challenges" items={selectedProject.challenges} />
        <ListBlock title="Solution" items={selectedProject.solution} />
        <ListBlock title="Impact" items={selectedProject.impact} />
      </section>
    </div>
  );
}

function KnowledgeGraphView({
  selectedNode,
  setSelectedNode,
  onNavigate,
}: {
  selectedNode: KnowledgeNode;
  setSelectedNode: (id: string) => void;
  onNavigate: (view: ViewId) => void;
}) {
  const linkedNodes = selectedNode.links
    .map((id) => knowledgeNodes.find((node) => node.id === id))
    .filter(Boolean) as KnowledgeNode[];

  return (
    <div className="learn-layout">
      <section className="horizontal-tabs graph-tabs" aria-label="Knowledge graph nodes">
        {knowledgeNodes.slice(0, 44).map((node) => (
          <button
            key={node.id}
            className={selectedNode.id === node.id ? "selected" : ""}
            onClick={() => setSelectedNode(node.id)}
          >
            <Network size={14} />
            {node.label}
          </button>
        ))}
      </section>
      <section className="topic-detail">
        <p className="eyebrow">{selectedNode.type}</p>
        <h2>{selectedNode.label}</h2>
        <AnswerBlock title="Why this matters" body={selectedNode.summary} />
        <div className="graph-map">
          <div className="graph-center">{selectedNode.label}</div>
          {linkedNodes.map((node) => (
            <button key={node.id} onClick={() => setSelectedNode(node.id)}>
              <span>{node.type}</span>
              {node.label}
            </button>
          ))}
        </div>
        <section className="quick-actions graph-actions">
          <button onClick={() => onNavigate("learn")}><BookOpen size={18} /> Learn</button>
          <button onClick={() => onNavigate("tools")}><Boxes size={18} /> Tools</button>
          <button onClick={() => onNavigate("incidents")}><Wrench size={18} /> Issues</button>
          <button onClick={() => onNavigate("cost")}><CircleDollarSign size={18} /> Cost</button>
        </section>
      </section>
    </div>
  );
}

function MockView({
  mock,
  setMock,
  progress,
  updateQuestion,
}: {
  mock: ReturnType<typeof createMockSession>;
  setMock: React.Dispatch<React.SetStateAction<ReturnType<typeof createMockSession>>>;
  progress: ProgressMap;
  updateQuestion: (id: string, patch: Partial<ReturnType<typeof getProgress>>) => void;
}) {
  const [spokenAnswer, setSpokenAnswer] = useState("");
  const currentQuestion = mock.questions[mock.index];
  const currentState = currentQuestion ? getProgress(progress, currentQuestion.id) : undefined;
  const done = mock.index >= mock.questions.length;
  const followUpChain = currentQuestion ? flattenFollowUps(currentQuestion.followUps ?? []) : [];
  const activeFollowUp = followUpChain[mock.followUpIndex];

  const next = (type: "answered" | "skipped") => {
    const rating = scoreAnswer(spokenAnswer);
    setMock((current) => ({
      ...current,
      revealed: false,
      index: current.index + 1,
      followUpIndex: 0,
      answerSamples: spokenAnswer.trim() ? [...current.answerSamples, spokenAnswer.trim()].slice(-5) : current.answerSamples,
      correctness: current.correctness + rating.correctness,
      depth: current.depth + rating.depth,
      confidence: current.confidence + rating.confidence,
      relevance: current.relevance + rating.relevance,
      followUpReadiness: current.followUpReadiness + rating.followUpReadiness,
      [type]: current[type] + 1,
    }));
    setSpokenAnswer("");
  };

  if (done) {
    const total = mock.questions.length;
    const max = Math.max(1, total * 5);
    const score = Math.round(((mock.correctness + mock.depth + mock.confidence + mock.relevance + mock.followUpReadiness) / (max * 5)) * 100);
    return (
      <div className="stack">
        <section className="hero-card">
          <div className="score-ring" style={{ "--score": `${score}%` } as React.CSSProperties}>
            <span>{score}</span>
            <small>score</small>
          </div>
          <div>
            <p className="eyebrow">Mock summary</p>
            <h2>Session complete</h2>
            <p className="muted">Answered {mock.answered}, skipped {mock.skipped}, bookmarked {mock.bookmarked}, weak {mock.weak}.</p>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h3>Interview readiness signals</h3>
            <Gauge size={20} />
          </div>
          <div className="score-grid">
            <Metric icon={CheckCircle2} label="Correctness" value={`${Math.round((mock.correctness / max) * 100)}%`} />
            <Metric icon={Layers3} label="Depth" value={`${Math.round((mock.depth / max) * 100)}%`} />
            <Metric icon={MessageSquare} label="Confidence" value={`${Math.round((mock.confidence / max) * 100)}%`} />
            <Metric icon={BriefcaseBusiness} label="Real-world" value={`${Math.round((mock.relevance / max) * 100)}%`} />
            <Metric icon={GitBranch} label="Follow-ups" value={`${Math.round((mock.followUpReadiness / max) * 100)}%`} />
          </div>
        </section>
        <section className="panel">
          <h3>Improvement suggestions</h3>
          <div className="bullet-list">
            {getMockSuggestions(mock).map((suggestion) => <p key={suggestion}>{suggestion}</p>)}
          </div>
        </section>
        <button className="primary-btn" onClick={() => setMock(createMockSession())}>Start new mock</button>
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="mock-card">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Question {mock.index + 1} of {mock.questions.length}</p>
            <h2>{activeFollowUp ? activeFollowUp.question : currentQuestion.question}</h2>
          </div>
          <span className="pill">{activeFollowUp?.level ?? currentQuestion.difficulty}</span>
        </div>
        <div className="progress-bar"><span style={{ width: `${((mock.index + 1) / mock.questions.length) * 100}%` }} /></div>
        <label className="mock-answer">
          <span>Your answer notes</span>
          <textarea
            value={spokenAnswer}
            onChange={(event) => setSpokenAnswer(event.target.value)}
            placeholder="Type the points you would say out loud..."
          />
        </label>
        {mock.revealed ? (
          <div className="answer-reveal">
            <AnswerBlock title="Interview answer" body={activeFollowUp?.sayIt ?? currentQuestion.interviewVersion} />
            <AnswerBlock title="Model depth" body={activeFollowUp?.answer ?? currentQuestion.seniorAnswer} />
          </div>
        ) : (
          <div className="try-box">
            <Sparkles size={24} />
            <p>Answer like a live interviewer is listening. Mention problem, flow, real incident, tradeoff, and impact.</p>
          </div>
        )}
      </section>

      <section className="mock-actions">
        <button onClick={() => setMock((current) => ({ ...current, revealed: true }))}>Reveal</button>
        <button
          onClick={() =>
            setMock((current) => ({
              ...current,
              followUpIndex: Math.min(current.followUpIndex + 1, Math.max(0, followUpChain.length - 1)),
              revealed: false,
            }))
          }
        >
          Follow-up
        </button>
        <button onClick={() => next("skipped")}>Skip</button>
        <button
          className={currentState?.bookmarked ? "selected" : ""}
          onClick={() => {
            updateQuestion(currentQuestion.id, { bookmarked: !currentState?.bookmarked });
            setMock((current) => ({ ...current, bookmarked: current.bookmarked + (currentState?.bookmarked ? -1 : 1) }));
          }}
        >
          Bookmark
        </button>
        <button
          onClick={() => {
            updateQuestion(currentQuestion.id, { status: "weak", revision: "tomorrow" });
            setMock((current) => ({ ...current, weak: current.weak + 1 }));
          }}
        >
          Weak
        </button>
        <button className="primary-btn" onClick={() => next("answered")}>Answered</button>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <div className="metric-card">
      <Icon size={18} />
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function AnswerBlock({ title, body }: { title: string; body: string }) {
  return (
    <article className="answer-block">
      <h4>{title}</h4>
      <p>{body}</p>
    </article>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="answer-block">
      <h4>{title}</h4>
      <div className="bullet-list">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </article>
  );
}

function CommandBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="answer-block">
      <h4>{title}</h4>
      <div className="command-list">
        {items.map((item) => (
          <code key={item}>{item}</code>
        ))}
      </div>
    </article>
  );
}

function ComparisonTable({
  rows,
}: {
  rows: Array<{ criteria: string; tool: string; alternative: string; guidance: string }>;
}) {
  return (
    <article className="answer-block comparison-block">
      <h4>Comparison table</h4>
      {rows.map((row) => (
        <div className="comparison-row" key={row.criteria}>
          <strong>{row.criteria}</strong>
          <p><span>Tool:</span> {row.tool}</p>
          <p><span>Alternative:</span> {row.alternative}</p>
          <p><span>Guidance:</span> {row.guidance}</p>
        </div>
      ))}
    </article>
  );
}

function KnowledgeLinks({ topic }: { topic: Topic }) {
  const groups = [
    ["Prerequisites", topic.prerequisites],
    ["Related topics", topic.relatedTopics],
    ["Next topics", topic.nextTopics],
    ["Tool links", topic.relatedTools],
    ["Incident links", topic.incidentLinks],
  ] as const;

  return (
    <article className="answer-block">
      <h4>Knowledge graph links</h4>
      <div className="link-groups">
        {groups.map(([label, values]) => (
          <div key={label}>
            <span>{label}</span>
            <div className="chip-wrap">
              {(values ?? []).map((value) => (
                <span className="topic-chip static-chip" key={value}>{value}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ArchitectureExplorer({ architecture }: { architecture: NonNullable<Topic["architecture"]> }) {
  return (
    <article className="architecture-card">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Architecture explorer</p>
          <h3>How it works in enterprise delivery</h3>
        </div>
        <Network size={20} />
      </div>
      <div className="architecture-flow">
        {["Source", "Identity", "Automation", "Artifact", "Environment", "Telemetry"].map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>
      <AnswerBlock title="Why it exists" body={architecture.whyExists} />
      <AnswerBlock title="Problem it solves" body={architecture.problemSolved} />
      <AnswerBlock title="Internal architecture" body={architecture.internalArchitecture} />
      <AnswerBlock title="Enterprise fit" body={architecture.enterpriseFit} />
      <ListBlock title="Alternatives" items={architecture.alternatives} />
      <ListBlock title="Use when" items={architecture.useWhen} />
      <ListBlock title="Avoid when" items={architecture.avoidWhen} />
    </article>
  );
}

function FollowUpTree({ nodes }: { nodes: FollowUpNode[] }) {
  if (!nodes.length) {
    return <EmptyState title="Follow-up chain coming soon" body="This item can still be practiced from the main answer blocks." />;
  }

  return (
    <article className="followup-card">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Follow-up engine</p>
          <h3>Drill deeper</h3>
        </div>
        <BrainCircuit size={20} />
      </div>
      <div className="followup-tree">
        {nodes.map((node) => (
          <FollowUpBranch key={node.id} node={node} />
        ))}
      </div>
    </article>
  );
}

function FollowUpBranch({ node }: { node: FollowUpNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cx("followup-branch", open && "open")}>
      <button onClick={() => setOpen((current) => !current)}>
        <span className={cx("level-badge", node.level)}>{node.level}</span>
        <strong>{node.question}</strong>
      </button>
      {open && (
        <div className="followup-answer">
          <AnswerBlock title="Answer" body={node.answer} />
          <AnswerBlock title="Interview speaking version" body={node.sayIt} />
          {node.children?.map((child) => (
            <FollowUpBranch key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="empty-state">
      <Layers3 size={28} />
      <h3>{title}</h3>
      <p>{body}</p>
    </section>
  );
}

function pageTitle(view: ViewId) {
  const names: Record<ViewId, string> = {
    home: "Dashboard",
    setup: "Setup",
    learn: "Learning",
    practice: "Practice",
    revise: "Revision",
    mock: "Mock interview",
    tools: "Tools",
    incidents: "Issues",
    cost: "Cost",
    packs: "Company packs",
    project: "Project story",
    graph: "Knowledge graph",
  };
  return names[view];
}

function getReadinessModel(progress: ProgressMap) {
  const total = questions.length;
  const questionScore = questions.reduce((sum, question) => {
    const state = getProgress(progress, question.id);
    if (state.status === "known") return sum + 1;
    if (state.status === "revision") return sum + 0.55;
    if (state.status === "weak") return sum + 0.2;
    return sum + (state.bookmarked ? 0.1 : 0);
  }, 0);
  const knownTopicIds = new Set(
    questions.filter((question) => getProgress(progress, question.id).status !== "new").map((question) => question.topicId)
  );
  const weakTopicIds = getWeakTopics(progress).map((topic) => topic.title);
  const questionCoverage = Math.round((questionScore / total) * 100);
  const topicCoverage = Math.round((knownTopicIds.size / topics.length) * 100);
  const incidentCoverage = Math.min(100, Math.round((knownTopicIds.size / Math.max(1, topics.length)) * 75 + (questionCoverage > 30 ? 25 : 0)));
  const toolCoverage = Math.min(100, Math.round((knownTopicIds.size / Math.max(1, tools.length)) * 100));
  const costCoverage = Math.min(100, Math.round((questionCoverage + topicCoverage) / 2));
  const securityCoverage = Math.min(100, Math.round((questionCoverage * 0.5) + (toolCoverage * 0.5)));
  const score = Math.max(8, Math.round((questionCoverage * 0.3) + (topicCoverage * 0.2) + (incidentCoverage * 0.15) + (toolCoverage * 0.15) + (costCoverage * 0.1) + (securityCoverage * 0.1)));
  const dailyPlan = [
    weakTopicIds[0] ? `Revise weak area: ${weakTopicIds[0]}` : "Practice Azure Pipelines troubleshooting",
    "Drill one tool page through architect-level follow-ups",
    "Study one production incident and speak the RCA out loud",
    "Review one cost optimization answer with tradeoffs",
  ];
  return { score, questionCoverage, topicCoverage, incidentCoverage, toolCoverage, costCoverage, securityCoverage, dailyPlan };
}

function getWeakTopics(progress: ProgressMap) {
  const weakCounts = topics.map((topic) => {
    const topicQuestions = questions.filter((question) => question.topicId === topic.id);
    const weak = topicQuestions.filter((question) => getProgress(progress, question.id).status === "weak").length;
    return { topic, score: weak * 10 + topic.priority + (topicQuestions.length ? 0 : 1) };
  });
  return weakCounts.sort((a, b) => b.score - a.score).slice(0, 5).map((item) => item.topic);
}

function getStudyPath(profile: Profile, progress: ProgressMap) {
  return [...topics].sort((a, b) => {
    const focusA = profile.focusTopics.includes(a.id) ? -4 : 0;
    const focusB = profile.focusTopics.includes(b.id) ? -4 : 0;
    const seniorA = profile.experience === "5+ yrs" && ["Security", "IaC", "Operations"].includes(a.category) ? -1 : 0;
    const seniorB = profile.experience === "5+ yrs" && ["Security", "IaC", "Operations"].includes(b.category) ? -1 : 0;
    const weakA = questions.some((question) => question.topicId === a.id && getProgress(progress, question.id).status === "weak") ? -2 : 0;
    const weakB = questions.some((question) => question.topicId === b.id && getProgress(progress, question.id).status === "weak") ? -2 : 0;
    return a.priority + focusA + seniorA + weakA - (b.priority + focusB + seniorB + weakB);
  });
}

function createMockSession() {
  const mockQuestions = [...questions]
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 8);
  return {
    questions: mockQuestions,
    index: 0,
    followUpIndex: 0,
    revealed: false,
    answered: 0,
    skipped: 0,
    bookmarked: 0,
    weak: 0,
    correctness: 0,
    depth: 0,
    confidence: 0,
    relevance: 0,
    followUpReadiness: 0,
    answerSamples: [] as string[],
  };
}

function flattenFollowUps(nodes: FollowUpNode[]) {
  const result: FollowUpNode[] = [];
  const visit = (items: FollowUpNode[]) => {
    items.forEach((item) => {
      result.push(item);
      if (item.children) visit(item.children);
    });
  };
  visit(nodes);
  return result;
}

function scoreAnswer(answer: string) {
  const normalized = answer.toLowerCase();
  const words = normalized.split(/\s+/).filter(Boolean).length;
  const hasFlow = /(flow|stage|job|agent|deploy|pipeline|state|artifact|trigger)/.test(normalized);
  const hasRealWorld = /(production|real|incident|team|enterprise|environment|rollback|monitor)/.test(normalized);
  const hasTradeoff = /(tradeoff|cost|security|scale|alternative|avoid|risk|least privilege)/.test(normalized);
  const hasConfidence = /(i would|i use|i check|first|then|because|impact)/.test(normalized);

  return {
    correctness: Math.min(5, words > 18 ? 3 + Number(hasFlow) + Number(hasTradeoff) : 1 + Number(hasFlow)),
    depth: Math.min(5, Math.floor(words / 18) + Number(hasFlow) + Number(hasTradeoff)),
    confidence: Math.min(5, 2 + Number(hasConfidence) + (words > 35 ? 1 : 0) + Number(hasTradeoff)),
    relevance: Math.min(5, 1 + Number(hasRealWorld) * 2 + Number(hasFlow) + Number(hasTradeoff)),
    followUpReadiness: Math.min(5, 1 + Number(hasTradeoff) + Number(hasRealWorld) + Number(words > 45) + Number(hasConfidence)),
  };
}

function getMockSuggestions(mock: ReturnType<typeof createMockSession>) {
  const answered = Math.max(1, mock.answered);
  const suggestions = [
    "Use a repeatable structure: problem, architecture, real example, failure mode, prevention, and impact.",
    "When you mention a tool, also mention the identity boundary and what can fail there.",
  ];
  if (mock.depth / answered < 3) suggestions.push("Add more internal working: triggers, agents, artifacts, approvals, logs, and state.");
  if (mock.relevance / answered < 3) suggestions.push("Anchor more answers in production scenarios such as failed deployments, rollback, or cost pressure.");
  if (mock.followUpReadiness / answered < 3) suggestions.push("Prepare one tradeoff and one alternative for each major Azure DevOps tool.");
  return suggestions;
}
