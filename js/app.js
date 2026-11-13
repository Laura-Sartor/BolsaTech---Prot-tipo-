"use strict";
/* ========= Utilitários ========= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const toDate = v => (v instanceof Date ? v : new Date(v));
const fmtDate = v => { const d = toDate(v); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
const fmtDateTime = v => { const d = toDate(v); return `${fmtDate(d)} às ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fmtSize = b => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1).replace(".", ",")} MB`);
const wait = ms => new Promise(r => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9);
const extOf = n => (String(n).split(".").pop() || "").toLowerCase();
const sod = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const TODAY = sod(new Date());
const addDays = (n, base = TODAY) => { const d = new Date(base); d.setDate(d.getDate() + n); return d; };
const dayDiff = d => Math.round((sod(toDate(d)) - TODAY) / 86400000);
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
const MAX_SIZE = 5 * 1024 * 1024;

/* ========= Ícones ========= */
const ICONS = {
  check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
  x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  alert: '<path d="M12 3.8l9 15.7H3z"/><path d="M12 10v4.2M12 17v.2"/>',
  circle: '<circle cx="12" cy="12" r="7.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  upload: '<path d="M12 15.5V4M7 8.5l5-4.5 5 4.5"/><path d="M4 15v4a1 1 0 001 1h14a1 1 0 001-1v-4"/>',
  camera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h4"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  home: '<path d="M4 11l8-7 8 7v9h-5.5v-6h-5v6H4z"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  layers: '<path d="M12 4l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4M4 16l8 4 8-4"/>',
  logout: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 6.1A9.4 9.4 0 0112 6c6 0 9.5 6 9.5 6a16 16 0 01-3.1 3.8M6.6 6.9C4 8.6 2.5 12 2.5 12S6 18 12 18c1.6 0 3-.4 4.2-1M9.9 10a3 3 0 004.1 4.1"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  download: '<path d="M12 4v11.5M7 11l5 4.5 5-4.5"/><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  building: '<path d="M3.5 20h17M5.5 20V9.5L12 5l6.5 4.5V20M10 20v-5h4v5M9 11h.01M15 11h.01"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/>',
  shield: '<path d="M12 3l7.5 3v6c0 4.5-3.2 7.6-7.5 9-4.3-1.4-7.5-4.5-7.5-9V6z"/><path d="M8.5 12l2.4 2.4L15.5 10"/>',
  refresh: '<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 5v6h-6"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  inbox: '<path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>',
  wifi: '<path d="M3 3l18 18M8.5 16a5 5 0 017 0M5 12.5a10 10 0 015.5-2.7M14.5 9.9A10 10 0 0119 12.5M12 19.5h.01"/>',
  doc2: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>',
  spark: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>',
  chat: '<path d="M4 5.5h16v11H10l-4.5 3.7v-3.7H4z"/><path d="M8.5 9.5h7M8.5 12.5h4"/>',
  user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0115 0"/>'
};
const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg>`;
const brandMark = () => `<svg class="brand-mark" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="9" fill="#2D6BDF"/><path d="M11 8h9l5 5v13H11z" fill="#fff"/><path d="M20 8v5h5" fill="#C9DAFA"/><path d="M14.5 19l2.6 2.6 4.6-5" fill="none" stroke="#13294B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ========= Catálogo de documentos (configurável por edital) ========= */
const DEFAULT_FORMATS = ["pdf", "jpg", "png"];
const DOCS = {
  rg: { name: "Documento de identificação", short: "RG, CNH ou Carteira de Identidade Nacional, frente e verso.", purpose: "Comprova sua identidade e confirma os dados pessoais informados na inscrição.", how: "É emitido pelo órgão de identificação do seu estado. A CNH digital pode ser exportada em PDF pelo aplicativo Carteira Digital de Trânsito.", issuer: { label: "Serviços de identificação no gov.br", url: "https://www.gov.br/pt-br" }, maxPages: 2 },
  cpf: { name: "CPF", short: "Comprovante de situação cadastral. Dispensado se o número constar no documento de identificação.", purpose: "Confirma seu número de Cadastro de Pessoa Física, usado para identificar você no programa.", how: "Emita o comprovante de situação cadastral gratuitamente no site da Receita Federal.", issuer: { label: "Receita Federal", url: "https://www.gov.br/receitafederal/pt-br" }, maxPages: 1 },
  residencia: { name: "Comprovante de residência", short: "Conta de água, luz, telefone ou internet emitida nos últimos 90 dias.", purpose: "Comprova seu endereço e o tempo de residência no estado, critério de muitos programas de bolsa.", how: "Use uma fatura recente em seu nome ou no nome de pais ou responsáveis. A maioria das concessionárias oferece a 2ª via em PDF no site ou aplicativo.", issuer: null, maxPages: 2 },
  historico: { name: "Histórico escolar do ensino médio", short: "Histórico completo, com todas as séries cursadas.", purpose: "Mostra as disciplinas e notas do ensino médio e confirma onde você estudou.", how: "Solicite na secretaria da escola onde concluiu o ensino médio. Escolas estaduais também podem emitir pelo sistema da Secretaria de Educação.", issuer: null, maxPages: 6 },
  certificado: { name: "Certificado de conclusão do ensino médio", short: "Certificado ou declaração de conclusão assinada pela escola.", purpose: "Comprova que você concluiu o ensino médio, requisito para ingressar no ensino superior.", how: "É emitido pela secretaria da escola. Quem concluiu pelo Encceja pode emitir o certificado no site do Inep.", issuer: { label: "Inep (Encceja)", url: "https://www.gov.br/inep/pt-br" }, maxPages: 2 },
  renda: { name: "Comprovante de renda familiar", short: "Contracheques, extratos de benefício ou declaração de IR de quem mora com você.", purpose: "Permite calcular a renda familiar por pessoa, principal critério para a concessão de bolsas.", how: "Reúna os comprovantes de cada integrante da família em um único PDF, na ordem pedida pelo edital. A ferramenta Unir PDFs ajuda nessa etapa.", issuer: { label: "Carteira de Trabalho Digital", url: "https://www.gov.br/trabalho-e-emprego/pt-br" }, maxPages: 20 },
  escola_publica: { name: "Declaração de escola pública", short: "Declaração de que cursou o ensino médio em escola pública ou como bolsista integral.", purpose: "Comprova o direito à prioridade prevista para estudantes de escola pública.", how: "Solicite na secretaria da escola. Alguns editais oferecem um modelo para preenchimento.", issuer: null, maxPages: 2 },
  foto: { name: "Foto 3x4", short: "Foto recente, de frente, com fundo claro.", purpose: "É usada no cadastro acadêmico e na carteirinha de estudante.", how: "Tire a foto com o celular em um local bem iluminado, de frente para uma parede clara.", issuer: null, formats: ["jpg", "png"], maxPages: 1 },
  historico_sup: { name: "Histórico do ensino superior", short: "Histórico do curso de origem, com carga horária das disciplinas.", purpose: "É usado para analisar o aproveitamento de disciplinas na transferência.", how: "Solicite na secretaria acadêmica da instituição de origem.", issuer: null, maxPages: 10 },
  cadunico: { name: "Folha resumo do CadÚnico", short: "Comprovante de inscrição no Cadastro Único, se você tiver.", purpose: "Pode agilizar a análise socioeconômica.", how: "Emita pelo aplicativo Meu CadÚnico ou solicite no CRAS do seu município.", issuer: { label: "Ministério do Desenvolvimento Social", url: "https://www.gov.br/mds/pt-br" }, maxPages: 3 },
  complementar: { name: "Documentos complementares", short: "Declarações adicionais que ajudem a comprovar sua situação.", purpose: "Espaço para informações extras, como declaração de despesas com saúde ou moradia.", how: "Envie apenas o que o edital indicar como complementar.", issuer: null, maxPages: 10 }
};
const docDef = id => ({ id, formats: DEFAULT_FORMATS, ...DOCS[id] });

/* ========= Instituições e editais (fictícios) ========= */
const FORMAS = ["Universidade Gratuita", "Vestibular", "ENEM", "Transferência"];
const INST = [
  { id: "ucv", name: "Universidade Comunitária do Vale", city: "Blumenau", uf: "SC", about: "Universidade comunitária com 38 cursos de graduação presenciais.",
    edital: { id: "ucv-ug", name: "Edital 14/2026 – Bolsas Universidade Gratuita 2027/1", forma: "Universidade Gratuita", open: -18, close: 6, summary: "Seleção de estudantes para bolsas integrais do programa Universidade Gratuita, com análise socioeconômica e documental.", required: ["rg", "cpf", "residencia", "historico", "certificado", "renda", "escola_publica"], optional: ["cadunico", "complementar"] } },
  { id: "fln", name: "Faculdade Litoral Norte", city: "Joinville", uf: "SC", about: "Faculdade com foco em cursos de tecnologia e gestão.",
    edital: { id: "fln-enem", name: "Ingresso via ENEM 2027/1", forma: "ENEM", open: -9, close: 42, summary: "Ingresso com aproveitamento das notas do ENEM de 2023 a 2025, sem prova presencial.", required: ["rg", "cpf", "historico", "certificado"], optional: ["complementar"] } },
  { id: "serra", name: "Centro Universitário Serra Catarinense", city: "Lages", uf: "SC", about: "Centro universitário com cursos nas áreas de saúde, agrárias e engenharias.",
    edital: { id: "serra-vest", name: "Vestibular de Verão 2027", forma: "Vestibular", open: -14, close: 32, summary: "Processo seletivo com prova on-line e redação, para todos os cursos de graduação.", required: ["rg", "cpf", "residencia", "certificado", "foto"], optional: ["complementar"] } },
  { id: "usc", name: "Universidade Sul Catarinense", city: "Criciúma", uf: "SC", about: "Universidade com mais de 40 anos de atuação no sul do estado.",
    edital: { id: "usc-transf", name: "Transferência externa 2027/1", forma: "Transferência", open: -5, close: 52, summary: "Vagas remanescentes para estudantes de outras instituições, com análise de histórico.", required: ["rg", "cpf", "historico_sup", "residencia"], optional: ["complementar"] } },
  { id: "ilha", name: "Faculdade Porto da Ilha", city: "Florianópolis", uf: "SC", about: "Faculdade com cursos noturnos e campus no centro da cidade.",
    edital: { id: "ilha-ug", name: "Edital 03/2026 – Universidade Gratuita 2027/1, 2ª chamada", forma: "Universidade Gratuita", open: 2, close: 27, summary: "Segunda chamada para bolsas do programa Universidade Gratuita, com vagas não preenchidas na primeira etapa.", required: ["rg", "cpf", "residencia", "historico", "certificado", "renda"], optional: ["cadunico"] } },
  { id: "altovale", name: "Faculdade Alto Vale", city: "Rio do Sul", uf: "SC", about: "Faculdade regional com cursos de licenciatura e bacharelado.",
    edital: { id: "av-enem", name: "Seleção ENEM 2027", forma: "ENEM", open: -3, close: 18, summary: "Classificação pelas notas do ENEM para cursos presenciais.", required: ["rg", "cpf", "certificado"], optional: ["complementar"] } },
  { id: "planalto", name: "Universidade do Planalto Catarinense", city: "Chapecó", uf: "SC", about: "Universidade comunitária do oeste catarinense.",
    edital: { id: "plan-ug", name: "Edital 09/2026 – Universidade Gratuita 2026/2", forma: "Universidade Gratuita", open: -50, close: -19, summary: "Seleção para bolsas do segundo semestre de 2026.", required: ["rg", "cpf", "residencia", "historico", "renda"], optional: [] } },
  { id: "oeste", name: "Instituto Superior do Oeste", city: "São Miguel do Oeste", uf: "SC", about: "Instituto com cursos tecnológicos de curta duração.", edital: null },
  { id: "foz", name: "Faculdade Foz do Itajaí", city: "Itajaí", uf: "SC", about: "Faculdade com cursos de logística, administração e engenharia naval.",
    edital: { id: "foz-ug", name: "Edital 21/2026 – Universidade Gratuita 2027/1", forma: "Universidade Gratuita", open: -7, close: 21, summary: "Bolsas integrais do programa Universidade Gratuita para cursos presenciais, com análise socioeconômica e documental.", required: ["rg", "cpf", "residencia", "historico", "certificado", "renda", "escola_publica"], optional: ["cadunico", "complementar"] } },
  { id: "campos", name: "Universidade dos Campos de Cima", city: "São Bento do Sul", uf: "SC", about: "Universidade com cursos nas áreas de design, engenharia e tecnologia.",
    edital: { id: "campos-vest", name: "Vestibular de Inverno 2027", forma: "Vestibular", open: -2, close: 35, summary: "Processo seletivo com prova on-line, para cursos de graduação com início no segundo semestre.", required: ["rg", "cpf", "certificado", "foto"], optional: ["complementar"] } },
  { id: "extremo", name: "Centro Universitário do Extremo Sul", city: "Araranguá", uf: "SC", about: "Centro universitário com cursos nas áreas de saúde e educação.",
    edital: { id: "extremo-enem", name: "Ingresso via ENEM 2027/1", forma: "ENEM", open: -12, close: 9, summary: "Ingresso pela nota do ENEM, sem prova presencial, para todos os cursos de graduação.", required: ["rg", "cpf", "historico", "certificado"], optional: ["cadunico"] } },
  { id: "vale-rio", name: "Instituto Vale do Rio Tijucas", city: "Tijucas", uf: "SC", about: "Instituto com cursos superiores de tecnologia e gestão pública.",
    edital: { id: "tijucas-transf", name: "Transferência externa 2027/1", forma: "Transferência", open: 8, close: 40, summary: "Vagas remanescentes para estudantes de outras instituições, com análise de histórico da graduação.", required: ["rg", "cpf", "historico_sup", "residencia"], optional: ["complementar"] } },
  { id: "meio-oeste", name: "Faculdade do Meio-Oeste Catarinense", city: "Joaçaba", uf: "SC", about: "Faculdade com cursos de direito, administração e pedagogia.",
    edital: { id: "mo-ug", name: "Edital 05/2026 – Universidade Gratuita 2026/2", forma: "Universidade Gratuita", open: -45, close: -12, summary: "Seleção de bolsas do segundo semestre de 2026, já encerrada.", required: ["rg", "cpf", "residencia", "historico", "renda"], optional: ["cadunico"] } },
  { id: "planicie", name: "Instituto Superior da Planície", city: "Jaraguá do Sul", uf: "SC", about: "Instituto com cursos tecnológicos voltados à indústria.", edital: null },
  { id: "unesc", name: "UNESC – Universidade do Extremo Sul Catarinense", city: "Criciúma", uf: "SC", about: "Universidade comunitária de Criciúma, com cursos de graduação e pós-graduação. Informações de exemplo para fins acadêmicos.",
    edital: { id: "unesc-ug", name: "Edital de exemplo – Universidade Gratuita 2027/1", forma: "Universidade Gratuita", open: -10, close: 24, summary: "Edital fictício para demonstração, com bolsas do programa Universidade Gratuita e análise socioeconômica e documental. Não é um edital real da instituição.", required: ["rg", "cpf", "residencia", "historico", "certificado", "renda", "escola_publica"], optional: ["cadunico", "complementar"] } },
  { id: "satc", name: "SATC – Associação Beneficente da Indústria Carbonífera", city: "Criciúma", uf: "SC", about: "Instituição de ensino técnico e superior de Criciúma. Informações de exemplo para fins acadêmicos.",
    edital: { id: "satc-vest", name: "Edital de exemplo – Vestibular 2027", forma: "Vestibular", open: -6, close: 30, summary: "Edital fictício para demonstração, com processo seletivo para cursos de graduação. Não é um edital real da instituição.", required: ["rg", "cpf", "certificado", "foto"], optional: ["complementar"] } }
];
INST.forEach(i => { if (i.edital) { i.edital.openDate = addDays(i.edital.open); i.edital.closeDate = addDays(i.edital.close); i.edital.instId = i.id; } });
const instById = id => INST.find(i => i.id === id);
const edState = ed => !ed ? "none" : TODAY < sod(ed.openDate) ? "futuro" : TODAY > sod(ed.closeDate) ? "encerrado" : "aberto";

/* ========= Estado e persistência ========= */
const STORE_KEY = "bolsatech-demo-v1";
const fileStore = new Map();      // blobs da sessão (key app:doc)
const previewStore = new Map();   // dataURLs de imagens
let pendingFile = null;           // arquivo vindo da ferramenta de PDFs
function freshState() { return { users: [{ name: "Ana Souza", email: "ana.souza@exemplo.com", hash: null, demo: true }], session: null, attempts: {}, apps: {}, seeded: false, flash: null }; }
function loadState() { try { const raw = localStorage.getItem(STORE_KEY); if (raw) return { ...freshState(), ...JSON.parse(raw) }; } catch (e) {} return freshState(); }
let S = loadState();
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }
const me = () => S.users.find(u => u.email === S.session);
const myApps = () => Object.values(S.apps).filter(a => a.owner === S.session).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const appEdital = app => instById(app.instId).edital;
const docState = (app, id) => app.docs[id] || { status: "pendente" };
const requiredDone = app => appEdital(app).required.filter(id => docState(app, id).status === "enviado").length;
const isLocked = (app, docId) => app.status !== "rascunho" && !(app.status === "reenvio" && app.pendency && app.pendency.docId === docId);

async function hash(str) {
  try { const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)); return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join(""); }
  catch (e) { let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0; return "f" + h; }
}

function okChecks(meta) {
  return [
    { label: "Formato e tamanho permitidos", result: "ok", detail: `${extOf(meta.name).toUpperCase()}, ${fmtSize(meta.size)}` },
    { label: "Arquivo íntegro e acessível", result: "ok", detail: "O conteúdo corresponde ao formato informado." },
    { label: "Leitura das páginas", result: "ok", detail: `${plural(meta.pages || 1, "página encontrada", "páginas encontradas")}.` },
    { label: "Compatível com o documento solicitado", result: "ok", detail: "Quantidade de páginas dentro do esperado." }
  ];
}
function seedDemo() {
  const email = "ana.souza@exemplo.com";
  if (Object.values(S.apps).some(a => a.owner === email)) return;
  const d = (n, h = 10) => { const x = addDays(n); x.setHours(h, 12, 0, 0); return x.toISOString(); };
  const f = (name, size, pages, extra = {}) => ({ name, size, pages, type: extOf(name) === "pdf" ? "application/pdf" : "image/jpeg", demo: true, ...extra });
  const sent = (meta, day) => ({ status: "enviado", file: meta, checks: okChecks(meta), analyzedAt: d(day) });
  const rendaMeta = f("renda-familiar.jpg", 1150000, 1, { width: 640, height: 480 });
  S.apps["ap-ucv"] = { id: "ap-ucv", owner: email, instId: "ucv", createdAt: d(-4), status: "rascunho", timeline: [], docs: {
    rg: sent(f("rg-frente-verso.pdf", 421000, 2), -4),
    cpf: sent(f("comprovante-cpf.pdf", 88000, 1), -4),
    residencia: sent(f("fatura-energia-setembro.pdf", 236000, 1), -3),
    renda: { status: "pendencia", file: rendaMeta, analyzedAt: d(-2), checks: [
      { label: "Formato e tamanho permitidos", result: "ok", detail: "JPG, 1,1 MB" },
      { label: "Arquivo íntegro e acessível", result: "ok", detail: "O conteúdo corresponde ao formato informado." },
      { label: "Legibilidade", result: "warn", detail: "Resolução baixa (640 × 480 px). Fotografe mais de perto ou use um aplicativo de digitalização." },
      { label: "Compatível com o documento solicitado", result: "ok", detail: "Formato de imagem aceito para este documento." }] }
  } };
  const fl = { rg: sent(f("identidade.pdf", 390000, 2), -6), cpf: sent(f("cpf.pdf", 72000, 1), -6), historico: sent(f("historico-ensino-medio.pdf", 1240000, 3), -6), certificado: sent(f("certificado-conclusao.pdf", 310000, 1), -6) };
  S.apps["ap-fln"] = { id: "ap-fln", owner: email, instId: "fln", createdAt: d(-7), status: "analise", docs: fl, protocol: "IN-2026-483920", submittedAt: d(-5, 16),
    timeline: [{ date: d(-5, 16), label: "Inscrição enviada", detail: "Protocolo IN-2026-483920." }, { date: d(-3, 9), label: "Análise iniciada", detail: "A instituição começou a conferir seus documentos." }] };
  save();
}

/* ========= Componentes ========= */
const DOC_STATUS = {
  pendente: { label: "Pendente", cls: "s-gray", icon: "circle" },
  enviado: { label: "Enviado", cls: "s-green", icon: "check" },
  rejeitado: { label: "Rejeitado", cls: "s-red", icon: "x" },
  analise: { label: "Em análise", cls: "s-yellow", icon: "clock" },
  pendencia: { label: "Pendência", cls: "s-orange", icon: "alert" }
};
const APP_STATUS = {
  rascunho: { label: "Em preenchimento", cls: "s-gray", icon: "circle", tl: "" },
  enviado: { label: "Enviado", cls: "s-green", icon: "check", tl: "c-green" },
  analise: { label: "Em análise", cls: "s-yellow", icon: "clock", tl: "c-yellow" },
  reenvio: { label: "Reenvio solicitado", cls: "s-orange", icon: "alert", tl: "c-orange" },
  deferido: { label: "Deferido", cls: "s-green", icon: "check", tl: "c-green" },
  indeferido: { label: "Indeferido", cls: "s-red", icon: "x", tl: "c-red" }
};
const badge = s => `<span class="badge ${s.cls}">${ic(s.icon)}${esc(s.label)}</span>`;
const docBadge = st => badge(DOC_STATUS[st] || DOC_STATUS.pendente);
const appBadge = st => badge(APP_STATUS[st] || APP_STATUS.rascunho);
const statusDot = st => { const s = DOC_STATUS[st] || DOC_STATUS.pendente; return `<span class="dot ${s.cls}" aria-hidden="true">${ic(s.icon)}</span>`; };

function segs(app, thin = false) {
  const ed = appEdital(app); const done = requiredDone(app);
  return `<div class="segs ${thin ? "thin" : ""}" role="img" aria-label="${done} de ${ed.required.length} documentos obrigatórios enviados">${ed.required.map(id => `<span class="g-${docState(app, id).status}"></span>`).join("")}</div>`;
}
function deadlineText(ed) {
  const st = edState(ed);
  if (st === "encerrado") return `Prazo encerrado em ${fmtDate(ed.closeDate)}`;
  if (st === "futuro") return `Inscrições a partir de ${fmtDate(ed.openDate)}`;
  const n = dayDiff(ed.closeDate);
  return `Prazo final: ${fmtDate(ed.closeDate)} (${n === 0 ? "encerra hoje" : n === 1 ? "falta 1 dia" : `faltam ${n} dias`})`;
}
function deadline(ed) {
  const st = edState(ed); const n = dayDiff(ed.closeDate);
  const cls = st === "aberto" ? (n <= 7 ? "urgent" : "") : "closed";
  return `<span class="deadline ${cls}">${ic(st === "aberto" && n <= 7 ? "alert" : "calendar", "sm")}${esc(deadlineText(ed))}</span>`;
}
function edSeal(ed) {
  const st = edState(ed);
  if (st === "aberto") return `<span class="badge s-green">${ic("check")}Edital aberto até ${fmtDate(ed.closeDate)}</span>`;
  if (st === "futuro") return `<span class="badge s-blue">${ic("calendar")}Abre em ${fmtDate(ed.openDate)}</span>`;
  return `<span class="badge s-gray">${ic("circle")}Sem edital aberto</span>`;
}
const notice = (type, iconName, title, body = "") => `<div class="notice n-${type}" role="${type === "danger" ? "alert" : "status"}">${ic(iconName)}<div>${title ? `<strong>${title}</strong>` : ""}${body ? `<span>${body}</span>` : ""}</div></div>`;
const empty = (iconName, title, text, action = "") => `<div class="card empty"><div class="dot">${ic(iconName, "lg")}</div><h2>${title}</h2><p>${text}</p>${action ? `<div style="margin-top:18px">${action}</div>` : ""}</div>`;
const skeletonCards = n => Array.from({ length: n }, () => `<div class="card-flat" aria-hidden="true"><div class="skel" style="height:18px;width:60%"></div><div class="skel" style="height:12px;width:40%;margin-top:12px"></div><div class="skel" style="height:12px;width:80%;margin-top:10px"></div><div class="skel" style="height:36px;width:120px;margin-top:16px"></div></div>`).join("");

function appCard(app) {
  const inst = instById(app.instId); const ed = inst.edital; const done = requiredDone(app); const total = ed.required.length;
  const action = app.status === "rascunho"
    ? `<a class="btn btn-primary" href="#/inscricao/${app.id}">Continuar documentação</a>`
    : `<a class="btn btn-secondary" href="#/acompanhar/${app.id}">Acompanhar inscrição</a>`;
  return `<article class="card app-card">
    <div class="top"><div><div class="inst">${esc(inst.name)}</div><h3>${esc(ed.name)}</h3></div>${appBadge(app.status)}</div>
    ${segs(app, true)}
    <div class="row small"><span><b>${done} de ${total}</b> documentos obrigatórios enviados</span></div>
    <div class="row">${app.status === "rascunho" ? deadline(ed) : `<span class="small muted">Protocolo ${esc(app.protocol)}</span>`}<span class="spacer"></span>${action}</div>
  </article>`;
}

/* ========= Toasts e modais ========= */
function toast(msg, type = "success") {
  const box = $("#toasts"); const el = document.createElement("div");
  el.className = `toast ${type}`; el.innerHTML = `${ic(type === "error" ? "alert" : "check")}<span>${esc(msg)}</span>`;
  box.appendChild(el); setTimeout(() => el.remove(), 4200);
}
let modalReturn = null;
function openModal({ title, body, actions = [], wide = false, onClose }) {
  closeModal(); modalReturn = document.activeElement;
  const bg = document.createElement("div"); bg.className = "modal-bg"; bg.id = "modal";
  bg.innerHTML = `<div class="modal ${wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="row" style="align-items:flex-start"><h2 id="modal-title" style="flex:1">${title}</h2><button class="icon-btn" data-close aria-label="Fechar">${ic("x")}</button></div>
    <div style="margin-top:12px">${body}</div>
    ${actions.length ? `<div class="modal-actions">${actions.map((a, i) => `<button class="btn ${a.cls || "btn-secondary"}" data-mi="${i}">${a.label}</button>`).join("")}</div>` : ""}</div>`;
  document.body.appendChild(bg);
  bg.addEventListener("click", e => {
    if (e.target === bg || e.target.closest("[data-close]")) { closeModal(); onClose && onClose(); return; }
    const b = e.target.closest("[data-mi]"); if (b) actions[+b.dataset.mi].onClick(b);
  });
  bg.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); onClose && onClose(); }
    if (e.key === "Tab") { const f = $$("button,a[href],input,select,[tabindex]:not([tabindex='-1'])", bg).filter(x => !x.disabled); if (!f.length) return; const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });
  const focusEl = $("[data-mi]:last-of-type", bg) || $("[data-close]", bg); focusEl && focusEl.focus();
  return bg;
}
function closeModal() { const m = $("#modal"); if (m) { m.remove(); if (modalReturn && document.contains(modalReturn)) modalReturn.focus(); } }

/* ========= Downloads (capacidade do runtime) ========= */
let downloadsP = null;
function getDownloads() {
  if (!downloadsP) downloadsP = (window.claude && typeof window.claude.use === "function") ? window.claude.use("downloads").catch(() => null) : Promise.resolve(null);
  return downloadsP;
}
async function saveFile(filename, data) {
  const d = await getDownloads();
  if (!d) {
    if (window.claude) { toast("O download não está disponível nesta visualização.", "error"); return; }
    const blob = data instanceof Blob ? data : new Blob([data]); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000); toast("Download iniciado."); return;
  }
  try { await d.save({ filename, data }); toast("Arquivo pronto para salvar."); }
  catch (e) {
    const c = e && e.code;
    if (c === "declined") return;
    if (c === "rate_limited") toast("Aguarde um instante e tente novamente.", "error");
    else toast("Não foi possível baixar o arquivo nesta visualização.", "error");
  }
}
/* ========= Roteador ========= */
const PRIVATE = ["painel", "buscar", "instituicao", "inscricao", "documento", "pdf", "revisao", "enviado", "comprovante", "acompanhar", "inscricoes", "estados", "faltantes"];
let lastHash = null, cleanup = null;
function parseHash() {
  const h = location.hash.replace(/^#\/?/, ""); const [path, qs] = h.split("?");
  const parts = path.split("/").filter(Boolean);
  return { name: parts[0] || "inicio", params: parts.slice(1), query: new URLSearchParams(qs || "") };
}
function go(path) { const target = "#/" + path; if (location.hash === target) render(); else location.hash = target; }
function render() {
  const r = parseHash();
  if (PRIVATE.includes(r.name) && !me()) { S.redirect = location.hash; save(); go("entrar"); return; }
  if (r.name === "entrar" && me()) { go("painel"); return; }
  if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
  closeModal();
  const view = (VIEWS[r.name] || VIEWS.naoEncontrada)(r.params, r.query);
  if (!view) return;
  const same = lastHash === location.hash; const y = window.scrollY;
  document.title = `${view.title} | BolsaTech`;
  $("#root").innerHTML = view.shell === "app" ? appShell(r.name, view) : pubShell(view);
  document.body.classList.toggle("has-action-bar", !!view.actionBar);
  if (view.mount) cleanup = view.mount() || null;
  if (same) window.scrollTo(0, y);
  else { window.scrollTo(0, 0); const h1 = $("#root h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); } }
  lastHash = location.hash;
}
window.addEventListener("hashchange", render);

const DEMO_BAR = `<div class="demo-bar" role="note">Ambiente de demonstração: instituições e dados fictícios. Nenhuma inscrição é enviada a instituições reais.</div>`;
function pubShell(view) {
  const logged = !!me();
  return `${DEMO_BAR}<header class="pub-header"><div class="container">
    <a class="brand" href="#/inicio">${brandMark()}BolsaTech</a>
    <nav class="pub-nav" aria-label="Principal">
      ${logged ? `<a class="btn btn-ghost btn-sm" href="#/criar-conta">Criar conta</a><a class="btn btn-primary btn-sm" href="#/painel">Ir para o painel</a>` : `
      <button class="btn btn-ghost btn-sm hide-sm" data-act="como">Como funciona</button>
      <a class="btn btn-ghost btn-sm" href="#/entrar">Entrar</a>
      <a class="btn btn-primary btn-sm" href="#/criar-conta">Criar conta</a>`}
    </nav></div></header>
    <main id="main">${view.html}</main>
    <footer class="footer"><div class="container">
      <span>© 2026 BolsaTech. Projeto acadêmico.</span><span class="spacer"></span>
      <a href="#/privacidade">Política de privacidade</a><a href="#/privacidade?s=termos">Termos de uso</a><a href="#/privacidade?s=contato">Contato</a>
    </div></footer>`;
}
function appShell(name, view) {
  const u = me(); const cur = n => (n === name || (view.nav === n) ? 'aria-current="page"' : "");
  const items = [["painel", "home", "Painel"], ["buscar", "search", "Buscar instituições"], ["faltantes", "spark", "Documentos faltantes"], ["inscricoes", "list", "Minhas inscrições"], ["pdf", "layers", "Unir PDFs"]];
  return `${DEMO_BAR}<div class="shell">
    <aside class="sidebar" aria-label="Menu">
      <a class="brand" href="#/painel">${brandMark()}BolsaTech</a>
      <nav>${items.map(([n, i, l]) => `<a href="#/${n}" ${cur(n)}>${ic(i)}${l}</a>`).join("")}
        <div class="side-group">Demonstração</div>
        <a href="#/estados" ${cur("estados")}>${ic("expand")}Estados da interface</a></nav>
      <div class="side-foot"><div class="who">${esc(u.name)}<span>${esc(u.email)}</span></div>
        <button class="navlink" data-act="logout">${ic("logout")}Sair</button></div>
    </aside>
    <div class="main">
      <div class="topbar"><a class="brand" href="#/painel">${brandMark()}BolsaTech</a><span class="spacer"></span>
        <a class="icon-btn" href="#/estados" aria-label="Estados da interface">${ic("expand")}</a>
        <button class="icon-btn" data-act="logout" aria-label="Sair">${ic("logout")}</button></div>
      <main id="main" class="page">${view.html}</main>
    </div>
  </div>
  <nav class="bottom-nav" aria-label="Navegação">${items.map(([n, i, l]) => `<a href="#/${n}" ${cur(n)}>${ic(i)}${l.replace(" instituições", "").replace("Minhas i", "I").replace("Documentos faltantes", "Faltantes")}</a>`).join("")}</nav>`;
}

/* ========= Ações globais ========= */
const ACTIONS = {
  goLogin(el) {
    /* Leva sempre à tela de login com o e-mail preenchido; se houver conta logada, encerra a sessão dela. */
    S.session = null; S.redirect = null; save();
    const target = "#/entrar?email=" + encodeURIComponent(el.dataset.email || "");
    if (location.hash === target) render(); else location.hash = target;
  },
  logout() { S.session = null; save(); toast("Você saiu da sua conta."); go("inicio"); },
  skip() { const m = $("#main"); if (m) { m.setAttribute("tabindex", "-1"); m.focus(); } },
  suporte() {
    const bg = openModal({ title: "Suporte BolsaTech", wide: false,
      body: `<ul class="support-help">
          <li>${ic("clock", "sm")}<span>Respondemos em até 1 dia útil.</span></li>
          <li>${ic("file", "sm")}<span>Informe o edital e o documento em que está com dúvida, se houver.</span></li>
        </ul>
        <div class="field"><label for="sup-msg">Como podemos ajudar?</label>
          <textarea id="sup-msg" class="input" maxlength="1000" placeholder="Descreva sua dúvida ou problema"></textarea>
          <div class="field-error" id="sup-msg-e" role="alert"></div></div>
        <p class="small muted" style="margin-top:12px">Demonstração: a mensagem não é enviada a ninguém.</p>`,
      actions: [
        { label: "Cancelar", cls: "btn-secondary", onClick: closeModal },
        { label: "Enviar mensagem", cls: "btn-primary", onClick: () => {
          const t = $("#sup-msg"), e = $("#sup-msg-e");
          if (t.value.trim().length < 10) { t.setAttribute("aria-invalid", "true"); e.innerHTML = `${ic("alert")}<span>Escreva pelo menos 10 caracteres para a gente entender sua dúvida.</span>`; t.focus(); return; }
          closeModal(); toast("Mensagem enviada. Retornaremos em breve.");
        } }
      ] });
    const t = $("#sup-msg", bg); t && t.focus();
  },
  como() { const el = $("#como"); el && el.scrollIntoView({ behavior: "smooth" }); },
  edLink() { openModal({ title: "Edital oficial", body: `<p>Nesta demonstração o link é ilustrativo. No sistema real, o edital oficial abriria no site da instituição, em uma nova aba.</p>`, actions: [{ label: "Entendi", cls: "btn-primary", onClick: closeModal }] }); }
};
document.addEventListener("click", e => {
  const a = e.target.closest("[data-act]"); if (a && ACTIONS[a.dataset.act]) { e.preventDefault(); ACTIONS[a.dataset.act](a, e); }
});

/* ========= Telas públicas ========= */
const VIEWS = {};
VIEWS.naoEncontrada = () => ({ title: "Página não encontrada", shell: me() ? "app" : "pub", html: `<div class="${me() ? "" : "auth-wrap"}">${empty("search", "Página não encontrada", "O endereço acessado não existe ou foi alterado.", `<a class="btn btn-primary" href="#/${me() ? "painel" : "inicio"}">Voltar ao início</a>`)}</div>` });

VIEWS.inicio = () => {
  const rows = [["Documento de identificação", "enviado"], ["CPF", "enviado"], ["Comprovante de residência", "enviado"], ["Histórico escolar", "analise"], ["Comprovante de renda familiar", "pendencia"], ["Certificado de conclusão", "pendente"]];
  return { title: "Inscrição em editais", shell: "pub", html: `
  <section class="hero container">
    <div>
      <h1>Sua inscrição mais simples, segura e organizada.</h1>
      <p class="lead">Encontre editais, organize seus documentos e acompanhe sua inscrição em um só lugar.</p>
      <div class="hero-cta"><a class="btn btn-primary btn-lg" href="#/criar-conta">Criar conta</a><a class="btn btn-secondary btn-lg" href="#/entrar">Entrar</a></div>
      <p class="small muted" style="margin-top:18px;display:flex;gap:8px;align-items:center">${ic("shield", "sm")}Gratuito para estudantes. Dados protegidos conforme a LGPD.</p>
    </div>
    <div class="hero-visual">
      <div class="mock" role="img" aria-label="Exemplo de checklist: 3 de 6 documentos enviados, 1 em análise e 1 com pendência">
        <div class="small muted" style="font-weight:600">Universidade Comunitária do Vale</div>
        <div style="font-weight:750;margin:2px 0 12px">Bolsas Universidade Gratuita 2027/1</div>
        <div class="segs" aria-hidden="true">${rows.map(r => `<span class="g-${r[1]}"></span>`).join("")}</div>
        <div class="row small" style="margin:10px 0 6px;justify-content:space-between"><b>3 de 6 obrigatórios enviados</b><span class="deadline urgent" style="padding:4px 9px">${ic("alert", "sm")}Encerra em 6 dias</span></div>
        <div aria-hidden="true">${rows.map(r => `<div class="mock-row">${statusDot(r[1])}<span class="name">${r[0]}</span>${docBadge(r[1])}</div>`).join("")}</div>
      </div>
    </div>
  </section>
  <section class="pub-section" id="como"><div class="container">
    <h2>Como funciona</h2>
    <ol class="steps-pub">
      <li><h3>Encontre um edital</h3><p class="muted small" style="margin-top:6px">Pesquise instituições por nome, cidade ou forma de ingresso e veja quais editais estão abertos.</p></li>
      <li><h3>Organize seus documentos</h3><p class="muted small" style="margin-top:6px">Receba a lista exata do edital. Um assistente de IA mostra o que já foi enviado e o que ainda falta.</p></li>
      <li><h3>Envie sua inscrição</h3><p class="muted small" style="margin-top:6px">Cada arquivo passa por uma pré-análise antes do envio, para você corrigir problemas a tempo.</p></li>
      <li><h3>Acompanhe o resultado</h3><p class="muted small" style="margin-top:6px">Veja o status da análise, responda a pendências e consulte o resultado final.</p></li>
    </ol>
  </div></section>
  <section class="pub-section"><div class="container">
    <h2>Menos chance de perder a sua vaga</h2>
    <div class="grid grid-3">
      <div class="benefit"><span class="dot">${ic("calendar")}</span><div><h3>Prazos sempre à vista</h3><p class="muted small" style="margin-top:4px">O prazo final do edital acompanha você em todas as etapas, com aviso quando estiver perto do fim.</p></div></div>
      <div class="benefit"><span class="dot">${ic("info")}</span><div><h3>Orientação em cada documento</h3><p class="muted small" style="margin-top:4px">Saiba para que serve cada documento, onde emiti-lo e em qual formato enviar.</p></div></div>
      <div class="benefit"><span class="dot">${ic("shield")}</span><div><h3>Erros evitados antes do envio</h3><p class="muted small" style="margin-top:4px">Formato, tamanho e legibilidade são conferidos na hora, não semanas depois.</p></div></div>
    </div>
  </div></section>` };
};

VIEWS.privacidade = (p, q) => {
  const s = q.get("s");
  return { title: "Privacidade e termos", shell: "pub", html: `<div class="container" style="max-width:760px;padding-top:36px;padding-bottom:56px"><div class="stack">
    <h1>Privacidade, termos e contato</h1>
    <section class="card stack" id="privacidade" style="--gap:10px"><h2>Política de privacidade</h2>
      <p>O BolsaTech coleta apenas os dados necessários para a inscrição: nome, e-mail e os documentos exigidos pelo edital escolhido.</p>
      <p>Os documentos são usados exclusivamente para a pré-análise e para o envio à instituição que você selecionar. Você pode excluir arquivos enviados enquanto a inscrição não for confirmada.</p>
      <p>Em conformidade com a LGPD (Lei nº 13.709/2018), você pode solicitar a qualquer momento acesso, correção ou exclusão dos seus dados.</p></section>
    <section class="card stack" id="termos" style="--gap:10px"><h2>Termos de uso</h2>
      <p>A pré-análise documental é uma verificação preliminar e não garante a aprovação da inscrição. A validação definitiva é feita pela instituição responsável pelo edital.</p>
      <p>Você é responsável pela veracidade dos documentos enviados.</p></section>
    <section class="card stack" id="contato" style="--gap:10px"><h2>Contato</h2>
      <p>${ic("mail", "sm")} contato@bolsatech.exemplo <span class="muted small">(endereço fictício)</span></p></section>
    <a class="btn btn-secondary" href="#/${me() ? "painel" : "inicio"}">${ic("back", "sm")}Voltar</a>
  </div></div>`, mount() { if (s) { const el = $("#" + s); el && el.scrollIntoView(); } } };
};

/* ----- Cadastro ----- */
VIEWS["criar-conta"] = () => ({ title: "Criar conta", shell: "pub", html: `<div class="auth-wrap"><div class="card">
  <h1>Criar conta</h1><p class="muted" style="margin-top:6px">Leva menos de um minuto. Depois você já pode buscar editais.</p>
  <form id="f-signup" class="stack" novalidate style="margin-top:22px;--gap:18px">
    <div class="field"><label for="su-name">Nome completo</label><input class="input" id="su-name" autocomplete="name" aria-describedby="su-name-e"><div class="field-error" id="su-name-e" aria-live="polite"></div></div>
    <div class="field"><label for="su-email">E-mail</label><input class="input" id="su-email" type="email" autocomplete="email" inputmode="email" aria-describedby="su-email-e"><div class="field-error" id="su-email-e" aria-live="polite"></div></div>
    <div class="field"><label for="su-pass">Senha</label>
      <div class="input-wrap"><input class="input" id="su-pass" type="password" autocomplete="new-password" aria-describedby="su-crit su-pass-e"><button type="button" class="toggle-pass" data-toggle="su-pass" aria-label="Mostrar senha">${ic("eye")}</button></div>
      <div class="strength" id="su-strength" data-level="0" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <ul class="criteria" id="su-crit"><li data-c="len">${ic("circle", "sm")}Mínimo de 8 caracteres</li><li data-c="let">${ic("circle", "sm")}Pelo menos uma letra</li><li data-c="num">${ic("circle", "sm")}Pelo menos um número</li></ul>
      <span class="hint" id="su-strength-label" aria-live="polite"></span>
      <div class="field-error" id="su-pass-e" aria-live="polite"></div></div>
    <div class="field"><label for="su-pass2">Confirmar senha</label>
      <div class="input-wrap"><input class="input" id="su-pass2" type="password" autocomplete="new-password" aria-describedby="su-pass2-e"><button type="button" class="toggle-pass" data-toggle="su-pass2" aria-label="Mostrar senha">${ic("eye")}</button></div>
      <div class="field-error" id="su-pass2-e" aria-live="polite"></div></div>
    <label class="check-line"><input type="checkbox" id="su-terms"><span>Li e aceito os <a href="#/privacidade?s=termos" target="_self">termos de uso</a> e a <a href="#/privacidade">política de privacidade</a>, incluindo o tratamento dos meus dados conforme a LGPD.</span></label>
    <button class="btn btn-primary btn-lg btn-block" id="su-submit" type="submit" disabled>Criar conta</button>
    <p class="hint" id="su-why" style="text-align:center" aria-live="polite">Preencha todos os campos e aceite os termos para continuar.</p>
    <p class="small" style="text-align:center">Já possui uma conta? <a href="#/entrar">Entrar</a></p>
  </form></div></div>`,
  mount() {
    const f = $("#f-signup"); const touched = new Set();
    const v = { name: $("#su-name"), email: $("#su-email"), pass: $("#su-pass"), pass2: $("#su-pass2"), terms: $("#su-terms") };
    const rules = {
      name: () => v.name.value.trim().split(/\s+/).filter(Boolean).length < 2 ? "Informe seu nome completo." : "",
      email: () => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.value.trim()) ? "Digite um e-mail válido." : "",
      pass: () => v.pass.value.length < 8 ? "A senha deve possuir pelo menos 8 caracteres." : !(/[a-zA-Z]/.test(v.pass.value) && /\d/.test(v.pass.value)) ? "Inclua pelo menos uma letra e um número." : "",
      pass2: () => !v.pass2.value ? "Confirme sua senha." : v.pass2.value !== v.pass.value ? "As senhas não coincidem." : ""
    };
    const setErr = (k, msg) => { const el = $(`#su-${k}-e`); el.innerHTML = msg ? `${ic("alert")}<span>${esc(msg)}</span>` : ""; v[k].setAttribute("aria-invalid", msg ? "true" : "false"); };
    const crit = () => {
      const p = v.pass.value; const c = { len: p.length >= 8, let: /[a-zA-Z]/.test(p), num: /\d/.test(p) };
      $$("#su-crit li").forEach(li => { const ok = c[li.dataset.c]; li.classList.toggle("ok", ok); li.querySelector("svg").outerHTML = ic(ok ? "check" : "circle", "sm"); });
      let lvl = (c.len ? 1 : 0) + (c.let && c.num ? 1 : 0) + (p.length >= 12 ? 1 : 0) + (/[^a-zA-Z0-9]/.test(p) ? 1 : 0);
      if (!p) lvl = 0; $("#su-strength").dataset.level = lvl;
      $("#su-strength-label").textContent = p ? `Força da senha: ${["muito fraca", "fraca", "média", "forte", "muito forte"][lvl]}` : "";
    };
    const refresh = () => {
      Object.keys(rules).forEach(k => { if (touched.has(k)) setErr(k, rules[k]()); });
      const valid = Object.keys(rules).every(k => !rules[k]()) && v.terms.checked;
      $("#su-submit").disabled = !valid;
      $("#su-why").textContent = valid ? "" : !Object.keys(rules).every(k => !rules[k]()) ? "Preencha todos os campos corretamente para continuar." : "Aceite os termos para continuar.";
    };
    Object.keys(rules).forEach(k => {
      v[k].addEventListener("blur", () => { if (v[k].value) touched.add(k); refresh(); });
      v[k].addEventListener("input", () => { if (k === "pass") { crit(); if (v.pass2.value) touched.add("pass2"); } if (touched.has(k) || (k === "pass2")) touched.add(k); refresh(); });
    });
    v.terms.addEventListener("change", refresh);
    bindPassToggles(f);
    f.addEventListener("submit", async e => {
      e.preventDefault(); Object.keys(rules).forEach(k => touched.add(k)); refresh();
      if ($("#su-submit").disabled) return;
      const email = v.email.value.trim().toLowerCase();
      if (S.users.some(u => u.email === email)) { $("#su-email-e").innerHTML = `${ic("alert")}<span>Este e-mail já possui conta. <a href="#/entrar?email=${encodeURIComponent(email)}" data-act="goLogin" data-email="${esc(email)}">Fazer login</a></span>`; v.email.setAttribute("aria-invalid", "true"); v.email.focus(); return; }
      const btn = $("#su-submit"); btn.disabled = true; btn.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Criando conta...`;
      await wait(700);
      S.users.push({ name: v.name.value.trim().replace(/\s+/g, " "), email, hash: await hash(email + ":" + v.pass.value), createdAt: new Date().toISOString() });
      /* Criar conta nunca troca nem abre sessão sozinha. */
      if (me()) {
        /* Já há uma conta logada: ela continua ativa e o usuário volta ao painel dela. */
        save(); toast("Conta criada. Você continua logada na conta atual.");
        go("painel");
      } else {
        /* Sem sessão ativa: segue para o login. */
        S.redirect = null; S.flash = "created"; save();
        toast("Conta criada. Entre com seu e-mail e senha para acessar.");
        location.hash = "#/entrar?email=" + encodeURIComponent(email);
      }
    });
  } });

function bindPassToggles(scope) {
  $$("[data-toggle]", scope).forEach(b => b.addEventListener("click", () => {
    const inp = $("#" + b.dataset.toggle); const show = inp.type === "password";
    inp.type = show ? "text" : "password"; b.innerHTML = ic(show ? "eyeoff" : "eye"); b.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  }));
}

/* ----- Login ----- */
const LOCK_MIN = 5;
VIEWS.entrar = (p, q) => {
  const flash = S.flash; S.flash = null; save();
  return { title: "Entrar", shell: "pub", html: `<div class="auth-wrap"><div class="card">
    <h1>Entrar</h1><p class="muted" style="margin-top:6px">Acesse para continuar suas inscrições.</p>
    ${flash === "created" ? `<div style="margin-top:16px">${notice("success", "check", "Conta criada com sucesso.", "Agora entre com o e-mail e a senha que você cadastrou.")}</div>` : ""}
    ${flash === "expired" ? `<div style="margin-top:16px">${notice("info", "lock", "Sua sessão expirou.", "Por segurança, entre novamente. Os documentos já enviados continuam salvos.")}</div>` : ""}
    <form id="f-login" class="stack" novalidate style="margin-top:22px;--gap:18px">
      <div id="login-msg" aria-live="assertive"></div>
      <div class="field"><label for="li-email">E-mail</label><input class="input" id="li-email" type="email" autocomplete="email" inputmode="email" value="${esc(q.get("email") || "")}"></div>
      <div class="field"><div class="row" style="justify-content:space-between"><label class="label" for="li-pass">Senha</label><a class="small" href="#/recuperar-senha">Esqueci minha senha</a></div>
        <div class="input-wrap"><input class="input" id="li-pass" type="password" autocomplete="current-password"><button type="button" class="toggle-pass" data-toggle="li-pass" aria-label="Mostrar senha">${ic("eye")}</button></div></div>
      <button class="btn btn-primary btn-lg btn-block" id="li-submit" type="submit">Entrar</button>
      <p class="small" style="text-align:center">Ainda não tem conta? <a href="#/criar-conta">Criar conta</a></p>
      <div class="divider">apresentação</div>
      <button type="button" class="btn btn-secondary btn-block" id="li-demo">${ic("user", "sm")}Entrar com a conta de demonstração</button>
      <p class="hint" style="text-align:center">A conta de demonstração já tem uma inscrição em andamento e outra em análise.</p>
    </form></div></div>`,
  mount() {
    const f = $("#f-login"); bindPassToggles(f);
    const msg = $("#login-msg");
    const show = html => { msg.innerHTML = html; };
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const email = $("#li-email").value.trim().toLowerCase(); const pass = $("#li-pass").value;
      if (!email || !pass) { show(notice("danger", "alert", "Informe e-mail e senha.", "")); return; }
      const att = S.attempts[email] || { count: 0, lockUntil: 0 };
      if (att.lockUntil > Date.now()) { const t = new Date(att.lockUntil); show(notice("warn", "lock", "Acesso pausado temporariamente.", `Por segurança, tente novamente após ${pad(t.getHours())}:${pad(t.getMinutes())} ou <a href="#/recuperar-senha">redefina sua senha</a>.`)); return; }
      const btn = $("#li-submit"); btn.disabled = true; btn.textContent = "Entrando...";
      await wait(500);
      const u = S.users.find(x => x.email === email);
      const ok = u && u.hash && u.hash === await hash(email + ":" + pass);
      btn.disabled = false; btn.textContent = "Entrar";
      if (!ok) {
        att.count += 1;
        if (att.count >= 5) { att.lockUntil = Date.now() + LOCK_MIN * 60000; att.count = 0; S.attempts[email] = att; save();
          show(notice("warn", "lock", "Muitas tentativas sem sucesso.", `Por segurança, o acesso foi pausado por ${LOCK_MIN} minutos. Se você esqueceu sua senha, <a href="#/recuperar-senha">redefina agora</a>.`)); return; }
        S.attempts[email] = att; save();
        show(notice("danger", "alert", "E-mail ou senha incorretos.", att.count >= 3 ? ` Após 5 tentativas, o acesso será pausado por ${LOCK_MIN} minutos.` : ""));
        $("#li-pass").value = ""; $("#li-pass").focus(); return;
      }
      delete S.attempts[email]; login(email);
    });
    $("#li-demo").addEventListener("click", () => { seedDemo(); login("ana.souza@exemplo.com"); });
  } };
};
function login(email) {
  S.session = email; const r = S.redirect; S.redirect = null; save();
  toast(`Olá, ${me().name.split(" ")[0]}!`);
  if (r && r !== "#/entrar") location.hash = r; else go("painel");
}

/* ----- Recuperação de senha ----- */
VIEWS["recuperar-senha"] = () => ({ title: "Recuperar senha", shell: "pub", html: `<div class="auth-wrap"><div class="card" id="rec-card">
  <a class="back" href="#/entrar">${ic("back", "sm")}Voltar para o login</a>
  <h1>Recuperar senha</h1><p class="muted" style="margin-top:6px">Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.</p>
  <form id="f-rec" class="stack" novalidate style="margin-top:22px;--gap:18px">
    <div class="field"><label for="rc-email">E-mail</label><input class="input" id="rc-email" type="email" autocomplete="email" aria-describedby="rc-e"><div class="field-error" id="rc-e" aria-live="polite"></div></div>
    <button class="btn btn-primary btn-lg btn-block" id="rc-submit">Enviar link de recuperação</button>
  </form></div></div>`,
  mount() {
    $("#f-rec").addEventListener("submit", async e => {
      e.preventDefault(); const em = $("#rc-email");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) { $("#rc-e").innerHTML = `${ic("alert")}<span>Digite um e-mail válido.</span>`; em.setAttribute("aria-invalid", "true"); em.focus(); return; }
      const b = $("#rc-submit"); b.disabled = true; b.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Enviando...`;
      await wait(1100);
      delete S.attempts[em.value.trim().toLowerCase()]; save();
      $("#rec-card").innerHTML = `<div class="empty" style="padding:8px 0"><div class="dot" style="background:var(--green-bg);color:var(--green)">${ic("mail", "lg")}</div>
        <h1 style="font-size:1.4rem">Verifique seu e-mail</h1>
        <p>Se houver uma conta associada a esse e-mail, você receberá as instruções para redefinir sua senha.</p>
        <p class="small">Demonstração: nenhum e-mail é enviado de verdade.</p>
        <a class="btn btn-primary" style="margin-top:18px" href="#/entrar">Voltar para o login</a></div>`;
      $("#rec-card h1").focus && $("#rec-card h1").setAttribute("tabindex", "-1"); $("#rec-card h1").focus();
    });
  } });
/* ========= Painel ========= */
VIEWS.painel = () => {
  const u = me(); const apps = myApps(); const first = u.name.split(" ")[0];
  const openEds = INST.filter(i => i.edital && edState(i.edital) === "aberto" && !apps.some(a => a.instId === i.id)).sort((a, b) => a.edital.closeDate - b.edital.closeDate);
  const edList = openEds.slice(0, 3).map(i => `<article class="card-flat inst-card"><div><div class="small muted">${esc(i.name)}</div><h3>${esc(i.edital.name)}</h3></div><div class="row">${deadline(i.edital)}<span class="spacer"></span><a class="btn btn-secondary btn-sm" href="#/instituicao/${i.id}">Ver detalhes</a></div></article>`).join("");
  if (!apps.length) return { title: "Painel", shell: "app", nav: "painel", html: `
    <div class="page-head"><h1>Olá, ${esc(first)}</h1><p class="muted" style="margin-top:4px">Comece escolhendo a instituição em que você quer se inscrever.</p></div>
    ${empty("inbox", "Você ainda não possui inscrições.", "Encontre um edital aberto e o BolsaTech monta a lista de documentos que você precisa reunir.", `<a class="btn btn-primary btn-lg" href="#/buscar">${ic("search", "sm")}Encontrar editais</a>`)}
    <div class="section-title"><h2>Editais disponíveis</h2><a class="small" href="#/buscar">Ver todos</a></div>
    <div class="grid grid-3">${edList}</div>` };
  const drafts = apps.filter(a => a.status === "rascunho");
  const pendDocs = []; drafts.forEach(a => appEdital(a).required.forEach(id => { const st = docState(a, id).status; if (st !== "enviado") pendDocs.push({ a, id, st }); }));
  const alerts = [];
  apps.filter(a => a.status === "reenvio").forEach(a => alerts.push(notice("warn", "alert", `${esc(instById(a.instId).name)} solicitou o reenvio de um documento.`, `${esc(DOCS[a.pendency.docId].name)}. <a href="#/acompanhar/${a.id}">Ver pendência</a>`)));
  drafts.forEach(a => { const ed = appEdital(a); const n = dayDiff(ed.closeDate); const miss = ed.required.length - requiredDone(a);
    if (edState(ed) === "aberto" && n <= 7 && miss > 0) alerts.push(notice("warn", "calendar", `${esc(ed.name)}: o prazo encerra em ${plural(n, "dia", "dias")}.`, `${miss === 1 ? "Falta" : "Faltam"} ${plural(miss, "documento obrigatório", "documentos obrigatórios")}. <a href="#/inscricao/${a.id}">Continuar documentação</a>`)); });
  const nextDead = drafts.map(a => appEdital(a)).filter(ed => edState(ed) === "aberto").sort((a, b) => a.closeDate - b.closeDate)[0];
  return { title: "Painel", shell: "app", nav: "painel", html: `
    <div class="page-head row" style="justify-content:space-between"><div><h1>Olá, ${esc(first)}</h1><p class="muted" style="margin-top:4px">Aqui está o andamento das suas inscrições.</p></div>
      <a class="btn btn-primary" href="#/buscar">${ic("search", "sm")}Buscar instituições</a></div>
    ${alerts.length ? `<div class="stack" style="--gap:10px;margin-bottom:20px">${alerts.join("")}</div>` : ""}
    <div class="stats">
      <div class="stat"><b>${apps.filter(a => !["deferido", "indeferido"].includes(a.status)).length}</b><span>Inscrições em andamento</span></div>
      <div class="stat"><b>${pendDocs.length}</b><span>Documentos pendentes</span></div>
      <div class="stat"><b>${nextDead ? fmtDate(nextDead.closeDate).slice(0, 5) : "–"}</b><span>${nextDead ? `Próximo prazo, ${esc(instById(nextDead.instId).name)}` : "Nenhum prazo próximo"}</span></div>
    </div>
    <div class="section-title"><h2>Minhas inscrições</h2><a class="small" href="#/inscricoes">Ver todas</a></div>
    <div class="grid grid-2">${apps.slice(0, 4).map(appCard).join("")}</div>
    <div class="section-title"><h2>Documentos pendentes</h2><a class="small" href="#/faltantes">Ver todos com o assistente</a></div>
    ${pendDocs.length ? `<div class="doc-list">${pendDocs.slice(0, 6).map(({ a, id, st }) => `<div class="doc-row">${statusDot(st)}<div class="body"><div class="name">${esc(DOCS[id].name)}</div><div class="desc">${esc(instById(a.instId).name)}</div></div><div class="act">${docBadge(st)}<a class="btn btn-secondary btn-sm" href="#/documento/${a.id}/${id}">${st === "pendente" ? "Enviar documento" : "Corrigir documento"}</a></div></div>`).join("")}</div>`
      : `<div class="card-flat row">${ic("check")}<span>Nenhum documento pendente nas inscrições em preenchimento.</span></div>`}
    ${edList ? `<div class="section-title"><h2>Editais disponíveis</h2><a class="small" href="#/buscar">Ver todos</a></div><div class="grid grid-3">${edList}</div>` : ""}` };
};

VIEWS.inscricoes = () => {
  const apps = myApps();
  return { title: "Minhas inscrições", shell: "app", nav: "inscricoes", html: `<div class="page-head"><h1>Minhas inscrições</h1><p class="muted" style="margin-top:4px">Continue de onde parou ou acompanhe as inscrições enviadas.</p></div>
    ${apps.length ? `<div class="grid grid-2">${apps.map(appCard).join("")}</div>` : empty("inbox", "Você ainda não possui inscrições.", "Escolha um edital aberto para começar a reunir seus documentos.", `<a class="btn btn-primary" href="#/buscar">Encontrar editais</a>`)}` };
};

/* ========= Busca de instituições (RF03) ========= */
const searchState = { q: "", city: "", forma: "", sort: "prazo" };
function filterInst() {
  const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  let list = INST.filter(i => (!searchState.q || norm(i.name).includes(norm(searchState.q))) && (!searchState.city || i.city === searchState.city) && (!searchState.forma || (i.edital && i.edital.forma === searchState.forma)));
  const rank = i => ({ aberto: 0, futuro: 1, encerrado: 2, none: 3 }[edState(i.edital)]);
  list.sort(searchState.sort === "nome" ? (a, b) => a.name.localeCompare(b.name, "pt-BR") : (a, b) => rank(a) - rank(b) || (a.edital && b.edital ? a.edital.closeDate - b.edital.closeDate : 0));
  return list;
}
function instCard(i) {
  const ed = i.edital;
  return `<article class="card inst-card">
    <div class="row" style="align-items:flex-start;justify-content:space-between"><div><h3>${esc(i.name)}</h3><div class="meta" style="margin-top:4px"><span>${ic("pin", "sm")}${esc(i.city)}, ${i.uf}</span></div></div>${edSeal(ed)}</div>
    ${ed ? `<div class="meta"><span>${ic("file", "sm")}${esc(ed.name)}</span><span>${ic("building", "sm")}${esc(ed.forma)}</span></div><p class="small">${esc(deadlineText(ed))}</p>` : `<p class="small muted">Nenhum processo seletivo com inscrições abertas no momento.</p>`}
    <div><a class="btn btn-secondary btn-sm" href="#/instituicao/${i.id}">Ver detalhes</a></div></article>`;
}
VIEWS.buscar = () => {
  const cities = [...new Set(INST.map(i => i.city))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const opt = (v, cur) => `<option value="${esc(v)}" ${v === cur ? "selected" : ""}>${esc(v)}</option>`;
  return { title: "Buscar instituições", shell: "app", nav: "buscar", html: `
    <div class="page-head"><h1>Buscar instituições</h1><p class="muted" style="margin-top:4px">Encontre editais abertos e veja os documentos exigidos por cada um.</p></div>
    <form class="card" id="f-search" role="search">
      <div class="filters">
        <div class="field"><label for="fs-q">Nome da instituição</label><input class="input" id="fs-q" value="${esc(searchState.q)}" placeholder="Ex.: Universidade Comunitária"></div>
        <div class="field"><label for="fs-city">Cidade</label><select class="select" id="fs-city"><option value="">Todas</option>${cities.map(c => opt(c, searchState.city)).join("")}</select></div>
        <div class="field"><label for="fs-forma">Forma de ingresso</label><select class="select" id="fs-forma"><option value="">Todas</option>${FORMAS.map(c => opt(c, searchState.forma)).join("")}</select></div>
        <div class="field"><label for="fs-sort">Ordenar por</label><select class="select" id="fs-sort"><option value="prazo" ${searchState.sort === "prazo" ? "selected" : ""}>Prazo de encerramento</option><option value="nome" ${searchState.sort === "nome" ? "selected" : ""}>Nome da instituição</option></select></div>
      </div>
      <div class="filter-actions"><button class="btn btn-primary" type="submit">${ic("search", "sm")}Aplicar filtros</button><button class="btn btn-ghost" type="button" id="fs-clear">Limpar filtros</button></div>
    </form>
    <p class="xs muted" style="margin-top:10px">Instituições e editais fictícios, criados para demonstração.</p>
    <div id="results" aria-live="polite" style="margin-top:18px"></div>`,
  mount() {
    const box = $("#results"); let t;
    const show = async (loading = true) => {
      if (loading) { box.innerHTML = `<p class="small muted" style="margin-bottom:12px;display:flex;gap:8px;align-items:center"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span>Carregando instituições...</p><div class="grid grid-2">${skeletonCards(4)}</div>`; await new Promise(r => (t = setTimeout(r, 450))); }
      const list = filterInst();
      box.innerHTML = list.length ? `<p class="small muted" style="margin-bottom:12px">${plural(list.length, "instituição encontrada", "instituições encontradas")}</p><div class="grid grid-2">${list.map(instCard).join("")}</div>`
        : `<div class="card empty"><div class="dot">${ic("search", "lg")}</div><h2>Nenhuma instituição encontrada.</h2><ul class="small muted" style="text-align:left;display:inline-block;margin:12px auto 0;padding-left:18px"><li>Verifique a grafia do nome.</li><li>Tente outra cidade.</li><li>Remova ou altere os filtros.</li></ul><div style="margin-top:16px"><button class="btn btn-primary" id="fs-clear2">Limpar filtros</button></div></div>`;
      const c2 = $("#fs-clear2"); c2 && c2.addEventListener("click", clear);
    };
    const read = () => { searchState.q = $("#fs-q").value.trim(); searchState.city = $("#fs-city").value; searchState.forma = $("#fs-forma").value; searchState.sort = $("#fs-sort").value; };
    const clear = () => { Object.assign(searchState, { q: "", city: "", forma: "", sort: "prazo" }); $("#fs-q").value = ""; $("#fs-city").value = ""; $("#fs-forma").value = ""; $("#fs-sort").value = "prazo"; show(); };
    $("#f-search").addEventListener("submit", e => { e.preventDefault(); read(); show(); });
    $("#fs-clear").addEventListener("click", clear);
    show();
    return () => clearTimeout(t);
  } };
};

/* ========= Detalhes da instituição e do edital ========= */
VIEWS.instituicao = ([id]) => {
  const i = instById(id); if (!i) return VIEWS.naoEncontrada();
  const ed = i.edital; const st = edState(ed); const app = ed && myApps().find(a => a.instId === i.id);
  let action;
  if (app) action = app.status === "rascunho" ? `<a class="btn btn-primary btn-lg" href="#/inscricao/${app.id}">Continuar documentação</a>` : `<a class="btn btn-primary btn-lg" href="#/acompanhar/${app.id}">Acompanhar inscrição</a>`;
  else if (st === "aberto") action = `<button class="btn btn-primary btn-lg" id="start">Iniciar documentação</button>`;
  else action = `<button class="btn btn-primary btn-lg" disabled aria-describedby="why-closed">Iniciar documentação</button>`;
  const why = !app && st !== "aberto" ? notice("neutral", "info", st === "futuro" ? `As inscrições abrem em ${fmtDate(ed.openDate)}.` : "Não há edital aberto para esta instituição no momento.", st === "futuro" ? " Volte nessa data para iniciar sua documentação." : st === "encerrado" ? ` O último edital encerrou em ${fmtDate(ed.closeDate)}.` : " Acompanhe a página da instituição para saber de novos processos seletivos.") : "";
  const docLi = ids => ids.map(d => `<li class="row small" style="gap:8px">${ic("file", "sm")}${esc(DOCS[d].name)}</li>`).join("");
  return { title: i.name, shell: "app", nav: "buscar", html: `
    <a class="back" href="#/buscar">${ic("back", "sm")}Voltar à busca</a>
    <div class="page-head"><div class="eyebrow-inst">${esc(i.city)}, ${i.uf}</div><h1>${esc(i.name)}</h1><p class="muted" style="margin-top:6px">${esc(i.about)}</p></div>
    ${ed ? `<section class="card stack" style="--gap:18px">
      <div class="row" style="justify-content:space-between;align-items:flex-start"><div><h2>${esc(ed.name)}</h2><p class="muted small" style="margin-top:4px">${esc(ed.summary)}</p></div>${edSeal(ed)}</div>
      <dl class="kv"><div><dt>Forma de ingresso</dt><dd>${esc(ed.forma)}</dd></div><div><dt>Período de inscrição</dt><dd>${fmtDate(ed.openDate)} a ${fmtDate(ed.closeDate)}</dd></div></dl>
      <div>${deadline(ed)}</div>
      <div class="grid grid-2"><div><h3>Documentos obrigatórios (${ed.required.length})</h3><ul style="list-style:none;padding:0;margin:10px 0 0;display:grid;gap:8px">${docLi(ed.required)}</ul></div>
        ${ed.optional.length ? `<div><h3>Documentos opcionais (${ed.optional.length})</h3><ul style="list-style:none;padding:0;margin:10px 0 0;display:grid;gap:8px">${docLi(ed.optional)}</ul></div>` : ""}</div>
      <div id="why-closed">${why}</div>
      <div class="row">${action}<button class="btn btn-ghost" data-act="edLink">${ic("ext", "sm")}Ver edital oficial</button></div>
    </section>` : `<section class="card stack">${notice("neutral", "info", "Não há edital aberto para esta instituição no momento.", " Acompanhe a página da instituição para saber de novos processos seletivos.")}<div class="row"><button class="btn btn-primary btn-lg" disabled>Iniciar documentação</button><a class="btn btn-secondary" href="#/buscar">Buscar outras instituições</a></div></section>`}`,
  mount() {
    const b = $("#start"); if (!b) return;
    b.addEventListener("click", () => {
      if (edState(ed) !== "aberto") { toast("O prazo deste edital terminou.", "error"); render(); return; }
      const nid = "ap-" + uid();
      S.apps[nid] = { id: nid, owner: S.session, instId: i.id, createdAt: new Date().toISOString(), status: "rascunho", docs: {}, timeline: [] };
      save(); toast("Inscrição iniciada. Seu checklist está pronto."); go("inscricao/" + nid);
    });
  } };
};

/* ========= Checklist (RF04 / RF06) ========= */
const getApp = id => { const a = S.apps[id]; return a && a.owner === S.session ? a : null; };
function blockReason(app) {
  const ed = appEdital(app);
  if (edState(ed) === "encerrado") return "O prazo do edital terminou. Não é possível enviar a inscrição.";
  const missing = ed.required.filter(id => docState(app, id).status === "pendente").length;
  const fix = ed.required.filter(id => ["pendencia", "rejeitado", "analise"].includes(docState(app, id).status)).length;
  if (!missing && !fix) return "";
  const parts = [];
  if (missing) parts.push(`${missing === 1 ? "Falta" : "Faltam"} ${plural(missing, "documento obrigatório", "documentos obrigatórios")}`);
  if (fix) parts.push(`${plural(fix, "documento precisa", "documentos precisam")} de correção`);
  return parts.join(" e ") + " para continuar.";
}
function docRow(app, id, locked) {
  const d = docDef(id); const s = docState(app, id); const st = s.status;
  const label = locked ? "Visualizar documento" : st === "pendente" ? "Enviar documento" : ["pendencia", "rejeitado"].includes(st) ? "Corrigir documento" : "Visualizar documento";
  const cls = !locked && st !== "enviado" ? "btn-primary" : "btn-secondary";
  const issue = (s.checks || []).find(c => c.result === "fail") || (s.checks || []).find(c => c.result === "warn");
  const pend = app.pendency && app.pendency.docId === id && app.status === "reenvio";
  return `<div class="doc-row">${statusDot(st)}
    <div class="body"><div class="name">${esc(d.name)}</div><div class="desc">${esc(d.short)}</div></div>
    <div class="act">${docBadge(st)}${(!locked || s.file) ? `<a class="btn ${cls} btn-sm" href="#/documento/${app.id}/${id}">${label}</a>` : ""}</div>
    ${pend ? `<div class="note">${notice("warn", "alert", "Reenvio solicitado pela instituição.", " " + esc(app.pendency.reason))}</div>` : ["pendencia", "rejeitado"].includes(st) && issue ? `<div class="note">${notice(st === "rejeitado" ? "danger" : "warn", "alert", esc(issue.label) + ":", " " + esc(issue.detail))}</div>` : ""}
  </div>`;
}
VIEWS.inscricao = ([id]) => {
  const app = getApp(id); if (!app) return VIEWS.naoEncontrada();
  const inst = instById(app.instId); const ed = inst.edital; const locked = app.status !== "rascunho";
  const done = requiredDone(app); const total = ed.required.length;
  const missing = ed.required.filter(x => docState(app, x).status === "pendente").length;
  const fix = ed.required.filter(x => ["pendencia", "rejeitado"].includes(docState(app, x).status)).length;
  const reason = blockReason(app);
  return { title: "Checklist de documentos", shell: "app", nav: "inscricoes", actionBar: !locked, html: `
    <a class="back" href="#/inscricoes">${ic("back", "sm")}Minhas inscrições</a>
    <div class="page-head"><div class="eyebrow-inst">${esc(inst.name)}</div><h1>${esc(ed.name)}</h1></div>
    <div class="sticky-dead">${locked ? `<span class="deadline">${ic("lock", "sm")}Inscrição enviada em ${fmtDate(app.submittedAt)}</span>` : deadline(ed)}</div>
    ${locked ? `<div style="margin-bottom:16px">${notice("info", "lock", `Inscrição enviada. Protocolo ${esc(app.protocol)}.`, ` Os documentos estão bloqueados para alteração. <a href="#/acompanhar/${app.id}">Acompanhar inscrição</a>`)}</div>` : ""}
    <section class="card progress-card stack" style="--gap:12px" aria-labelledby="prog-t">
      <div class="row" style="justify-content:space-between"><h2 id="prog-t" style="font-size:1.05rem">${done} de ${total} documentos obrigatórios enviados</h2><span class="small muted">${Math.round((done / total) * 100)}% concluído</span></div>
      ${segs(app)}
      <div class="legend small">${missing ? `<span class="badge s-gray">${ic("circle")}${plural(missing, "pendente", "pendentes")}</span>` : ""}${fix ? `<span class="badge s-orange">${ic("alert")}${plural(fix, "precisa", "precisam")} de correção</span>` : ""}${done ? `<span class="badge s-green">${ic("check")}${plural(done, "enviado", "enviados")}</span>` : ""}</div>
    </section>
    <div class="section-title"><h2>Documentos obrigatórios</h2></div>
    <div class="doc-list">${ed.required.map(x => docRow(app, x, isLocked(app, x))).join("")}</div>
    ${ed.optional.length ? `<div class="section-title"><h2>Documentos opcionais</h2><span class="small muted">Não impedem o envio da inscrição</span></div><div class="doc-list">${ed.optional.map(x => docRow(app, x, isLocked(app, x))).join("")}</div>` : ""}
    ${!locked ? `<div class="card-flat row ai-strip" style="margin-top:20px"><span class="ai-mark sm" aria-hidden="true">${ic("spark", "sm")}</span><div style="flex:1;min-width:200px"><b>Assistente BolsaTech</b><div class="small muted">Peça à IA um resumo dos documentos que faltam nesta inscrição.</div></div><a class="btn btn-primary btn-sm" href="#/faltantes?app=${app.id}">Ver o que falta</a></div><div class="card-flat row" style="margin-top:10px">${ic("layers")}<div style="flex:1;min-width:200px"><b>Precisa juntar vários arquivos em um único PDF?</b><div class="small muted">Use somente se o edital permitir o envio conjunto.</div></div><a class="btn btn-secondary btn-sm" href="#/pdf?alvo=${app.id}">Unir PDFs</a></div>
    <div class="action-bar"><div class="reason" id="block-reason">${reason ? esc(reason) : `${ic("check", "sm")} Todos os obrigatórios foram enviados.`}</div>
      <a class="btn btn-primary" href="#/revisao/${app.id}" ${reason ? 'aria-disabled="true" tabindex="-1" data-blocked' : ""} aria-describedby="block-reason">Revisar e enviar inscrição</a></div>` : ""}`,
  mount() { const b = $("[data-blocked]"); b && b.addEventListener("click", e => { e.preventDefault(); toast(reason, "error"); }); } };
};
/* ========= Pré-análise documental ========= */
const normExt = e => (e === "jpeg" ? "jpg" : e);
function acceptAttr(def) { return def.formats.map(f => f === "pdf" ? ".pdf,application/pdf" : f === "jpg" ? ".jpg,.jpeg,image/jpeg" : ".png,image/png").join(","); }
const fmtList = def => { const u = def.formats.map(f => f.toUpperCase()); return u.length > 1 ? u.slice(0, -1).join(", ") + " ou " + u[u.length - 1] : u[0]; };
function validateSelection(file, def) {
  const ext = normExt(extOf(file.name));
  if (!def.formats.includes(ext)) return `Formato não permitido. Envie um arquivo ${fmtList(def)}.`;
  if (file.size === 0) return "O arquivo está vazio. Selecione outro arquivo.";
  if (file.size > MAX_SIZE) return `Arquivo maior que 5 MB (${fmtSize(file.size)}). Reduza o tamanho${def.formats.includes("pdf") ? " ou envie em PDF" : ""}.`;
  return "";
}
function sniff(b) {
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "pdf";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  return null;
}
const readDataURL = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

async function analyzeFile(file, def, onStep, ctx) {
  const checks = []; const meta = {}; let dataUrl = null;
  const step = async c => { if (ctx.dead) throw new Error("dead"); checks.push(c); onStep(checks.slice()); await wait(420); };
  const ext = normExt(extOf(file.name));
  onStep([]); await wait(350);
  await step({ label: "Formato e tamanho permitidos", result: "ok", detail: `${ext.toUpperCase()}, ${fmtSize(file.size)}` });
  const kind = sniff(new Uint8Array(await file.slice(0, 8).arrayBuffer()));
  if (kind !== ext) {
    await step({ label: "Arquivo íntegro e acessível", result: "fail", detail: kind ? `O conteúdo é de um arquivo ${kind.toUpperCase()}, mas a extensão é .${extOf(file.name)}. Salve o arquivo novamente no formato correto.` : "Não foi possível ler o conteúdo. O arquivo pode estar corrompido ou ter sido renomeado." });
    return finish();
  }
  await step({ label: "Arquivo íntegro e acessível", result: "ok", detail: "O conteúdo corresponde ao formato informado." });
  if (kind === "pdf") {
    if (!window.PDFLib) { await step({ label: "Leitura das páginas", result: "skip", detail: "Verificação indisponível no momento. A instituição fará a conferência." }); return finish(); }
    try {
      const pdf = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const n = pdf.getPageCount(); meta.pages = n;
      if (!n) { await step({ label: "Leitura das páginas", result: "fail", detail: "O PDF não possui páginas. Gere o arquivo novamente." }); return finish(); }
      await step({ label: "Leitura das páginas", result: "ok", detail: `${plural(n, "página encontrada", "páginas encontradas")}.` });
      await step(def.maxPages && n > def.maxPages
        ? { label: "Compatível com o documento solicitado", result: "warn", detail: `O arquivo tem ${n} páginas; este documento costuma ter até ${def.maxPages}. Confira se você enviou o arquivo certo.` }
        : { label: "Compatível com o documento solicitado", result: "ok", detail: "Quantidade de páginas dentro do esperado." });
    } catch (e) {
      if (e.message === "dead") throw e;
      await step(/encrypt/i.test(String(e && e.message))
        ? { label: "Arquivo sem proteção por senha", result: "fail", detail: "O PDF está protegido por senha. Remova a proteção e envie novamente." }
        : { label: "Leitura das páginas", result: "fail", detail: "Não foi possível analisar este arquivo. Tente enviá-lo novamente." });
    }
    return finish();
  }
  try {
    dataUrl = await readDataURL(file); const img = await loadImg(dataUrl);
    meta.width = img.naturalWidth; meta.height = img.naturalHeight; meta.pages = 1;
    const c = document.createElement("canvas"); c.width = 48; c.height = 48; const g = c.getContext("2d"); g.drawImage(img, 0, 0, 48, 48);
    const px = g.getImageData(0, 0, 48, 48).data; let sum = 0, sq = 0; const n = px.length / 4;
    for (let k = 0; k < px.length; k += 4) { const l = 0.299 * px[k] + 0.587 * px[k + 1] + 0.114 * px[k + 2]; sum += l; sq += l * l; }
    const mean = sum / n; const sd = Math.sqrt(Math.max(0, sq / n - mean * mean));
    if (sd < 6) await step({ label: "Presença de conteúdo legível", result: "fail", detail: mean > 200 ? "A imagem parece estar em branco. Fotografe o documento novamente." : "A imagem está escura demais para leitura. Fotografe em um local mais iluminado." });
    else if (Math.min(meta.width, meta.height) < 700) await step({ label: "Legibilidade", result: "warn", detail: `Resolução baixa (${meta.width} × ${meta.height} px). O arquivo parece estar ilegível; envie uma versão com melhor qualidade.` });
    else await step({ label: "Presença de conteúdo legível", result: "ok", detail: `Resolução adequada (${meta.width} × ${meta.height} px).` });
  } catch (e) {
    if (e.message === "dead") throw e;
    await step({ label: "Legibilidade", result: "skip", detail: "Não foi possível verificar a imagem automaticamente. A instituição fará a conferência." });
  }
  if (!checks.some(c => c.result === "fail")) await step({ label: "Compatível com o documento solicitado", result: "ok", detail: "Formato de imagem aceito para este documento." });
  return finish();
  function finish() {
    const status = checks.some(c => c.result === "fail") ? "rejeitado" : checks.some(c => c.result === "warn") ? "pendencia" : "enviado";
    return { status, checks, meta, dataUrl };
  }
}
const CHECK_UI = { ok: ["s-green", "check"], warn: ["s-orange", "alert"], fail: ["s-red", "x"], skip: ["s-gray", "info"] };
const checksList = (checks, running) => `<ul class="checks">${checks.map(c => `<li><span class="dot ${CHECK_UI[c.result][0]}" aria-hidden="true">${ic(CHECK_UI[c.result][1])}</span><div><div class="t">${esc(c.label)} <span class="sr-only">(${{ ok: "aprovado", warn: "atenção", fail: "problema", skip: "não verificado" }[c.result]})</span></div><div class="d">${esc(c.detail)}</div></div></li>`).join("")}${running ? `<li><span class="spinner" style="width:26px;height:26px"></span><div class="t muted">Verificando...</div></li>` : ""}</ul>`;
function thumbHtml(key, f) {
  if (!f) return `<div class="thumb">${ic("file", "lg")}</div>`;
  if (previewStore.has(key)) return `<div class="thumb"><img src="${previewStore.get(key)}" alt=""></div>`;
  if (extOf(f.name) === "pdf") return `<div class="thumb pdf">${ic("doc2")}PDF</div>`;
  return `<div class="thumb">${ic("file", "lg")}</div>`;
}
function previewModal(key, f) {
  let body;
  if (previewStore.has(key)) body = `<div class="preview-box"><img src="${previewStore.get(key)}" alt="Pré-visualização de ${esc(f.name)}"></div>`;
  else if (fileStore.has(key)) { const url = URL.createObjectURL(fileStore.get(key)); body = `<div class="preview-box"><object data="${url}" type="application/pdf" aria-label="Pré-visualização de ${esc(f.name)}"><p class="muted small" style="padding:24px;text-align:center">Este navegador não exibe PDFs aqui. Baixe o arquivo para conferir o conteúdo.</p></object></div>`; }
  else body = `<div class="preview-box"><div class="empty"><div class="dot">${ic("file", "lg")}</div><p>${f.demo ? "Arquivo de exemplo da conta de demonstração. A pré-visualização fica disponível para arquivos enviados por você." : "A pré-visualização fica disponível na sessão em que o arquivo foi enviado. Nesta demonstração os arquivos não são guardados em servidor."}</p></div></div>`;
  openModal({ title: esc(f.name), wide: true, body: `${body}<p class="small muted" style="margin-top:10px">${fmtSize(f.size)}${f.pages ? `, ${plural(f.pages, "página", "páginas")}` : ""}</p>`, actions: [{ label: "Fechar", cls: "btn-primary", onClick: closeModal }] });
}

/* ========= Detalhe do documento e envio (RF05 / RF07) ========= */
VIEWS.documento = ([appId, docId]) => {
  const app = getApp(appId); if (!app || !DOCS[docId]) return VIEWS.naoEncontrada();
  const def = docDef(docId); const inst = instById(app.instId); const ed = inst.edital; const key = `${appId}:${docId}`;
  const locked = isLocked(app, docId); const reenvio = app.status === "reenvio" && app.pendency && app.pendency.docId === docId;
  const closed = app.status === "rascunho" && edState(ed) === "encerrado";
  const required = ed.required.includes(docId);
  return { title: def.name, shell: "app", nav: "inscricoes", html: `
    <a class="back" href="#/${app.status === "rascunho" ? "inscricao" : "acompanhar"}/${appId}">${ic("back", "sm")}${app.status === "rascunho" ? "Voltar ao checklist" : "Voltar ao acompanhamento"}</a>
    <div class="page-head"><div class="eyebrow-inst">${esc(inst.name)}, ${required ? "documento obrigatório" : "documento opcional"}</div>
      <div class="row" style="justify-content:space-between"><h1>${esc(def.name)}</h1><span id="doc-badge">${docBadge(docState(app, docId).status)}</span></div></div>
    <div class="sticky-dead">${deadline(ed)}</div>
    ${reenvio ? `<div style="margin-bottom:16px">${notice("warn", "alert", "A instituição solicitou o reenvio deste documento.", " " + esc(app.pendency.reason) + " Apenas este documento foi liberado para correção.")}</div>` : ""}
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start">
      <section class="card stack" aria-labelledby="sobre-t" style="--gap:16px">
        <h2 id="sobre-t">Sobre este documento</h2>
        <dl class="info-list">
          <div><dt>Para que serve</dt><dd>${esc(def.purpose)}</dd></div>
          <div><dt>Como obter</dt><dd>${esc(def.how)}</dd></div>
          ${def.issuer ? `<div><dt>Órgão emissor</dt><dd><a href="${def.issuer.url}" target="_blank" rel="noopener">${esc(def.issuer.label)} ${ic("ext", "sm")}</a></dd></div>` : ""}
          <div><dt>Formatos e tamanho</dt><dd>Formatos aceitos: ${fmtList(def)}. Tamanho máximo: 5 MB.</dd></div>
          <div><dt>Para garantir a legibilidade</dt><dd><ul style="margin:4px 0 0;padding-left:18px"><li>Fotografe em local iluminado, sem sombras ou reflexos.</li><li>Enquadre o documento inteiro, com as bordas visíveis.</li><li>Prefira o PDF original quando o documento for digital.</li></ul></dd></div>
        </dl>
      </section>
      <section class="card stack" aria-labelledby="envio-t" style="--gap:16px">
        <h2 id="envio-t">Arquivo enviado</h2>
        <div id="up" aria-live="polite"></div>
        <input type="file" id="fi" class="sr-only" tabindex="-1" accept="${acceptAttr(def)}" aria-hidden="true">
        <input type="file" id="fc" class="sr-only" tabindex="-1" accept="image/*" capture="environment" aria-hidden="true">
        <p class="xs muted">A pré-análise é uma verificação preliminar e não garante a aprovação. Os documentos ainda serão avaliados pela instituição responsável.</p>
      </section>
    </div>`,
  mount() {
    const ctx = { phase: "idle", progress: 0, error: "", checks: [], dead: false, cancel: false, file: null };
    const up = $("#up");
    const canEdit = !locked && !closed;
    const dropzone = () => `
      ${ctx.error ? `<div style="margin-bottom:12px">${notice("danger", "alert", esc(ctx.error), "")}</div>` : ""}
      <div class="dropzone" id="dz">
        <div class="dz-icon">${ic("upload", "lg")}</div>
        <b>Arraste o arquivo para cá</b><div class="small muted">ou escolha uma das opções abaixo</div>
        <div class="dz-actions"><button class="btn btn-primary" data-a="pick">${ic("file", "sm")}Selecionar arquivo</button>${def.formats.some(f => f !== "pdf") ? `<button class="btn btn-secondary" data-a="cam">${ic("camera", "sm")}Tirar foto</button>` : ""}</div>
        <div class="formats">${ic("info", "sm")}Formatos aceitos: ${fmtList(def)}. Tamanho máximo: 5 MB.</div>
      </div>
      ${def.formats.includes("pdf") ? `<p class="small" style="margin-top:12px">Tem vários arquivos? <a href="#/pdf?alvo=${appId}&doc=${docId}">Unir PDFs em um só</a></p>` : ""}`;
    const draw = () => {
      if (ctx.dead) return;
      const s = docState(app, docId);
      if (ctx.phase === "uploading") {
        up.innerHTML = `<div class="stack" style="--gap:10px"><div class="file-card"><div class="thumb">${ic("upload", "lg")}</div><div style="flex:1;min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis">${esc(ctx.file.name)}</b><span class="small muted">Enviando documento... ${ctx.progress}%</span></div></div>
          <div class="bar" role="progressbar" aria-label="Progresso do envio" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${ctx.progress}"><span style="width:${ctx.progress}%"></span></div>
          <div><button class="btn btn-ghost btn-sm" data-a="cancel">${ic("x", "sm")}Cancelar envio</button></div></div>`; return;
      }
      if (ctx.phase === "analyzing") {
        up.innerHTML = `<div class="stack" style="--gap:14px"><div class="row"><span class="spinner lg"></span><div><b>Estamos analisando seu documento</b><div class="small muted">Isso leva poucos segundos.</div></div></div>${checksList(ctx.checks, true)}</div>`; return;
      }
      if (!s.file) { up.innerHTML = canEdit ? dropzone() : notice("neutral", "lock", closed ? "O prazo do edital terminou." : "Documento não enviado.", closed ? " Não é possível enviar novos arquivos." : " A inscrição foi enviada sem este documento opcional."); bindDz(); return; }
      const f = s.file; const fail = s.checks && s.checks.find(c => c.result === "fail"); const warn = s.checks && s.checks.find(c => c.result === "warn");
      const head = s.status === "enviado" ? notice("success", "check", "Pré-análise concluída: documento aparentemente válido.", s.note ? " " + esc(s.note) : "")
        : s.status === "pendencia" && reenvio && !warn ? notice("warn", "alert", "Envie um novo arquivo para corrigir a pendência.", "")
        : s.status === "pendencia" ? notice("warn", "alert", `Atenção: ${warn ? (warn.label === "Legibilidade" ? "verifique a legibilidade" : "confira o arquivo") : "verifique o documento"}.`, " Substitua o arquivo ou confirme que ele está correto.")
        : notice("danger", "x", fail && /analisar/.test(fail.detail) ? "Não foi possível analisar este arquivo. Tente enviá-lo novamente." : "Arquivo rejeitado na pré-análise.", fail ? " " + esc(fail.detail) : "");
      up.innerHTML = `<div class="stack" style="--gap:16px">${ctx.error ? notice("danger", "alert", esc(ctx.error), "") : ""}${head}
        <div class="file-card">${thumbHtml(key, f)}<div style="flex:1;min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(f.name)}</b><span class="small muted">${fmtSize(f.size)}${f.pages ? `, ${plural(f.pages, "página", "páginas")}` : ""}${s.analyzedAt ? `<br>Enviado em ${fmtDateTime(s.analyzedAt)}` : ""}</span></div></div>
        <div class="file-actions">
          <button class="btn btn-secondary btn-sm" data-a="view">${ic("expand", "sm")}Visualizar em tamanho maior</button>
          ${canEdit ? `<button class="btn btn-secondary btn-sm" data-a="pick">${ic("refresh", "sm")}Substituir arquivo</button>` : ""}
          ${fileStore.has(key) ? `<button class="btn btn-secondary btn-sm" data-a="dl" data-needs-download>${ic("download", "sm")}Baixar</button>` : ""}
          ${canEdit ? `<button class="btn btn-danger btn-sm" data-a="del">${ic("trash", "sm")}Excluir</button>` : ""}
        </div>
        ${s.status === "pendencia" && warn && canEdit ? `<div class="card-flat row"><div style="flex:1;min-width:200px" class="small">Conferiu o arquivo e ele está legível e correto?</div><button class="btn btn-secondary btn-sm" data-a="keep">Manter este arquivo</button></div>` : ""}
        ${s.checks ? `<details ${s.status !== "enviado" ? "open" : ""}><summary class="small" style="cursor:pointer;font-weight:650">Resultado da pré-análise</summary><div style="margin-top:12px">${checksList(s.checks, false)}</div></details>` : ""}
        ${s.status === "enviado" && app.status === "rascunho" ? `<a class="btn btn-primary" href="#/inscricao/${appId}">Voltar ao checklist</a>` : ""}
      </div>`;
    };
    function bindDz() {
      const dz = $("#dz"); if (!dz) return;
      ["dragenter", "dragover"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("over"); }));
      ["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("over"); }));
      dz.addEventListener("drop", e => { const f = e.dataTransfer.files[0]; if (f) processFile(f); });
    }
    async function processFile(file) {
      ctx.error = validateSelection(file, def);
      if (ctx.error) { draw(); return; }
      ctx.file = file; ctx.phase = "uploading"; ctx.progress = 0; ctx.cancel = false; draw();
      while (ctx.progress < 100) { await wait(90); if (ctx.dead) return; if (ctx.cancel) { ctx.phase = "idle"; draw(); toast("Envio cancelado."); return; } ctx.progress = Math.min(100, ctx.progress + 6 + Math.round(Math.random() * 10)); draw(); }
      if (!navigator.onLine) { ctx.phase = "idle"; ctx.error = "Não foi possível enviar o arquivo. Verifique sua conexão e tente novamente."; draw(); return; }
      ctx.phase = "analyzing"; ctx.checks = []; $("#doc-badge").innerHTML = docBadge("analise"); draw();
      let res;
      try { res = await analyzeFile(file, def, c => { ctx.checks = c; draw(); }, ctx); } catch (e) { return; }
      fileStore.set(key, file); if (res.dataUrl) previewStore.set(key, res.dataUrl); else previewStore.delete(key);
      app.docs[docId] = { status: res.status, file: { name: file.name, size: file.size, type: file.type, ...res.meta }, checks: res.checks, analyzedAt: new Date().toISOString() };
      if (reenvio && res.status === "enviado") {
        app.status = "analise"; app.timeline.push({ date: new Date().toISOString(), label: "Documento reenviado", detail: `${def.name} reenviado após solicitação da instituição.` }); app.pendency = null;
        save(); toast("Documento reenviado. A inscrição voltou para análise."); go("acompanhar/" + appId); return;
      }
      save(); ctx.phase = "idle"; ctx.error = "";
      toast(res.status === "enviado" ? "Documento enviado e pré-analisado." : res.status === "pendencia" ? "Documento enviado com um ponto de atenção." : "O arquivo foi rejeitado na pré-análise.", res.status === "rejeitado" ? "error" : "success");
      render();
    }
    up.addEventListener("click", e => {
      const b = e.target.closest("[data-a]"); if (!b) return; const a = b.dataset.a; const s = docState(app, docId);
      if (a === "pick") $("#fi").click();
      if (a === "cam") $("#fc").click();
      if (a === "cancel") ctx.cancel = true;
      if (a === "view") previewModal(key, s.file);
      if (a === "dl") saveFile(s.file.name, fileStore.get(key));
      if (a === "keep") { s.status = "enviado"; s.note = "Você confirmou que o arquivo está legível."; app.docs[docId] = s; save(); toast("Arquivo mantido."); render(); }
      if (a === "del") openModal({ title: "Excluir arquivo?", body: `<p>O arquivo <b>${esc(s.file.name)}</b> será removido e o documento voltará a ficar pendente.</p>`, actions: [{ label: "Cancelar", onClick: closeModal }, { label: "Excluir arquivo", cls: "btn-danger-solid", onClick: () => { delete app.docs[docId]; fileStore.delete(key); previewStore.delete(key); save(); closeModal(); toast("Arquivo excluído."); render(); } }] });
    });
    ["#fi", "#fc"].forEach(sel => $(sel).addEventListener("change", e => { const f = e.target.files[0]; e.target.value = ""; if (f) processFile(f); }));
    draw();
    if (pendingFile && pendingFile.key === key && canEdit) { const f = pendingFile.file; pendingFile = null; processFile(f); }
    return () => { ctx.dead = true; };
  } };
};

/* ========= União de PDFs ========= */
const mergeState = { items: [], result: null };
function mergeTargets() {
  const out = [];
  myApps().forEach(a => { const ed = appEdital(a); [...ed.required, ...ed.optional].forEach(d => { const def = docDef(d);
    if (def.formats.includes("pdf") && !isLocked(a, d) && (a.status !== "rascunho" || edState(ed) !== "encerrado")) out.push({ v: `${a.id}:${d}`, l: `${instById(a.instId).name}: ${def.name}`, a: a.id, d, st: docState(a, d).status }); }); });
  return out;
}
VIEWS.pdf = (p, q) => ({ title: "Unir PDFs", shell: "app", nav: "pdf", html: `
  <div class="page-head"><h1>Unir PDFs</h1><p class="muted" style="margin-top:4px">Combine vários arquivos em um único PDF, por exemplo os comprovantes de renda de cada pessoa da família.</p></div>
  <div class="stack" style="--gap:10px;margin-bottom:18px">
    ${notice("info", "list", "Organize seus arquivos na ordem desejada antes de unir os documentos.", "")}
    ${notice("neutral", "info", "Use somente quando o edital permitir.", " Alguns editais exigem cada documento em um arquivo separado.")}
  </div>
  <div id="pdf-lib-err"></div>
  <section class="card stack" style="--gap:16px">
    <div class="dropzone" id="mdz"><div class="dz-icon">${ic("layers", "lg")}</div><b>Arraste os PDFs para cá</b><div class="small muted">Você pode adicionar vários de uma vez.</div>
      <div class="dz-actions"><button class="btn btn-primary" id="m-add">${ic("plus", "sm")}Adicionar PDFs</button></div></div>
    <input type="file" id="mfi" class="sr-only" tabindex="-1" accept=".pdf,application/pdf" multiple aria-hidden="true">
    <div id="m-list" aria-live="polite"></div>
    <div class="row"><button class="btn btn-secondary" id="m-prev">${ic("expand", "sm")}Visualizar documento final</button><button class="btn btn-primary" id="m-go">${ic("layers", "sm")}Unir PDFs</button><span class="small muted" id="m-why"></span></div>
  </section>
  <div id="m-res" style="margin-top:18px" aria-live="polite"></div>`,
  mount() {
    const ms = mergeState; const alvo = q.get("alvo"); const alvoDoc = q.get("doc");
    if (!window.PDFLib) $("#pdf-lib-err").innerHTML = `<div style="margin-bottom:16px">${notice("danger", "wifi", "A ferramenta não pôde ser carregada.", " Verifique sua conexão e recarregue a página.")}</div>`;
    const valid = () => ms.items.filter(i => !i.error);
    const drawList = () => {
      $("#m-list").innerHTML = ms.items.length ? `<ol class="merge-list">${ms.items.map((it, k) => `<li class="merge-item ${it.error ? "err" : ""}">
        <span class="ord" aria-hidden="true">${k + 1}</span><div class="nm"><b>${esc(it.name)}</b><span class="small ${it.error ? "" : "muted"}">${it.error ? `${ic("alert", "sm")} ${esc(it.error)}` : `${fmtSize(it.size)}, ${plural(it.pages, "página", "páginas")}`}</span></div>
        <button class="icon-btn" data-m="up" data-k="${k}" ${k === 0 ? "disabled" : ""} aria-label="Mover ${esc(it.name)} para cima">${ic("up")}</button>
        <button class="icon-btn" data-m="down" data-k="${k}" ${k === ms.items.length - 1 ? "disabled" : ""} aria-label="Mover ${esc(it.name)} para baixo">${ic("down")}</button>
        <button class="icon-btn" data-m="rm" data-k="${k}" aria-label="Remover ${esc(it.name)}">${ic("trash")}</button></li>`).join("")}</ol>
        <p class="small muted" style="margin-top:10px">Total: ${plural(valid().reduce((s, i) => s + i.pages, 0), "página", "páginas")} em ${plural(valid().length, "arquivo", "arquivos")}.</p>` : `<p class="small muted">Nenhum arquivo adicionado ainda.</p>`;
      const errs = ms.items.some(i => i.error); const ok = valid().length >= 2 && !errs && !!window.PDFLib;
      $("#m-go").disabled = !ok; $("#m-prev").disabled = !ok;
      $("#m-why").textContent = errs ? "Remova os arquivos com problema para continuar." : valid().length < 2 ? "Adicione pelo menos 2 PDFs." : "";
    };
    const drawRes = () => {
      const r = ms.result; if (!r) { $("#m-res").innerHTML = ""; return; }
      const targets = mergeTargets(); const pre = targets.find(t => t.a === alvo && t.d === alvoDoc) || targets.find(t => t.a === alvo && t.st === "pendente") || targets.find(t => t.a === alvo) || targets[0];
      $("#m-res").innerHTML = `<section class="card stack" style="--gap:16px">${notice("success", "check", "PDF unido com sucesso.", "")}
        <div class="file-card"><div class="thumb pdf">${ic("doc2")}PDF</div><div><b>documento-unido.pdf</b><div class="small muted">${fmtSize(r.blob.size)}, ${plural(r.pages, "página", "páginas")}</div></div></div>
        <div class="file-actions"><button class="btn btn-secondary btn-sm" id="r-view">${ic("expand", "sm")}Visualizar</button><button class="btn btn-secondary btn-sm" id="r-dl" data-needs-download>${ic("download", "sm")}Baixar PDF final</button></div>
        <div class="field"><label for="r-target">Usar na inscrição</label>${targets.length ? `<select class="select" id="r-target">${targets.map(t => `<option value="${t.v}" ${pre && pre.v === t.v ? "selected" : ""}>${esc(t.l)}</option>`).join("")}</select>
          <span class="hint">O arquivo passará pela pré-análise do documento escolhido.</span><div><button class="btn btn-primary" id="r-use" style="margin-top:8px">Usar neste documento</button></div>` : `<p class="small muted">Você não tem inscrições em preenchimento. <a href="#/buscar">Encontre um edital</a> para usar este arquivo.</p>`}</div>
      </section>`;
      $("#r-view").addEventListener("click", () => { fileStore.set("merge:result", r.blob); previewModal("merge:result", { name: "documento-unido.pdf", size: r.blob.size, pages: r.pages }); });
      $("#r-dl").addEventListener("click", () => saveFile("documento-unido.pdf", r.blob));
      const use = $("#r-use"); use && use.addEventListener("click", () => { const [a, d] = $("#r-target").value.split(":"); pendingFile = { key: `${a}:${d}`, file: new File([r.blob], "documento-unido.pdf", { type: "application/pdf" }) }; go(`documento/${a}/${d}`); });
    };
    async function add(files) {
      for (const f of files) {
        const it = { id: uid(), file: f, name: f.name, size: f.size, pages: 0, error: "" };
        if (normExt(extOf(f.name)) !== "pdf") it.error = "Não é um PDF. Converta o arquivo para PDF antes de unir.";
        else if (!window.PDFLib) it.error = "Ferramenta indisponível no momento.";
        else try { const d = await PDFLib.PDFDocument.load(await f.arrayBuffer(), { updateMetadata: false }); it.pages = d.getPageCount(); if (!it.pages) it.error = "O PDF não possui páginas."; }
        catch (e) { it.error = /encrypt/i.test(String(e && e.message)) ? "Protegido por senha. Remova a proteção e adicione novamente." : "Arquivo corrompido ou incompatível. Gere o PDF novamente."; }
        ms.items.push(it);
      }
      ms.result = null; drawList(); drawRes();
    }
    async function build() {
      const out = await PDFLib.PDFDocument.create();
      for (const it of valid()) { const src = await PDFLib.PDFDocument.load(await it.file.arrayBuffer()); const pgs = await out.copyPages(src, src.getPageIndices()); pgs.forEach(pg => out.addPage(pg)); }
      const bytes = await out.save(); return { blob: new Blob([bytes], { type: "application/pdf" }), pages: out.getPageCount() };
    }
    const mdz = $("#mdz");
    ["dragenter", "dragover"].forEach(ev => mdz.addEventListener(ev, e => { e.preventDefault(); mdz.classList.add("over"); }));
    ["dragleave", "drop"].forEach(ev => mdz.addEventListener(ev, e => { e.preventDefault(); mdz.classList.remove("over"); }));
    mdz.addEventListener("drop", e => add([...e.dataTransfer.files]));
    $("#m-add").addEventListener("click", () => $("#mfi").click());
    $("#mfi").addEventListener("change", e => { const fs = [...e.target.files]; e.target.value = ""; add(fs); });
    $("#m-list").addEventListener("click", e => {
      const b = e.target.closest("[data-m]"); if (!b) return; const k = +b.dataset.k; const arr = ms.items;
      if (b.dataset.m === "up" && k > 0) [arr[k - 1], arr[k]] = [arr[k], arr[k - 1]];
      if (b.dataset.m === "down" && k < arr.length - 1) [arr[k + 1], arr[k]] = [arr[k], arr[k + 1]];
      if (b.dataset.m === "rm") arr.splice(k, 1);
      ms.result = null; drawList(); drawRes();
      const sel = $(`[data-m="${b.dataset.m}"][data-k="${b.dataset.m === "up" ? k - 1 : b.dataset.m === "down" ? k + 1 : k}"]`); sel && !sel.disabled && sel.focus();
    });
    const busy = async (btn, label, fn) => { const old = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px"></span>${label}`; try { await fn(); } catch (e) { toast("Não foi possível unir os arquivos. Verifique se todos são PDFs válidos.", "error"); } btn.innerHTML = old; drawList(); };
    $("#m-prev").addEventListener("click", e => busy(e.currentTarget, "Gerando prévia...", async () => { const r = await build(); fileStore.set("merge:preview", r.blob); previewModal("merge:preview", { name: "Prévia do documento final", size: r.blob.size, pages: r.pages }); }));
    $("#m-go").addEventListener("click", e => busy(e.currentTarget, "Unindo arquivos...", async () => { ms.result = await build(); drawRes(); toast("PDF unido com sucesso."); }));
    drawList(); drawRes();
  } });
/* ========= Revisão final ========= */
VIEWS.revisao = ([id]) => {
  const app = getApp(id); if (!app) return VIEWS.naoEncontrada();
  if (app.status !== "rascunho") { go("acompanhar/" + id); return null; }
  const inst = instById(app.instId); const ed = inst.edital; const reason = blockReason(app); const u = me();
  const sentOpt = ed.optional.filter(d => app.docs[d] && app.docs[d].file);
  const rows = ids => ids.map(d => { const s = docState(app, d); const key = `${id}:${d}`;
    return `<div class="review-doc">${thumbHtml(key, s.file)}<div class="nm"><b>${esc(DOCS[d].name)}</b><div class="small muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.file ? esc(s.file.name) + ", " + fmtSize(s.file.size) : "Nenhum arquivo enviado"}</div></div>
      <div class="row" style="gap:8px;justify-content:flex-end">${docBadge(s.status)}${s.file ? `<button class="icon-btn" data-prev="${d}" aria-label="Visualizar ${esc(DOCS[d].name)}">${ic("expand")}</button>` : ""}<a class="btn btn-ghost btn-sm" href="#/documento/${id}/${d}">${s.file ? "Substituir" : "Enviar"}</a></div></div>`; }).join("");
  return { title: "Revisão final", shell: "app", nav: "inscricoes", html: `
    <a class="back" href="#/inscricao/${id}">${ic("back", "sm")}Voltar ao checklist</a>
    <div class="page-head"><div class="eyebrow-inst">Etapa final</div><h1>Revise sua inscrição</h1><p class="muted" style="margin-top:4px">Confira os dados e os arquivos antes do envio definitivo.</p></div>
    <div class="sticky-dead">${deadline(ed)}</div>
    <div class="stack" style="--gap:18px">
      ${notice("warn", "lock", "Após confirmar, não será possível alterar os documentos enviados.", " Se a instituição precisar de alguma correção, ela solicitará o reenvio.")}
      <section class="card"><h2 style="margin-bottom:14px">Resumo da inscrição</h2>
        <dl class="kv"><div><dt>Estudante</dt><dd>${esc(u.name)}</dd></div><div><dt>E-mail</dt><dd>${esc(u.email)}</dd></div><div><dt>Instituição</dt><dd>${esc(inst.name)}</dd></div><div><dt>Edital</dt><dd>${esc(ed.name)}</dd></div><div><dt>Forma de ingresso</dt><dd>${esc(ed.forma)}</dd></div><div><dt>Prazo de inscrição</dt><dd>até ${fmtDate(ed.closeDate)}</dd></div></dl></section>
      <section class="card"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h2>Documentos obrigatórios</h2><span class="small muted">${requiredDone(app)} de ${ed.required.length} enviados</span></div>${rows(ed.required)}</section>
      ${ed.optional.length ? `<section class="card"><h2 style="margin-bottom:6px">Documentos opcionais</h2>${sentOpt.length ? rows(sentOpt) : `<p class="small muted" style="margin-top:6px">Nenhum documento opcional enviado. Eles não são necessários para concluir a inscrição.</p>`}</section>` : ""}
      ${reason ? notice("danger", "alert", esc(reason), ` <a href="#/inscricao/${id}">Voltar ao checklist</a>`) : ""}
      <div class="row"><a class="btn btn-secondary btn-lg" href="#/inscricao/${id}">Voltar e revisar</a><span class="spacer"></span><button class="btn btn-primary btn-lg" id="send" ${reason ? "disabled" : ""}>Enviar inscrição</button></div>
    </div>`,
  mount() {
    $$("[data-prev]").forEach(b => b.addEventListener("click", () => previewModal(`${id}:${b.dataset.prev}`, docState(app, b.dataset.prev).file)));
    const btn = $("#send"); if (!btn) return;
    btn.addEventListener("click", () => {
      const m = openModal({ title: "Confirmar envio da inscrição?", body: `<p>Você vai enviar sua inscrição para <b>${esc(inst.name)}</b>, no edital <b>${esc(ed.name)}</b>, com ${plural(ed.required.length + sentOpt.length, "documento", "documentos")}.</p><div style="margin-top:14px">${notice("warn", "lock", "Depois do envio, os documentos não poderão ser alterados.", "")}</div>`,
        actions: [{ label: "Voltar e revisar", onClick: closeModal }, { label: "Confirmar e enviar inscrição", cls: "btn-primary", onClick: async b => {
          $$("[data-mi]", m).forEach(x => (x.disabled = true)); b.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Enviando inscrição...`;
          await wait(1500);
          if (blockReason(app)) { closeModal(); toast(blockReason(app), "error"); render(); return; }
          const now = new Date(); app.protocol = `IN-${now.getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`;
          app.submittedAt = now.toISOString(); app.status = "enviado";
          app.timeline = [{ date: app.submittedAt, label: "Inscrição enviada", detail: `Protocolo ${app.protocol}.` }];
          save(); closeModal(); go("enviado/" + id);
        } }] });
    });
  } };
};

/* ========= Confirmação ========= */
VIEWS.enviado = ([id]) => {
  const app = getApp(id); if (!app || !app.protocol) return VIEWS.naoEncontrada();
  const inst = instById(app.instId); const u = me();
  return { title: "Inscrição enviada", shell: "app", nav: "inscricoes", html: `<div class="card" style="max-width:640px;margin:0 auto">
    <div class="success-hero"><div class="big">${ic("check")}</div><h1>Inscrição enviada com sucesso!</h1><p class="muted" style="margin-top:8px">Guarde o número do protocolo. Ele identifica sua inscrição em qualquer contato com a instituição.</p>
      <div style="margin-top:18px" class="small muted">Número do protocolo</div><div class="protocol">${esc(app.protocol)}</div><p class="xs muted" style="margin-top:4px">Protocolo de exemplo, gerado para demonstração.</p></div>
    <dl class="kv" style="margin-top:22px;border-top:1px solid var(--line);padding-top:18px"><div><dt>Estudante</dt><dd>${esc(u.name)}</dd></div><div><dt>Instituição</dt><dd>${esc(inst.name)}</dd></div><div><dt>Edital</dt><dd>${esc(inst.edital.name)}</dd></div><div><dt>Data e hora do envio</dt><dd>${fmtDateTime(app.submittedAt)}</dd></div><div><dt>Status inicial</dt><dd>${appBadge("enviado")}</dd></div></dl>
    <div class="stack" style="--gap:10px;margin-top:24px"><a class="btn btn-primary btn-lg btn-block" href="#/comprovante/${id}">${ic("download", "sm")}Baixar comprovante em PDF</a>
      <div class="grid grid-2" style="gap:10px"><a class="btn btn-secondary" href="#/acompanhar/${id}">Acompanhar inscrição</a><a class="btn btn-secondary" href="#/painel">Voltar ao painel</a></div></div>
    <div style="margin-top:20px">${notice("neutral", "info", "Ambiente de demonstração.", " Nenhum dado foi enviado a uma instituição real.")}</div>
  </div>` };
};

/* ========= Comprovante ========= */
async function receiptPdf(app) {
  const { PDFDocument, StandardFonts, rgb } = PDFLib; const inst = instById(app.instId); const ed = inst.edital; const u = me();
  const doc = await PDFDocument.create(); const page = doc.addPage([595.28, 841.89]);
  const f = await doc.embedFont(StandardFonts.Helvetica); const b = await doc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.075, 0.16, 0.29), muted = rgb(0.35, 0.4, 0.49), blue = rgb(0.18, 0.42, 0.87);
  let y = 780; const L = 56;
  const t = (s, x, size, font = f, color = navy) => page.drawText(String(s), { x, y, size, font, color });
  page.drawRectangle({ x: L, y: y - 6, width: 26, height: 26, color: blue }); y += 2; t("BolsaTech", L + 36, 18, b); y -= 40;
  t("Comprovante de inscrição", L, 22, b); y -= 20; t("Documento de demonstração. Dados fictícios, sem validade oficial.", L, 10, f, rgb(0.48, 0.34, 0)); y -= 34;
  t("Número do protocolo", L, 10, f, muted); y -= 20; t(app.protocol, L, 20, b); y -= 34;
  const kv = (k, v) => { t(k, L, 10, f, muted); y -= 15; t(v, L, 12, b); y -= 26; };
  kv("Estudante", u.name); kv("E-mail", u.email); kv("Instituição", `${inst.name} (${inst.city}/${inst.uf})`); kv("Edital", ed.name); kv("Data e hora do envio", fmtDateTime(app.submittedAt)); kv("Status atual", APP_STATUS[app.status].label);
  page.drawLine({ start: { x: L, y: y + 8 }, end: { x: 539, y: y + 8 }, thickness: 0.6, color: rgb(0.86, 0.89, 0.92) }); y -= 14;
  t("Documentos enviados", L, 12, b); y -= 20;
  [...ed.required, ...ed.optional].filter(d => app.docs[d] && app.docs[d].file).forEach(d => { t("•  " + DOCS[d].name, L, 10.5); t(app.docs[d].file.name.slice(0, 44), 330, 9.5, f, muted); y -= 17; });
  y -= 18; t(`Comprovante gerado em ${fmtDateTime(new Date())}.`, L, 9, f, muted);
  return new Blob([await doc.save()], { type: "application/pdf" });
}
VIEWS.comprovante = ([id]) => {
  const app = getApp(id); if (!app || !app.protocol) return VIEWS.naoEncontrada();
  const inst = instById(app.instId); const ed = inst.edital; const u = me();
  const docs = [...ed.required, ...ed.optional].filter(d => app.docs[d] && app.docs[d].file);
  return { title: "Comprovante de inscrição", shell: "app", nav: "inscricoes", html: `
    <div class="no-print"><a class="back" href="#/acompanhar/${id}">${ic("back", "sm")}Acompanhar inscrição</a>
    <div class="page-head row" style="justify-content:space-between"><h1>Comprovante de inscrição</h1><button class="btn btn-primary" id="dl-rec" data-needs-download>${ic("download", "sm")}Baixar comprovante em PDF</button></div>
    <div class="downloads-note" style="margin-bottom:16px">${notice("neutral", "info", "O download não está disponível nesta visualização.", " Abra a página publicada para baixar o comprovante.")}</div></div>
    <article class="receipt">
      <div class="row" style="justify-content:space-between"><span class="brand" style="color:#13294B">${brandMark()}BolsaTech</span><span class="tag">Dados de demonstração</span></div>
      <hr><div class="small" style="color:#58657C">Número do protocolo</div><div class="protocol" style="color:#13294B">${esc(app.protocol)}</div>
      <dl class="kv" style="margin-top:20px"><div><dt>Estudante</dt><dd>${esc(u.name)}</dd></div><div><dt>E-mail</dt><dd>${esc(u.email)}</dd></div><div><dt>Instituição</dt><dd>${esc(inst.name)} (${esc(inst.city)}/${inst.uf})</dd></div><div><dt>Edital</dt><dd>${esc(ed.name)}</dd></div><div><dt>Data e hora do envio</dt><dd>${fmtDateTime(app.submittedAt)}</dd></div><div><dt>Status atual</dt><dd>${esc(APP_STATUS[app.status].label)}</dd></div></dl>
      <hr><h2 style="font-size:1rem;margin-bottom:10px">Documentos enviados (${docs.length})</h2>
      <ul style="margin:0;padding-left:18px;display:grid;gap:4px" class="small">${docs.map(d => `<li><b>${esc(DOCS[d].name)}</b> <span style="color:#58657C">${esc(app.docs[d].file.name)}</span></li>`).join("")}</ul>
      <hr><p class="xs" style="color:#58657C">Este comprovante foi gerado em ambiente de demonstração e não possui validade oficial. No sistema real, o protocolo é único e associado à inscrição registrada pela instituição.</p>
    </article>`,
  mount() {
    const b = $("#dl-rec"); b.addEventListener("click", async () => {
      if (!window.PDFLib) { toast("Não foi possível gerar o PDF. Verifique sua conexão.", "error"); return; }
      const old = b.innerHTML; b.disabled = true; b.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Gerando PDF...`;
      try { await saveFile(`comprovante-${app.protocol}.pdf`, await receiptPdf(app)); } catch (e) { toast("Não foi possível gerar o comprovante. Tente novamente.", "error"); }
      b.disabled = false; b.innerHTML = old;
    });
  } };
};

/* ========= Acompanhamento ========= */
const DEMO_REASONS = { residencia: "O comprovante enviado tem data anterior a 90 dias. Envie uma fatura emitida nos últimos 90 dias.", renda: "Faltam os comprovantes de renda de um dos integrantes da família.", historico: "O histórico enviado está incompleto: falta a página do 3º ano.", rg: "A imagem do verso do documento está cortada. Envie frente e verso completos.", certificado: "O certificado não está assinado pela direção da escola." };
function simulate(app, kind) {
  const now = new Date().toISOString(); const ed = appEdital(app);
  if (kind === "analise") { app.status = "analise"; app.timeline.push({ date: now, label: "Análise iniciada", detail: "A instituição começou a conferir seus documentos." }); }
  if (kind === "reenvio") {
    const d = ["residencia", "renda", "historico", "rg", "certificado"].find(x => ed.required.includes(x)) || ed.required[0];
    app.status = "reenvio"; app.pendency = { docId: d, reason: (DEMO_REASONS[d] || "O documento enviado está ilegível.") + " (Motivo de exemplo.)", date: now };
    app.docs[d] = { ...docState(app, d), status: "pendencia", checks: undefined };
    app.timeline.push({ date: now, label: "Reenvio solicitado", detail: `${DOCS[d].name}: correção solicitada pela instituição.` });
  }
  if (kind === "deferido" || kind === "indeferido") {
    app.status = kind; app.pendency = null;
    app.result = kind === "deferido"
      ? { date: now, text: "Documentação completa e dentro dos critérios do edital. (Justificativa de exemplo.)", next: "Aguarde o e-mail da instituição com as orientações de matrícula e o prazo para confirmar a vaga." }
      : { date: now, text: "Renda familiar por pessoa acima do limite previsto no edital. (Justificativa de exemplo.)", next: "Consulte o edital para conhecer o prazo e o procedimento de recurso." };
    app.timeline.push({ date: now, label: kind === "deferido" ? "Inscrição deferida" : "Inscrição indeferida", detail: "Resultado publicado pela instituição." });
  }
  if (kind === "reset") { app.status = "enviado"; app.pendency = null; app.result = null; app.timeline = app.timeline.slice(0, 1); Object.values(app.docs).forEach(d => { if (d.status === "pendencia") d.status = "enviado"; }); }
  save(); render();
}
VIEWS.acompanhar = ([id]) => {
  const app = getApp(id); if (!app) return VIEWS.naoEncontrada();
  if (app.status === "rascunho") { go("inscricao/" + id); return null; }
  const inst = instById(app.instId); const ed = inst.edital; const st = app.status; const final = ["deferido", "indeferido"].includes(st);
  const step = (label, state, date, extra = "") => `<li class="${state}"><span class="dot">${ic(state === "done" ? "check" : state.startsWith("current") ? APP_STATUS[st].icon : "circle", "sm")}</span><div><div class="t">${label}</div>${date ? `<div class="small muted">${date}</div>` : ""}${extra}</div></li>`;
  const tAn = app.timeline.find(t => t.label === "Análise iniciada");
  const steps = `<ol class="tl" aria-label="Etapas da inscrição">
    ${step("Enviado", "done", fmtDateTime(app.submittedAt))}
    ${step("Em análise", st === "enviado" ? "" : final ? "done" : `current ${APP_STATUS[st].tl}`, tAn ? fmtDateTime(tAn.date) : st === "enviado" ? "Aguardando início da análise" : "", st === "reenvio" ? `<div style="margin-top:6px">${appBadge("reenvio")}</div>` : st === "analise" ? `<div style="margin-top:6px">${appBadge("analise")}</div>` : "")}
    ${step("Resultado", final ? `current ${APP_STATUS[st].tl}` : "", final ? fmtDateTime(app.result.date) : "Previsto após a análise", final ? `<div style="margin-top:6px">${appBadge(st)}</div>` : "")}
  </ol>`;
  const pend = st === "reenvio" && app.pendency ? `<section class="card stack" style="--gap:14px;border-color:var(--orange-bar)">
      <div class="row">${badge(DOC_STATUS.pendencia)}<h2 style="flex:1">Pendência na sua inscrição</h2></div>
      <dl class="kv"><div><dt>Documento afetado</dt><dd>${esc(DOCS[app.pendency.docId].name)}</dd></div><div><dt>Data da solicitação</dt><dd>${fmtDateTime(app.pendency.date)}</dd></div></dl>
      <div><div class="small muted" style="font-weight:600">Motivo</div><p style="margin-top:2px">${esc(app.pendency.reason)}</p></div>
      <div><div class="small muted" style="font-weight:600">Como corrigir</div><p style="margin-top:2px">Envie um novo arquivo para este documento. Apenas ele será liberado; os demais continuam bloqueados.</p></div>
      <div><a class="btn btn-primary" href="#/documento/${id}/${app.pendency.docId}">${ic("upload", "sm")}Reenviar documento</a></div></section>` : "";
  const res = final ? `<section class="card stack" style="--gap:12px;border-color:${st === "deferido" ? "var(--green-bar)" : "var(--red-bar)"}">
      <div class="row">${appBadge(st)}<h2 style="flex:1">Resultado: ${st === "deferido" ? "inscrição deferida" : "inscrição indeferida"}</h2></div>
      <p class="small muted">Publicado em ${fmtDate(app.result.date)}</p>
      <div><div class="small muted" style="font-weight:600">Justificativa da instituição</div><p style="margin-top:2px">${esc(app.result.text)}</p></div>
      <div><div class="small muted" style="font-weight:600">Próximos passos</div><p style="margin-top:2px">${esc(app.result.next)}</p></div></section>` : "";
  const docs = [...ed.required, ...ed.optional].filter(d => app.docs[d]);
  return { title: "Acompanhar inscrição", shell: "app", nav: "inscricoes", html: `
    <a class="back" href="#/inscricoes">${ic("back", "sm")}Minhas inscrições</a>
    <div class="page-head"><div class="eyebrow-inst">${esc(inst.name)}</div><h1>${esc(ed.name)}</h1>
      <div class="row" style="margin-top:10px"><span class="small muted">Protocolo <b style="color:var(--text)">${esc(app.protocol)}</b></span><span class="spacer"></span><a class="btn btn-secondary btn-sm" href="#/comprovante/${id}">${ic("file", "sm")}Comprovante</a></div></div>
    <div class="stack" style="--gap:18px">
      <section class="card"><div class="row" style="justify-content:space-between;margin-bottom:18px"><h2>Status atual</h2>${appBadge(st)}</div>${steps}</section>
      ${pend}${res}
      <section class="card"><h2 style="margin-bottom:14px">Histórico</h2><ul class="history">${[...app.timeline].reverse().map(t => `<li><time datetime="${t.date}">${fmtDateTime(t.date)}</time><div><b>${esc(t.label)}</b><div class="small muted">${esc(t.detail)}</div></div></li>`).join("")}</ul></section>
      <details class="card"><summary style="cursor:pointer;font-weight:700">Documentos da inscrição (${docs.length})</summary><div style="margin-top:12px">${docs.map(d => `<div class="review-doc"><div class="nm"><b>${esc(DOCS[d].name)}</b><div class="small muted">${esc(app.docs[d].file ? app.docs[d].file.name : "")}</div></div>${docBadge(app.docs[d].status)}${isLocked(app, d) ? `<span class="muted" title="Bloqueado para alteração">${ic("lock", "sm")}<span class="sr-only">Bloqueado</span></span>` : ""}</div>`).join("")}</div></details>
      <section class="demo-panel stack" style="--gap:12px" aria-labelledby="demo-t"><div><h2 id="demo-t" style="font-size:1rem">Simular resposta da instituição</h2><p class="small muted" style="margin-top:4px">Controles de demonstração. No sistema real, essas mudanças são feitas pela instituição.</p></div>
        <div class="row" style="gap:8px">
          <button class="btn btn-secondary btn-sm" data-sim="analise" ${st !== "enviado" ? "disabled" : ""}>Iniciar análise</button>
          <button class="btn btn-secondary btn-sm" data-sim="reenvio" ${st !== "analise" ? "disabled" : ""}>Solicitar reenvio</button>
          <button class="btn btn-secondary btn-sm" data-sim="deferido" ${st !== "analise" ? "disabled" : ""}>Deferir</button>
          <button class="btn btn-secondary btn-sm" data-sim="indeferido" ${st !== "analise" ? "disabled" : ""}>Indeferir</button>
          <button class="btn btn-ghost btn-sm" data-sim="reset" ${st === "enviado" ? "disabled" : ""}>${ic("refresh", "sm")}Reiniciar</button></div></section>
    </div>`,
  mount() { $$("[data-sim]").forEach(b => b.addEventListener("click", () => { simulate(app, b.dataset.sim); toast("Status atualizado na demonstração."); })); } };
};

/* ========= Estados da interface ========= */
VIEWS.estados = () => ({ title: "Estados da interface", shell: "app", nav: "estados", html: `
  <div class="page-head"><h1>Estados da interface</h1><p class="muted" style="margin-top:4px">Componentes usados em todo o sistema para carregamento, erro, ausência de dados e sucesso.</p></div>
  <div class="stack" style="--gap:28px">
    <section><h2 style="margin-bottom:12px">Padrão de status</h2><div class="card legend">${Object.keys(DOC_STATUS).map(docBadge).join("")}${appBadge("reenvio")}${appBadge("deferido")}${appBadge("indeferido")}</div>
      <p class="small muted" style="margin-top:8px">Cada status combina cor, ícone e texto, para não depender apenas da cor.</p></section>
    <section><h2 style="margin-bottom:12px">Carregamento</h2><div class="grid grid-2">${skeletonCards(2)}</div>
      <div class="row" style="margin-top:12px"><span class="card-flat row small"><span class="spinner"></span>Carregando instituições...</span><span class="card-flat row small"><span class="spinner"></span>Enviando documento...</span></div></section>
    <section><h2 style="margin-bottom:12px">Erro</h2><div class="card stack" id="err-demo" style="--gap:12px">
      <div class="row">${ic("wifi", "lg")}<div style="flex:1"><b>Não foi possível carregar as instituições.</b><div class="small muted">A conexão com a internet foi interrompida. Verifique sua rede e tente novamente.</div></div></div>
      <div><button class="btn btn-primary btn-sm" id="retry">${ic("refresh", "sm")}Tentar novamente</button></div></div></section>
    <section><h2 style="margin-bottom:12px">Estado vazio</h2>${empty("inbox", "Você ainda não possui inscrições.", "Encontre um edital aberto e o BolsaTech monta a lista de documentos que você precisa reunir.", `<a class="btn btn-primary" href="#/buscar">Encontrar editais</a>`)}</section>
    <section><h2 style="margin-bottom:12px">Sucesso</h2>${notice("success", "check", "Documento enviado e pré-analisado.", " Comprovante de residência marcado como enviado. Próximo passo: Histórico escolar.")}</section>
    <section><h2 style="margin-bottom:12px">Sessão expirada</h2><div class="card stack" style="--gap:12px"><p class="small muted">Simula o fim da sessão: você volta para o login com uma mensagem explicativa, e os dados já salvos são mantidos.</p><div><button class="btn btn-secondary" id="expire">${ic("lock", "sm")}Simular sessão expirada</button></div></div></section>
  </div>`,
  mount() {
    $("#retry").addEventListener("click", async () => { const box = $("#err-demo"); box.innerHTML = `<div class="row small"><span class="spinner"></span>Carregando instituições...</div>`; await wait(1200); if (!document.contains(box)) return; box.innerHTML = notice("success", "check", "Instituições carregadas.", " A conexão foi restabelecida."); });
    $("#expire").addEventListener("click", () => { S.redirect = "#/painel"; S.session = null; S.flash = "expired"; save(); go("entrar"); });
  } });

/* ========= Assistente BolsaTech (IA) ========= */
let sampleP = null;
function getSample() {
  if (!sampleP) sampleP = (window.claude && typeof window.claude.use === "function") ? window.claude.use("sample").catch(() => null) : Promise.resolve(null);
  return sampleP;
}
const aiState = { turns: [], blocked: false, busy: false, ctl: null };
function docIssue(s) { const c = (s.checks || []).find(x => x.result === "fail") || (s.checks || []).find(x => x.result === "warn"); return c ? `${c.label}: ${c.detail}` : ""; }
function missingOf(app) {
  const ed = appEdital(app); const res = { falta: [], corrigir: [], opcionais: [], enviados: [] };
  ed.required.forEach(id => { const s = docState(app, id); const pend = app.status === "reenvio" && app.pendency && app.pendency.docId === id;
    if (pend) res.corrigir.push({ id, s, why: app.pendency.reason });
    else if (s.status === "pendente") res.falta.push({ id, s });
    else if (["pendencia", "rejeitado"].includes(s.status)) res.corrigir.push({ id, s, why: docIssue(s) });
    else res.enviados.push({ id, s }); });
  ed.optional.forEach(id => { const s = docState(app, id); if (s.file) res.enviados.push({ id, s, opt: true }); else res.opcionais.push({ id, s }); });
  return res;
}
const activeApps = () => myApps().filter(a => a.status === "rascunho" || a.status === "reenvio").sort((a, b) => appEdital(a).closeDate - appEdital(b).closeDate);
function aiContext() {
  const u = me(); const L = [`Data de hoje: ${fmtDate(TODAY)}.`, `Nome do estudante: ${u.name.split(" ")[0]}.`];
  const apps = myApps();
  if (!apps.length) L.push("O estudante ainda não iniciou nenhuma inscrição.");
  apps.forEach(app => {
    const inst = instById(app.instId); const ed = inst.edital; const n = dayDiff(ed.closeDate);
    L.push(`\nINSCRIÇÃO: ${inst.name} (${inst.city}/${inst.uf}), edital "${ed.name}", forma de ingresso ${ed.forma}. Situação: ${APP_STATUS[app.status].label}. Prazo final: ${fmtDate(ed.closeDate)} (${edState(ed) === "encerrado" ? "encerrado" : n === 0 ? "encerra hoje" : `faltam ${n} dias`}).`);
    if (app.pendency) L.push(`Pendência solicitada pela instituição: ${DOCS[app.pendency.docId].name}. Motivo: ${app.pendency.reason}`);
    [...ed.required.map(id => [id, "obrigatório"]), ...ed.optional.map(id => [id, "opcional"])].forEach(([id, kind]) => {
      const d = docDef(id); const s = docState(app, id); const issue = docIssue(s);
      L.push(`- ${d.name} [${kind}]: ${DOC_STATUS[s.status].label}${issue && s.status !== "enviado" ? `. Problema: ${issue}` : ""}${s.status !== "enviado" ? `. Como obter: ${d.how} Formatos aceitos: ${fmtList(d)}, até 5 MB.` : ""}`);
    });
  });
  return L.join("\n");
}
const AI_RULES = `Você é o Assistente BolsaTech, que ajuda estudantes a reunir os documentos de editais de bolsas de estudo (como o programa Universidade Gratuita). Responda em português do Brasil, com tom acolhedor e direto, em no máximo 170 palavras.
Regras: use apenas os dados do checklist abaixo; não invente documentos, prazos, valores ou regras. Se a informação não estiver nos dados, diga que o estudante deve consultar o edital oficial. A pré-análise do sistema não garante aprovação. Não peça dados pessoais.
Formato: texto simples. Use "- " no início das linhas de lista e **negrito** apenas para nomes de documentos. Não use títulos, tabelas nem emojis.

CHECKLIST DO ESTUDANTE
`;
const AI_SUMMARY = "Mostre, para cada inscrição em preenchimento, quais documentos já foram enviados (apenas a quantidade), quais ainda faltam enviar e quais precisam de correção, com o motivo em poucas palavras. Termine com uma linha começando por \"Próximo passo:\" indicando a ação mais urgente, considerando o prazo mais próximo.";
const AI_CHIPS = ["O que falta para concluir?", "Qual prazo vence primeiro?", "Como resolvo os documentos com problema?", "Onde consigo cada documento que falta?"];
function mdLite(t) {
  const inl = s => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/^#{1,6}\s*/, "");
  let out = "", list = false;
  esc(t).split("\n").forEach(l => {
    const m = l.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)/);
    if (m) { if (!list) { out += "<ul>"; list = true; } out += `<li>${inl(m[1])}</li>`; }
    else { if (list) { out += "</ul>"; list = false; } if (l.trim()) out += `<p>${inl(l)}</p>`; }
  });
  return out + (list ? "</ul>" : "");
}
function localSummary() {
  const apps = activeApps();
  if (!apps.length) return `<p>Você não tem inscrições em preenchimento. Quando iniciar uma, eu mostro aqui o que falta enviar.</p>`;
  let urgent = null;
  const items = apps.map(a => { const m = missingOf(a); const ed = appEdital(a); const inst = instById(a.instId);
    if (!urgent && (m.falta.length || m.corrigir.length)) urgent = { a, m };
    const parts = [];
    if (m.falta.length) parts.push(`falta enviar ${m.falta.map(x => `<b>${esc(DOCS[x.id].name)}</b>`).join(", ")}`);
    if (m.corrigir.length) parts.push(`corrigir ${m.corrigir.map(x => `<b>${esc(DOCS[x.id].name)}</b>`).join(", ")}`);
    return `<li><b>${esc(inst.name)}</b> (${esc(deadlineText(ed).replace("Prazo final: ", "prazo "))}): ${parts.length ? parts.join("; ") : "todos os obrigatórios foram enviados. Falta só revisar e enviar a inscrição"}.</li>`; }).join("");
  const next = urgent ? `<p><b>Próximo passo:</b> ${urgent.m.corrigir.length ? `corrigir ${esc(DOCS[urgent.m.corrigir[0].id].name)}` : `enviar ${esc(DOCS[urgent.m.falta[0].id].name)}`}, na ${esc(instById(urgent.a.instId).name)}.</p>` : "";
  return `<ul>${items}</ul>${next}`;
}
function aiErrorCopy(code) {
  if (code === "not_granted") return "O uso do assistente não foi autorizado nesta visualização. O resumo do checklist continua disponível acima.";
  if (code === "rate_limited" || code === "queue_overflow") return "Muitas perguntas seguidas. Aguarde alguns segundos e tente de novo.";
  if (code === "prompt_too_large") return "A conversa ficou longa demais. Limpe a conversa e pergunte novamente.";
  if (code === "session_expired") return "Sua sessão no Claude expirou. Recarregue a página e tente de novo.";
  return "Não foi possível obter a resposta agora. Tente novamente em instantes.";
}
function aiCard() {
  return `<section class="card ai-card" aria-labelledby="ai-t">
    <div class="row" style="align-items:flex-start"><span class="ai-mark" aria-hidden="true">${ic("spark")}</span>
      <div style="flex:1;min-width:200px"><h2 id="ai-t">Assistente BolsaTech</h2><p class="small muted" style="margin-top:2px">Inteligência artificial que lê o seu checklist e mostra os documentos que faltam.</p></div>
      <span class="badge s-blue" id="ai-state">${ic("clock")}Conectando...</span></div>
    <div class="ai-chat" id="ai-chat" aria-live="polite">
      <div class="ai-msg bot"><div class="ai-who">Resumo do seu checklist</div>${localSummary()}</div>
    </div>
    <div id="ai-tools" hidden>
      <div class="chips" role="group" aria-label="Sugestões de pergunta"><button class="chip chip-main" data-q="__resumo">${ic("spark", "sm")}Analisar meus documentos com IA</button>${AI_CHIPS.map(c => `<button class="chip" data-q="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <form class="ai-form" id="ai-form"><label class="sr-only" for="ai-q">Pergunte ao assistente</label>
        <input class="input" id="ai-q" maxlength="400" autocomplete="off" placeholder="Pergunte sobre seus documentos">
        <button class="btn btn-primary" id="ai-send" type="submit">Enviar</button></form>
      <div class="row" style="justify-content:space-between"><p class="xs muted" style="flex:1;min-width:220px">As respostas são geradas por IA a partir do seu checklist e podem conter erros. Confira sempre o edital oficial.</p><button class="link-btn xs" id="ai-clear" type="button">Limpar conversa</button></div>
    </div>
    <p class="small muted" id="ai-off" hidden></p>
  </section>`;
}
function mountAi() {
  let alive = true;
  const chat = $("#ai-chat"); const state = $("#ai-state");
  const drawTurns = () => {
    $$(".ai-msg.turn", chat).forEach(n => n.remove());
    aiState.turns.forEach(t => { const d = document.createElement("div"); d.className = `ai-msg turn ${t.role === "user" ? "me" : "bot"}`;
      d.innerHTML = t.role === "user" ? `<p>${esc(t.label || t.content)}</p>` : `<div class="ai-who">Assistente</div>${mdLite(t.content)}${t.note ? `<p class="xs muted">${esc(t.note)}</p>` : ""}`; chat.appendChild(d); });
  };
  const setBusy = b => { aiState.busy = b; const s = $("#ai-send"); if (!s) return;
    s.textContent = b ? "Parar" : "Enviar"; s.classList.toggle("btn-secondary", b); s.classList.toggle("btn-primary", !b);
    $$(".chip").forEach(c => (c.disabled = b)); };
  async function ask(sample, question, label) {
    if (aiState.busy || aiState.blocked) return;
    const pairs = [];
    for (let i = 0; i + 1 < aiState.turns.length; i += 2) { const u = aiState.turns[i], a = aiState.turns[i + 1]; if (u.role === "user" && a.role === "assistant" && !a.failed && a.content) pairs.push(u, a); }
    const history = pairs.slice(-6);
    const base = AI_RULES + aiContext() + "\n\n";
    const msgs = history.map(t => ({ role: t.role, content: t.content }));
    if (msgs.length) { msgs[0].content = base + "PERGUNTA: " + msgs[0].content; msgs.push({ role: "user", content: `(Checklist atualizado)\n${aiContext()}\n\nPERGUNTA: ${question}` }); }
    else msgs.push({ role: "user", content: base + "PERGUNTA: " + question });
    aiState.turns.push({ role: "user", content: question, label });
    const bot = { role: "assistant", content: "" }; aiState.turns.push(bot); drawTurns();
    const node = chat.lastElementChild; node.innerHTML = `<div class="ai-who">Assistente</div><p class="row small muted"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span>Pensando...</p>`;
    node.scrollIntoView({ block: "nearest", behavior: "smooth" });
    aiState.ctl = new AbortController(); setBusy(true);
    try {
      const r = await sample(msgs, { modelTier: "quick", cache: false, signal: aiState.ctl.signal, onText: ({ text }) => { bot.content = text; if (alive && document.contains(node)) node.innerHTML = `<div class="ai-who">Assistente</div>${mdLite(text)}`; } });
      bot.content = r.text || bot.content;
      if (!bot.content.trim()) { bot.content = "Não consegui gerar uma resposta. Tente perguntar de outro jeito."; bot.failed = true; }
    } catch (e) {
      const code = e && e.code;
      if (code === "cancelled") { bot.content = (e.text || bot.content || "").trim() || "Resposta interrompida."; bot.note = "Resposta interrompida."; }
      else { bot.content = e && e.text ? e.text : aiErrorCopy(code); bot.failed = !(e && e.text); if (code === "not_granted") { aiState.blocked = true; } }
    }
    aiState.ctl = null; if (!alive) { aiState.busy = false; return; } setBusy(false); drawTurns();
    if (aiState.blocked) disable(aiErrorCopy("not_granted"));
  }
  function disable(msg) { $("#ai-tools").hidden = true; const off = $("#ai-off"); off.hidden = false; off.textContent = msg; state.className = "badge s-gray"; state.innerHTML = `${ic("circle")}Resumo automático`; }
  drawTurns();
  getSample().then(sample => {
    if (!alive) return;
    if (!sample) { disable((window.claude ? "O assistente de IA fica disponível na página publicada do BolsaTech." : "O assistente de IA precisa de integração com uma API de IA (veja o README).") + " Aqui você vê o resumo automático do seu checklist."); return; }
    if (aiState.blocked) { disable(aiErrorCopy("not_granted")); return; }
    state.className = "badge s-blue"; state.innerHTML = `${ic("spark")}IA disponível`;
    $("#ai-tools").hidden = false;
    $("#ai-tools").addEventListener("click", e => {
      const c = e.target.closest("[data-q]"); if (c) { const q = c.dataset.q; q === "__resumo" ? ask(sample, AI_SUMMARY, "Analise meus documentos e mostre o que falta.") : ask(sample, q); }
      if (e.target.closest("#ai-clear")) { if (aiState.ctl) aiState.ctl.abort(); aiState.turns = []; drawTurns(); }
    });
    $("#ai-form").addEventListener("submit", e => { e.preventDefault();
      if (aiState.busy) { aiState.ctl && aiState.ctl.abort(); return; }
      const inp = $("#ai-q"); const q = inp.value.trim(); if (!q) { inp.focus(); return; } inp.value = ""; ask(sample, q); });
    setBusy(aiState.busy);
  });
  return () => { alive = false; };
}

/* ========= Documentos faltantes ========= */
VIEWS.faltantes = (p, q) => {
  const apps = activeApps(); const focus = q.get("app");
  let tf = 0, tc = 0, te = 0;
  const cards = apps.map(app => {
    const inst = instById(app.instId); const ed = inst.edital; const m = missingOf(app);
    tf += m.falta.length; tc += m.corrigir.length; te += m.enviados.filter(x => !x.opt).length;
    const row = (x, kind) => `<div class="doc-row">${statusDot(kind === "corrigir" ? (x.s.status === "rejeitado" ? "rejeitado" : "pendencia") : x.s.status)}
      <div class="body"><div class="name">${esc(DOCS[x.id].name)}</div><div class="desc">${esc(kind === "corrigir" && x.why ? x.why : DOCS[x.id].short)}</div></div>
      <div class="act">${docBadge(kind === "corrigir" && x.s.status === "enviado" ? "pendencia" : x.s.status)}<a class="btn btn-primary btn-sm" href="#/documento/${app.id}/${x.id}">${kind === "falta" ? "Enviar documento" : "Corrigir documento"}</a></div></div>`;
    return `<section class="card stack" id="app-${app.id}" style="--gap:14px">
      <div class="row" style="justify-content:space-between;align-items:flex-start"><div><div class="small muted" style="font-weight:600">${esc(inst.name)}</div><h2>${esc(ed.name)}</h2></div>${appBadge(app.status)}</div>
      ${segs(app, true)}
      <div class="row">${app.status === "rascunho" ? deadline(ed) : `<span class="small muted">Protocolo ${esc(app.protocol)}</span>`}<span class="spacer"></span><a class="btn btn-ghost btn-sm" href="#/${app.status === "rascunho" ? "inscricao" : "acompanhar"}/${app.id}">${app.status === "rascunho" ? "Abrir checklist" : "Acompanhar"}</a></div>
      ${m.falta.length ? `<h3>Faltam enviar (${m.falta.length})</h3><div class="doc-list">${m.falta.map(x => row(x, "falta")).join("")}</div>` : ""}
      ${m.corrigir.length ? `<h3>Precisam de correção (${m.corrigir.length})</h3><div class="doc-list">${m.corrigir.map(x => row(x, "corrigir")).join("")}</div>` : ""}
      ${!m.falta.length && !m.corrigir.length ? notice("success", "check", "Nenhum documento obrigatório faltando.", app.status === "rascunho" ? ` <a href="#/revisao/${app.id}">Revisar e enviar inscrição</a>` : "") : ""}
      ${m.opcionais.length && app.status === "rascunho" ? `<p class="small muted"><b>Opcionais não enviados:</b> ${m.opcionais.map(x => esc(DOCS[x.id].name)).join(", ")}. Eles não impedem o envio.</p>` : ""}
      ${m.enviados.length ? `<details><summary class="small" style="cursor:pointer;font-weight:650">Já enviados (${m.enviados.length})</summary><ul class="small" style="margin:10px 0 0;padding-left:0;list-style:none;display:grid;gap:8px">${m.enviados.map(x => `<li class="row" style="gap:8px">${docBadge(x.s.status)}${esc(DOCS[x.id].name)}${x.opt ? ` <span class="muted">(opcional)</span>` : ""}</li>`).join("")}</ul></details>` : ""}
    </section>`;
  }).join("");
  return { title: "Documentos faltantes", shell: "app", nav: "faltantes", html: `
    <div class="page-head"><h1>Documentos faltantes</h1><p class="muted" style="margin-top:4px">Tudo o que ainda falta em cada inscrição, com ajuda do assistente de IA.</p></div>
    <div class="stack" style="--gap:18px">
      ${aiCard()}
      ${apps.length ? `<div class="stats"><div class="stat"><b>${tf}</b><span>${tf === 1 ? "Falta enviar" : "Faltam enviar"}</span></div><div class="stat"><b>${tc}</b><span>Para corrigir</span></div><div class="stat"><b>${te}</b><span>Obrigatórios enviados</span></div></div>${cards}`
        : empty("inbox", "Nenhuma inscrição em preenchimento.", "Inicie uma inscrição para ver aqui os documentos que faltam.", `<a class="btn btn-primary" href="#/buscar">Encontrar editais</a>`)}
    </div>`,
  mount() { const off = mountAi(); if (focus) { const el = $("#app-" + focus); el && el.scrollIntoView({ block: "start" }); } return off; } };
};

/* ========= Inicialização ========= */
(function mountSupportFab() {
  const b = document.createElement("button");
  b.type = "button"; b.className = "support-fab no-print"; b.dataset.act = "suporte";
  b.setAttribute("aria-label", "Precisa de ajuda?");
  b.innerHTML = `${ic("chat")}<span>Precisa de ajuda?</span>`;
  document.body.appendChild(b);
})();
getDownloads().then(d => { if (!d && window.claude) document.body.classList.add("no-downloads"); });
getSample();
if (!location.hash) location.replace("#/inicio");
render();

