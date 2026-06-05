import { questions as seedQuestions, topics as seedTopics } from "./content";
import type {
  ArchitectureNote,
  CompanyPack,
  CostModule,
  FollowUpNode,
  IncidentPlaybook,
  KnowledgeNode,
  ProjectStory,
  Question,
  SecurityTopic,
  ToolPage,
} from "../types";

type ToolSeed = {
  id: string;
  name: string;
  category: string;
  topicId: string;
  before: string;
  primaryWorkflow: string;
  alternative: string;
  productionFailure: string;
};

const toolSeeds: ToolSeed[] = [
  { id: "azure-devops", name: "Azure DevOps", category: "Platform", topicId: "ado-overview", before: "teams used disconnected planning, Git, build servers, manual release checklists, and package shares", primaryWorkflow: "work item to repo change to pipeline run to artifact to governed deployment", alternative: "GitHub Enterprise with Actions", productionFailure: "project-level permissions were too broad and a pipeline could deploy into the wrong subscription" },
  { id: "azure-pipelines", name: "Azure Pipelines", category: "CI/CD", topicId: "pipelines", before: "builds depended on individual machines and releases were triggered manually", primaryWorkflow: "trigger, checkout, restore, build, test, scan, publish artifact, approve, deploy, validate", alternative: "GitHub Actions", productionFailure: "a deployment used a rebuilt artifact instead of the tested artifact and introduced a regression" },
  { id: "yaml-pipelines", name: "YAML Pipelines", category: "Pipeline as code", topicId: "yaml", before: "release behavior lived in UI screens with weak auditability", primaryWorkflow: "template expansion, parameter resolution, condition evaluation, stage orchestration, agent execution", alternative: "Classic Releases", productionFailure: "a template change was merged without validating all consuming services" },
  { id: "azure-repos", name: "Azure Repos", category: "Source control", topicId: "git-branching", before: "code reviews and branch controls varied team by team", primaryWorkflow: "feature branch, pull request, branch policy, validation build, review, squash or merge", alternative: "GitHub Enterprise", productionFailure: "main branch was updated without validation because a bypass permission was left enabled" },
  { id: "azure-artifacts", name: "Azure Artifacts", category: "Packages", topicId: "artifacts", before: "teams copied packages into file shares and lost version provenance", primaryWorkflow: "build package, assign immutable version, publish feed, restore in downstream build, retain by policy", alternative: "JFrog Artifactory", productionFailure: "package retention deleted a version still referenced by an old release" },
  { id: "agents", name: "Agents", category: "Execution", topicId: "agents", before: "build compute had no standard image, isolation, or capacity model", primaryWorkflow: "job request, pool selection, workspace preparation, task execution, log streaming, cleanup", alternative: "GitHub runners", productionFailure: "a self-hosted agent leaked a previous workspace secret into a later job" },
  { id: "service-connections", name: "Service Connections", category: "Identity", topicId: "service-connections", before: "pipelines used hard-coded credentials or shared owner-level service principals", primaryWorkflow: "pipeline authorization, identity exchange, scoped API call, audit, approval check", alternative: "OIDC workload federation in GitHub", productionFailure: "an expired client secret blocked a production hotfix deployment" },
  { id: "key-vault", name: "Key Vault", category: "Secrets", topicId: "key-vault", before: "secrets lived in variable groups, appsettings files, or engineer laptops", primaryWorkflow: "pipeline identity authenticates, reads selected secret, masks variable, injects into deployment boundary", alternative: "HashiCorp Vault", productionFailure: "a firewall rule blocked the agent from reading a rotated database password" },
  { id: "terraform", name: "Terraform", category: "IaC", topicId: "terraform", before: "cloud resources were created by hand and drift was discovered during outages", primaryWorkflow: "init backend, validate, plan, policy check, approval, apply, state lock release", alternative: "Bicep", productionFailure: "a wrong backend key caused a plan to recreate production resources" },
  { id: "docker", name: "Docker", category: "Containers", topicId: "docker", before: "runtime dependencies changed between developer laptops and servers", primaryWorkflow: "multi-stage build, scan, tag, push registry, run container with env and secret boundary", alternative: "Podman", productionFailure: "a mutable latest tag pulled a different image than the one tested" },
  { id: "kubernetes", name: "Kubernetes", category: "Orchestration", topicId: "kubernetes", before: "containers were placed manually and scaling/rollback depended on scripts", primaryWorkflow: "desired state submitted to API server, scheduler places pods, controllers reconcile, services expose traffic", alternative: "Azure Container Apps", productionFailure: "readiness probes were missing so bad pods received traffic" },
  { id: "aks", name: "AKS", category: "Azure Kubernetes", topicId: "aks", before: "teams had to operate Kubernetes control planes and Azure integration themselves", primaryWorkflow: "pipeline deploys manifests or Helm chart, AKS schedules pods on node pools, Azure Monitor validates health", alternative: "OpenShift", productionFailure: "node pool autoscaling lag caused pending pods during a traffic spike" },
  { id: "helm", name: "Helm", category: "Kubernetes packaging", topicId: "kubernetes", before: "teams copied raw YAML files with environment-specific edits", primaryWorkflow: "chart template, values merge, manifest render, install or upgrade, revision history, rollback", alternative: "Kustomize", productionFailure: "a values override removed resource limits for production pods" },
  { id: "argocd", name: "ArgoCD", category: "GitOps", topicId: "yaml", before: "cluster state drifted from pipeline scripts and manual kubectl changes", primaryWorkflow: "Git desired state, controller diff, sync, health assessment, drift reconciliation", alternative: "FluxCD", productionFailure: "auto-sync reverted an emergency manual patch because Git was not updated" },
  { id: "github-actions", name: "GitHub Actions", category: "CI/CD", topicId: "pipelines", before: "GitHub-hosted teams had to leave the repo for automation", primaryWorkflow: "event trigger, workflow job, runner execution, artifact publish, environment protection", alternative: "Azure Pipelines", productionFailure: "a pull_request_target workflow exposed secrets to untrusted code" },
  { id: "jenkins", name: "Jenkins", category: "CI/CD", topicId: "pipelines", before: "teams needed extensible automation before cloud-native CI/CD matured", primaryWorkflow: "controller schedules pipeline, agent runs stages, plugins integrate tools, artifacts archived", alternative: "Azure Pipelines", productionFailure: "plugin drift broke all builds after an untested controller upgrade" },
  { id: "prometheus", name: "Prometheus", category: "Monitoring", topicId: "monitoring", before: "teams lacked metric scraping and alert rules close to Kubernetes workloads", primaryWorkflow: "scrape targets, store time series, evaluate alert rules, send Alertmanager notifications", alternative: "Azure Monitor Metrics", productionFailure: "high-cardinality labels exploded storage and query cost" },
  { id: "grafana", name: "Grafana", category: "Visualization", topicId: "monitoring", before: "operational data lived in separate tools without shared dashboards", primaryWorkflow: "connect data sources, query metrics/logs, render dashboards, annotate releases, alert on panels", alternative: "Azure Managed Grafana or Workbooks", productionFailure: "dashboards showed averages that hid zone-specific latency regression" },
];

const scenarioSeeds = [
  "PR validation", "multi-stage release", "AKS blue-green deployment", "Helm rollback", "Terraform drift correction",
  "self-hosted agent scaling", "service connection hardening", "Key Vault secret rotation", "artifact promotion",
  "container image scanning", "branch policy governance", "log retention tuning", "SLO alert design",
  "canary deployment", "production hotfix", "platform template rollout", "migration from Jenkins",
  "private AKS deployment", "ACR image lifecycle", "pipeline cost reduction", "managed identity rollout",
  "namespace RBAC model", "monitoring dashboard", "incident postmortem", "release approval design",
  "IaC module standardization", "dependency cache strategy", "GitOps drift handling", "node pool upgrade",
  "zero-downtime release",
];

const incidentTemplates = [
  "Agent Offline", "Pipeline Failure", "Artifact Missing", "PAT Expired", "Service Connection Failure",
  "Terraform State Corruption", "AKS CrashLoopBackOff", "ImagePullBackOff", "DNS Issues", "Helm Failure",
  "Pod Scheduling Failure", "OOMKilled", "Node Not Ready", "Key Vault Forbidden", "ACR Pull Unauthorized",
  "Approval Gate Stuck", "Variable Group Missing", "YAML Template Regression", "Branch Policy Bypass",
  "Terraform Lock Stuck", "Ingress 502", "Readiness Probe Failure", "Liveness Probe Restart Loop",
  "Azure Monitor Cost Spike", "Log Analytics Query Timeout",
];

const costSeeds = [
  "Azure VM", "AKS", "Storage", "Azure Monitor", "Application Insights", "Azure DevOps Agents",
  "Container Registry", "Log Analytics", "Managed Disks", "Load Balancers", "Public IPs", "Bandwidth",
  "Key Vault operations", "Build minutes", "Self-hosted runner pools", "Kubernetes node pools",
  "Container image retention", "Backup retention", "Non-production environments", "Grafana dashboards",
];

const securitySeeds = [
  "least privilege service connections", "workload identity federation", "Key Vault RBAC", "secret masking",
  "branch protection", "environment approvals", "agent pool isolation", "container image scanning",
  "Terraform state protection", "AKS namespace RBAC", "network policies", "private endpoints",
  "PAT governance", "audit logging", "dependency scanning", "SAST gates", "IaC policy checks",
  "supply-chain provenance", "non-root containers", "production break-glass access",
];

function seniorAnswer(subject: string, context: string) {
  return `In production I explain ${subject} as an operating capability, not as a vocabulary item. The interviewer should hear five things: the trigger, the identity boundary, the execution/runtime layer, the artifact or state being moved, and the evidence that the change is safe. For ${context}, I would describe how the work starts, where it runs, how secrets are protected, how the output is promoted, what can fail, and how I prove recovery. That is how a senior engineer shows ownership instead of reciting a tool definition.`;
}

function learningPack(subject: string, scenario: string) {
  return {
    internalWorking: `${subject} works by converting an engineering intent into controlled platform actions. In a typical enterprise flow, a Git event or manual release request triggers automation, the platform resolves variables and templates, a scoped identity authenticates to the target, an agent or controller performs the work, and logs, artifacts, state, approvals, and telemetry are recorded. The critical internal detail is the boundary between the orchestration layer and the target environment: most real failures happen at identity, network, artifact version, state, or runtime health boundaries.`,
    architectureDiagram: `Diagram this as five connected lanes: Developer/Repo -> Control Plane -> Execution Layer -> Target Environment -> Observability. The control plane contains policies, approvals, templates, service connections, and environment checks. The execution layer contains hosted agents, self-hosted agents, runners, or controllers. The target environment contains Azure resources, AKS namespaces, registries, Key Vault, and monitoring. Draw identity arrows separately because identity is the path attackers and misconfigurations usually exploit.`,
    productionUsage: `A realistic production usage for ${scenario} is a platform team standardizing delivery across multiple application squads. The team defines reusable templates, isolates dev/test/prod identities, publishes immutable artifacts, promotes the same build through environments, and validates the release using Kubernetes events, Azure Activity Log, deployment annotations, and application telemetry before closing the change.`,
    securityConsiderations: [
      "Use least-privilege service connections or workload identity federation instead of shared owner-level credentials.",
      "Separate dev, test, and production permissions so a non-production pipeline cannot mutate production resources.",
      "Keep secrets in Key Vault or an approved secret store; never echo them in logs or bake them into images.",
      "Protect templates and deployment branches with required reviewers because a template change can affect many services.",
      "Audit who can bypass approvals, administer agent pools, modify environments, and create service connections.",
    ],
    costConsiderations: [
      "Avoid rebuilding artifacts for every environment; build once and promote the same artifact.",
      "Right-size self-hosted agents and scale them down when idle.",
      "Tune log retention and telemetry volume because verbose build logs and high-cardinality metrics can become expensive.",
      "Use caching carefully: it reduces build minutes but can hide dependency drift if cache keys are weak.",
      "For AKS workloads, review requests/limits, node pool size, autoscaling, and non-production shutdown schedules.",
    ],
    commonMistakes: [
      "Explaining only the definition and not the delivery workflow.",
      "Using one high-privilege service connection for every environment.",
      "Deploying a different artifact than the one tested in CI.",
      "Rerunning failed jobs before reading the first failing log line.",
      "Ignoring rollback, observability, and ownership when describing a production release.",
    ],
    troubleshootingGuide: [
      "Start with blast radius: one service, one environment, one agent pool, or all pipelines.",
      "Compare the failed run with the last successful run and identify what changed.",
      "Check identity first: service connection, RBAC, token expiry, environment authorization, and Key Vault access.",
      "Validate artifact or state: image tag, package version, Terraform backend key, Helm revision, or pipeline artifact name.",
      "Check target health using Azure Activity Log, Kubernetes events, application logs, and deployment telemetry.",
      "Fix the immediate issue, then add a prevention control such as a template test, expiry alert, policy, or runbook update.",
    ],
    realIncidentExample: `A common incident for ${subject} is a production deployment blocked by an expired credential or wrong artifact reference. The release team sees a pipeline failure, but the root cause is not the YAML syntax; it is an identity or provenance failure. The senior response is to identify the identity used by the failed task, verify target RBAC, confirm the artifact version, restore the least-privilege access, redeploy the known-good artifact, and create an alert or policy so the same failure does not recur.`,
    commandsAndLogs: [
      "az account show",
      "az role assignment list --assignee <principal-id> --scope <scope>",
      "az devops configure --list",
      "kubectl get events -n <namespace> --sort-by=.lastTimestamp",
      "kubectl describe pod <pod> -n <namespace>",
      "kubectl logs deploy/<deployment> -n <namespace> --previous",
      "helm history <release> -n <namespace>",
      "terraform plan -refresh-only",
      "Check Azure Activity Log, pipeline task logs, agent diagnostic logs, Key Vault audit logs, and Application Insights failures.",
    ],
    advancedDiscussion: `At advanced level, connect ${subject} to platform scalability. Discuss template versioning, policy-as-code, environment checks, artifact provenance, progressive delivery, secret rotation, automated rollback signals, and how you prevent a platform change from breaking every team at once. Use rollout rings: pilot project, low-risk service, broad adoption, then enforcement.`,
    architectDiscussion: `At architect level, ${subject} is part of the delivery control plane. The design question is not only which tool to use, but how to balance developer speed, security, auditability, reliability, and cost. I would define ownership boundaries, identity model, golden templates, observability standards, incident response, cost guardrails, and migration path from legacy pipelines or manual processes.`,
  };
}

function makeDeepFollowUpTree(seed: string, subject: string, depth = 22): FollowUpNode[] {
  const cleanSubject = subject
    .replace(/\?$/g, "")
    .replace(/^what is\s+/i, "")
    .replace(/^explain\s+/i, "")
    .trim();
  const levels: FollowUpNode["level"][] = ["basic", "intermediate", "advanced", "senior", "architect"];
  const prompts = [
    `What is ${cleanSubject} in practical terms?`,
    `Why does ${cleanSubject} exist instead of doing this manually?`,
    `What business risk does ${cleanSubject} reduce?`,
    `Where does ${cleanSubject} sit in the delivery architecture?`,
    `What are the main components involved?`,
    `What identity or permission boundary is used?`,
    `How does this scale across many teams?`,
    `How do templates or standards apply here?`,
    `How do approvals and governance work?`,
    `What security control would you enforce first?`,
    `What cost problem can appear at scale?`,
    `What fails most often in production?`,
    `Which logs or events would you check first?`,
    `Which command would validate the hypothesis?`,
    `How would you isolate root cause quickly?`,
    `How would you roll back safely?`,
    `How would you design canary or blue-green around it?`,
    `How would you prevent repeat incidents?`,
    `Which alternative tool would you compare it with?`,
    `What tradeoff would you explain to an architect?`,
    `How would you mentor a junior engineer on this?`,
    `What final answer would you give in an interview?`,
  ];

  let child: FollowUpNode | undefined;
  for (let index = Math.min(depth, prompts.length) - 1; index >= 0; index -= 1) {
    child = {
      id: `${seed}-deep-${index}`,
      level: levels[Math.min(levels.length - 1, Math.floor(index / 4))],
      question: prompts[index],
      answer: `${seniorAnswer(cleanSubject, prompts[index].toLowerCase())} ${learningPack(cleanSubject, prompts[index]).internalWorking}`,
      sayIt: `Interview speaking version: I would answer ${cleanSubject} by first naming the production problem, then walking through trigger -> identity -> execution -> artifact/state -> target health. I would finish with one security control, one failure mode, one troubleshooting signal, and the business impact.`,
      children: child ? [child] : undefined,
    };
  }
  return child ? [child] : [];
}

function architectureFor(seed: ToolSeed): ArchitectureNote {
  return {
    whyExists: `${seed.name} exists because ${seed.before}. It gives teams a controlled way to move from intent to audited engineering action.`,
    problemSolved: `It solves fragmented ownership, manual handoffs, weak audit trails, and inconsistent production behavior around ${seed.primaryWorkflow}.`,
    internalArchitecture: `${seed.name} works through configuration, identity, runtime execution, state or artifact handling, policy controls, logs, and feedback. The important internal boundary is not the UI; it is how identity, worker execution, and environment authorization are connected.`,
    enterpriseFit: `In an enterprise setup, ${seed.name} is owned through platform standards: reusable templates, scoped identities, environment separation, telemetry, retention policy, and documented break-glass support.`,
    alternatives: [seed.alternative, "GitLab", "Jenkins", "custom scripts"],
    useWhen: [`You need repeatable ${seed.primaryWorkflow}`, "auditability matters", "multiple teams need a common operating model", "security and cost need governance"],
    avoidWhen: ["a simpler managed service solves the problem", "ownership is unclear", "teams cannot operate the failure modes", "the tool would add process without reducing risk"],
    endToEndWorkflow: [
      `Engineer changes code or configuration for ${seed.name}.`,
      "Policy validates branch, identity, or environment boundary.",
      `The platform executes ${seed.primaryWorkflow}.`,
      "Artifacts, state, logs, and approvals are recorded.",
      "Deployment health is validated with telemetry and rollback criteria.",
    ],
    securityConsiderations: ["least privilege", "environment separation", "secret masking", "audit logging", "short-lived or federated credentials"],
    costConsiderations: ["right-size execution resources", "clean up idle resources", "control retention", "avoid duplicate builds", "watch high-cardinality logs or metrics"],
    commonMistakes: ["using owner-level credentials", "rebuilding artifacts per environment", "missing rollback criteria", "ignoring retention", "not testing template changes across consumers"],
    troubleshootingApproach: ["start with the last known good run", "identify the identity being used", "check logs before rerunning", "compare artifact versions", "validate target health"],
    productionIncidentExamples: [seed.productionFailure, `A change to ${seed.name} standards affected multiple teams because it was not rolled out through a pilot ring.`],
    architectDiscussion: `At architect level I discuss ${seed.name} as a socio-technical control: it must improve developer speed while enforcing identity, audit, reliability, and cost boundaries.`,
  };
}

export const enrichedTopics = seedTopics.map((topic) => {
  const seed = toolSeeds.find((item) => item.topicId === topic.id) ?? toolSeeds[0];
  const architecture = architectureFor(seed);
  return {
    ...topic,
    definition: `${topic.title} is the production capability used to support ${seed.primaryWorkflow} with traceability, repeatability, and operational control.`,
    whyExists: architecture.whyExists,
    businessProblem: architecture.problemSolved,
    interviewAnswer: seniorAnswer(topic.title, "an Azure DevOps engineer interview"),
    deepAnswer: `${architecture.internalArchitecture} ${architecture.enterpriseFit}`,
    useCase: `A platform team uses ${topic.title} to standardize ${seed.primaryWorkflow} across dev, QA, staging, and production while preserving audit history and rollback evidence.`,
    architecture,
    endToEndWorkflow: architecture.endToEndWorkflow,
    securityConsiderations: architecture.securityConsiderations,
    costConsiderations: architecture.costConsiderations,
    commonMistakes: architecture.commonMistakes,
    troubleshootingApproach: architecture.troubleshootingApproach,
    productionIncidentExamples: architecture.productionIncidentExamples,
    architectDiscussion: architecture.architectDiscussion,
    followUps: makeDeepFollowUpTree(`topic-${topic.id}`, topic.title, 22).map((node) => node.question),
    prerequisites: topic.id === "aks" ? ["docker", "kubernetes", "service-connections"] : ["cicd", "git-branching", "pipelines"],
    relatedTopics: seedTopics.filter((candidate) => candidate.id !== topic.id && candidate.category === topic.category).slice(0, 4).map((candidate) => candidate.id),
    relatedTools: toolSeeds.filter((item) => item.category === seed.category).slice(0, 4).map((item) => item.id),
    incidentLinks: incidentTemplates.slice(0, 5).map((name) => name.toLowerCase().replaceAll(" ", "-")),
    nextTopics: seedTopics.filter((candidate) => candidate.priority >= topic.priority).slice(0, 3).map((candidate) => candidate.id),
  };
});

function makeQuestion(id: string, topicId: string, subject: string, scenario: string, index: number): Question {
  const difficulty = index % 5 === 0 ? "senior" : index % 3 === 0 ? "intermediate" : "basic";
  const question = index % 4 === 0
    ? `How would you troubleshoot ${scenario} involving ${subject}?`
    : index % 4 === 1
      ? `Explain ${subject} for ${scenario} in a real enterprise project.`
      : index % 4 === 2
        ? `What are the security and cost tradeoffs of ${subject} during ${scenario}?`
        : `How would you design ${scenario} using ${subject}?`;
  const pack = learningPack(subject, scenario);
  return {
    id,
    topicId,
    difficulty,
    question,
    shortAnswer: `Use ${subject} to solve ${scenario} with controlled identity, repeatable workflow, and measurable release health.`,
    detailedAnswer: `${seniorAnswer(subject, scenario)} ${pack.internalWorking}`,
    seniorAnswer: `For ${scenario}, I would define the target architecture, choose the identity boundary, make artifact or state movement explicit, add approvals only where risk changes, and validate the outcome with logs and telemetry. I would also document rollback and cost controls because interviewers expect ownership beyond the happy path.`,
    interviewVersion: `I would say: in a real project I used ${subject} for ${scenario} by standardizing the workflow, securing the credentials, tracking the artifact or state, and validating production health before calling the release successful.`,
    ...pack,
    followUps: makeDeepFollowUpTree(id, `${subject} during ${scenario}`, 22),
  };
}

const generatedQuestions = toolSeeds.flatMap((tool, toolIndex) =>
  scenarioSeeds.flatMap((scenario, scenarioIndex) => [
    makeQuestion(`q-${tool.id}-${scenarioIndex}-a`, tool.topicId, tool.name, scenario, toolIndex + scenarioIndex),
    makeQuestion(`q-${tool.id}-${scenarioIndex}-b`, tool.topicId, tool.name, `${scenario} failure`, toolIndex + scenarioIndex + 1),
  ])
);

export const enrichedQuestions: Question[] = [
  ...seedQuestions.map((question) => ({
    ...question,
    detailedAnswer: `${seniorAnswer(question.question, "core Azure DevOps fundamentals")} ${learningPack(question.question, "core Azure DevOps fundamentals").internalWorking}`,
    seniorAnswer: seniorAnswer(question.question, "senior-level production ownership"),
    interviewVersion: `I would answer this with a production example first, then describe the workflow, security boundary, failure mode, and measurable impact.`,
    ...learningPack(question.question, "core Azure DevOps fundamentals"),
    followUps: makeDeepFollowUpTree(question.id, question.question, 22),
  })),
  ...generatedQuestions,
];

function makeTool(seed: ToolSeed): ToolPage {
  const architecture = architectureFor(seed);
  return {
    id: seed.id,
    name: seed.name,
    category: seed.category,
    topicId: seed.topicId,
    purpose: `${seed.name} provides a production-grade way to handle ${seed.primaryWorkflow}.`,
    internalFlow: architecture.endToEndWorkflow ?? [],
    components: ["configuration", "identity", "execution runtime", "artifact or state store", "policy boundary", "logs and audit", "telemetry feedback"],
    architecture,
    alternatives: architecture.alternatives,
    realWorldUsage: `In enterprise delivery I use ${seed.name} where a team needs ${seed.primaryWorkflow} with predictable ownership, auditability, and rollback evidence.`,
    limitations: ["requires standards and ownership", "can hide risk if permissions are too broad", "can become expensive without retention and cleanup", "needs testing before platform-wide template changes"],
    advantages: ["repeatability", "auditability", "team-scale standardization", "better incident evidence", "clearer separation of duties"],
    disadvantages: ["platform maintenance overhead", "learning curve", "policy can slow teams if badly designed", "misconfiguration can affect many teams"],
    comparison: [
      { criteria: "Governance", tool: `${seed.name} supports controlled enterprise rollout.`, alternative: `${seed.alternative} may be better when the organization is already standardized there.`, guidance: "Choose based on existing source platform, identity model, and audit needs." },
      { criteria: "Operations", tool: `${seed.name} fits Azure-heavy delivery well.`, alternative: "Alternatives may offer broader plugin ecosystems or GitOps-native behavior.", guidance: "Prefer the tool your platform team can operate during incidents." },
    ],
    costImpact: architecture.costConsiderations ?? [],
    securityNotes: architecture.securityConsiderations ?? [],
    productionIncidents: architecture.productionIncidentExamples ?? [],
    bestPractices: ["use least privilege", "template repeatable patterns", "test changes in pilot projects", "monitor cost and retention", "document rollback"],
    interviewQuestions: scenarioSeeds.slice(0, 12).map((scenario, index) => makeQuestion(`tool-${seed.id}-${index}`, seed.topicId, seed.name, scenario, index)),
    followUps: makeDeepFollowUpTree(`tool-${seed.id}`, seed.name, 22),
  };
}

export const tools: ToolPage[] = toolSeeds.map(makeTool);

function makeIncident(title: string, tool: ToolSeed, index: number): IncidentPlaybook {
  const id = `${title.toLowerCase().replaceAll(" ", "-")}-${tool.id}`;
  return {
    id,
    title: `${title} - ${tool.name}`,
    area: tool.category,
    symptoms: [`${tool.name} workflow fails during ${tool.primaryWorkflow}`, "pipeline or platform signal turns red", "release owner cannot prove whether the target is healthy"],
    likelyRootCauses: ["permission or identity drift", "network or DNS reachability", "wrong artifact/version/state", "resource pressure", "recent template or configuration change"],
    investigationFlow: ["confirm blast radius", "compare last known good run", "identify identity and target", "read logs before rerun", "validate artifact/state and target telemetry"],
    logsToCheck: ["pipeline task logs", "agent diagnostic logs", "Azure Activity Log", "Kubernetes events where applicable", "application telemetry and release annotations"],
    commandsToRun: [
      "az account show",
      "az devops configure --list",
      "kubectl describe pod <pod> -n <namespace>",
      "kubectl get events -n <namespace> --sort-by=.lastTimestamp",
      "terraform plan -refresh-only",
    ],
    rootCauseAnalysis: [`For ${title}, I separate trigger failure, execution failure, identity failure, target failure, and validation failure.`, "I do not close RCA until prevention is attached to an owner and signal."],
    fix: ["restore least required access", "deploy the correct immutable artifact", "rollback unsafe release", "patch configuration", "scale or repair the runtime"],
    prevention: ["branch and environment policy", "template tests", "credential expiry monitoring", "artifact retention", "runbook with clear ownership"],
    interviewAnswer: `For ${title} in ${tool.name}, I would start with scope and last known good state, then check logs, identity, artifact or state, network, and target health. I would fix the immediate issue and add a prevention control so the same failure does not return.`,
    followUps: makeDeepFollowUpTree(`incident-${id}`, `${title} in ${tool.name}`, 22),
  };
}

export const incidents: IncidentPlaybook[] = toolSeeds.flatMap((tool) =>
  incidentTemplates.slice(0, 6).map((title, index) => makeIncident(title, tool, index))
).slice(0, 108);

export const troubleshootingScenarios: IncidentPlaybook[] = toolSeeds.flatMap((tool) =>
  incidentTemplates.slice(6, 12).map((title, index) => makeIncident(title, tool, index))
).slice(0, 108);

export const costModules: CostModule[] = costSeeds.flatMap((service, serviceIndex) =>
  ["baseline review", "rightsizing", "retention cleanup"].map((theme, themeIndex) => ({
    id: `cost-${service.toLowerCase().replaceAll(" ", "-")}-${themeIndex}`,
    title: `${service} ${theme}`,
    area: service,
    costDrivers: ["compute hours", "storage retention", "data ingestion", "idle resources", "over-provisioned capacity"],
    strategies: [
      `Tag ${service} ownership and environment so idle cleanup is safe.`,
      `Right-size ${service} based on actual utilization, not initial guesswork.`,
      `Set retention and lifecycle policy for ${service} data.`,
      "Use autoscaling or scheduled shutdown for non-production usage.",
      "Create budget alerts before optimization becomes an emergency.",
    ],
    savingsPotential: serviceIndex % 3 === 0 ? "High when non-production resources are always on." : "Medium when retention and sizing are already partially controlled.",
    tradeoffs: ["lower cost can reduce burst capacity", "short retention can weaken RCA", "spot capacity needs interruption handling", "aggressive cleanup needs ownership tags"],
    interviewChecklist: ["cost driver", "optimization", "tradeoff", "guardrail", "measurement"],
    interviewAnswer: `For ${service}, I would first identify cost drivers, then right-size or autoscale, reduce idle usage, tune retention, and set budgets. I would explain the tradeoff clearly because cost optimization without reliability boundaries creates incidents.`,
  }))
).slice(0, 60);

export const securityTopics: SecurityTopic[] = securitySeeds.flatMap((seed, index) =>
  ["design", "operation", "incident"].map((mode, modeIndex) => ({
    id: `sec-${index}-${modeIndex}`,
    title: `${seed} ${mode}`,
    area: mode,
    risk: `Weak ${seed} can expose production credentials, allow unauthorized deployment, or hide malicious changes in the delivery path.`,
    controls: ["least privilege", "audit logging", "environment separation", "approval for high-risk changes", "regular access review"],
    interviewAnswer: `For ${seed}, I would explain the risk, the control, how it is enforced in pipelines or cloud RBAC, and how I audit it after deployment.`,
  }))
).slice(0, 60);

export const architectureExplanations: ArchitectureNote[] = toolSeeds.flatMap((seed) =>
  ["team scale", "enterprise governance", "incident recovery"].map((mode) => ({
    ...architectureFor(seed),
    whyExists: `${seed.name} architecture for ${mode} exists to keep ${seed.primaryWorkflow} reliable when many teams and environments are involved.`,
  }))
).slice(0, 54);

export const companyPacks: CompanyPack[] = [
  ["Infosys", "client communication, fundamentals, and scenario clarity"],
  ["TCS", "process discipline, support scenarios, and cloud basics"],
  ["Accenture", "migration, enterprise governance, and stakeholder-ready answers"],
  ["Cognizant", "managed services, incident handling, and practical CI/CD"],
  ["Capgemini", "cloud transformation, DevOps maturity, and tool comparisons"],
  ["IBM", "architecture depth, security, hybrid cloud, and operations"],
  ["HCL", "platform operations, automation, and troubleshooting"],
  ["Wipro", "cost-aware cloud operations and production support"],
  ["LTIMindtree", "Azure migration, SRE thinking, and IaC"],
  ["Product Companies", "scale, ownership, system design, and incident depth"],
].map(([company, style], index) => ({
  id: company.toLowerCase().replaceAll(" ", "-"),
  company,
  style: `Expect ${style}. Answers should be concise, production-backed, and structured around ownership.`,
  frequentTopics: ["Azure Pipelines", "YAML templates", "Service Connections", "Terraform", "AKS", "Monitoring", "Troubleshooting", "Cost optimization"],
  roundPattern: ["fundamentals screen", "hands-on troubleshooting", "project deep dive", "architecture and ownership discussion"],
  difficulty: index > 7 ? "Senior to architect" : index > 3 ? "Intermediate to senior" : "Fundamental to intermediate with scenarios",
  scenarios: ["pipeline failed before production", "AKS workload unhealthy", "Terraform drift detected", "reduce cloud bill", "secure deployment identity"],
  answerGuidance: ["start with the production problem", "state the workflow", "name the control", "explain troubleshooting", "finish with prevention and impact"],
}));

export const projectStories: ProjectStory[] = [
  {
    id: "ado-aks",
    name: "Azure DevOps + AKS delivery platform",
    combination: ["Azure DevOps", "AKS", "Docker", "Helm", "Monitoring"],
    intro30: "I built a governed CI/CD platform where Azure Pipelines built immutable container images, pushed them to ACR, and deployed Helm releases to AKS with approvals and health validation.",
    explanation2Min: "The platform standardized delivery across microservices. Pull requests ran tests, scans, and template validation. Main branch produced a single artifact promoted through environments. AKS namespaces, scoped service connections, Key Vault integration, and release dashboards made deployments traceable.",
    deepTechnical: "YAML templates separated build, scan, publish, and deploy. Images were tagged by build and commit. Helm values were environment-specific. Rollout validation checked Kubernetes status, pod events, and application telemetry. Rollback used Helm revision and the last stable image.",
    responsibilities: ["designed YAML templates", "configured ACR and AKS deployment", "hardened service connections", "built monitoring and rollback runbooks"],
    challenges: ["image tag mismatch", "namespace RBAC", "probe failures", "slow builds", "unclear rollback criteria"],
    solution: ["immutable artifacts", "least-privilege identities", "probe tuning", "cache strategy", "deployment markers"],
    impact: ["reduced release time", "improved traceability", "reduced failed deployments", "created reusable platform standards"],
  },
  {
    id: "terraform-azure",
    name: "Terraform + Azure governance",
    combination: ["Terraform", "Azure", "Azure Pipelines", "Policy", "Cost"],
    intro30: "I replaced manual Azure provisioning with Terraform modules and pipeline-based plan/apply gates using remote state, locking, and approval workflows.",
    explanation2Min: "The project created repeatable modules for networking, compute, Key Vault, monitoring, and app services. PRs produced plans, production applies required approval, and drift was handled through documented import or state movement procedures.",
    deepTechnical: "State used separate backend keys per environment. Pipeline identities were scoped per subscription or resource group. Plans were reviewed for destructive changes. Cost tags and policy checks were enforced before apply.",
    responsibilities: ["module design", "state backend", "pipeline governance", "drift runbook", "cost tagging"],
    challenges: ["existing resources", "state ownership", "destructive plans", "provider upgrades"],
    solution: ["terraform import", "state locking", "plan gates", "module versioning"],
    impact: ["lower drift", "faster environment creation", "better audit", "fewer portal changes"],
  },
];

export const knowledgeNodes: KnowledgeNode[] = [
  ...enrichedTopics.map((topic) => ({
    id: topic.id,
    label: topic.title,
    type: "topic" as const,
    summary: topic.interviewAnswer,
    links: [...(topic.prerequisites ?? []), ...(topic.relatedTopics ?? []), ...(topic.relatedTools ?? []), ...(topic.incidentLinks ?? [])],
  })),
  ...tools.map((tool) => ({ id: tool.id, label: tool.name, type: "tool" as const, summary: tool.purpose, links: [tool.topicId ?? "", ...(tool.productionIncidents ?? []).slice(0, 2)].filter(Boolean) })),
  ...incidents.map((incident) => ({ id: incident.id, label: incident.title, type: "incident" as const, summary: incident.interviewAnswer, links: tools.filter((tool) => incident.title.includes(tool.name)).map((tool) => tool.id).slice(0, 2) })),
  ...costModules.map((cost) => ({ id: cost.id, label: cost.title, type: "cost" as const, summary: cost.interviewAnswer ?? cost.strategies[0], links: tools.filter((tool) => cost.area.includes(tool.name)).map((tool) => tool.id).slice(0, 2) })),
  ...enrichedQuestions.slice(0, 160).map((question) => ({ id: question.id, label: question.question, type: "question" as const, summary: question.interviewVersion, links: [question.topicId] })),
];

export const contentStats = {
  questions: enrichedQuestions.length,
  productionIncidents: incidents.length,
  troubleshootingScenarios: troubleshootingScenarios.length,
  architectureExplanations: architectureExplanations.length,
  costTopics: costModules.length,
  securityTopics: securityTopics.length,
};
