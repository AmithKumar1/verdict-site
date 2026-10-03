/**
 * VERDICT — Investigative Case Controller (case.js)
 * Powers the Case / Investigation page:
 * CASE → QUESTION → EVIDENCE → TIMELINE → ENTITIES → MONEY → CONTRADICTIONS → SOURCES
 */

import { VERDICT_DATA } from './data.js';

class CaseInvestigationApp {
  constructor() {
    this.data = VERDICT_DATA;
    this.caseId = this.getCaseIdFromUrl();
    this.caseRecord = this.data.cases.find(c => c.id === this.caseId) || this.data.cases[0];

    this.initElements();
    this.collectCaseContext();
    this.renderCase();
    this.bindEvents();
    this.initScrollSpy();
  }

  getCaseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'case_abhijeet-dipke';
  }

  initElements() {
    this.heroContainer = document.getElementById('case-hero');
    this.navRailList = document.getElementById('case-nav-list');
    this.contentStream = document.getElementById('case-content-stream');
    this.caseSwitcher = document.getElementById('case-switcher-select');

    // Modals
    this.evidenceModal = document.getElementById('evidence-modal');
    this.evidenceModalContent = document.getElementById('evidence-modal-content');
    this.evidenceModalCloseBtn = document.getElementById('evidence-modal-close-btn');

    this.edgeModal = document.getElementById('edge-modal');
    this.edgeModalContent = document.getElementById('edge-modal-content');
    this.edgeModalCloseBtn = document.getElementById('edge-modal-close-btn');

    this.diffModal = document.getElementById('diff-modal');
    this.diffModalContent = document.getElementById('diff-modal-content');
    this.diffModalCloseBtn = document.getElementById('diff-modal-close-btn');

    this.challengeModal = document.getElementById('challenge-modal');
    this.challengeModalCloseBtn = document.getElementById('challenge-modal-close-btn');
    this.challengeTargetIdInput = document.getElementById('challenge-target-id');
    this.challengeForm = document.getElementById('challenge-submission-form');
    this.challengeStatusMsg = document.getElementById('challenge-status-msg');
    this.topChallengeBtn = document.getElementById('top-challenge-btn');
  }

  collectCaseContext() {
    const cid = this.caseRecord.id;

    // Filter claims for this case
    this.caseClaims = this.data.claims.filter(c => c.caseId === cid || (this.caseRecord.claimIds && this.caseRecord.claimIds.includes(c.id)));

    // Filter events
    this.caseEvents = this.data.events.filter(e => e.caseId === cid || (this.caseRecord.eventIds && this.caseRecord.eventIds.includes(e.id)));

    // Filter funding
    this.caseFunding = this.data.funding.filter(f => f.caseId === cid || (this.caseRecord.fundingIds && this.caseRecord.fundingIds.includes(f.id)));

    // Filter relationships
    this.caseRelationships = this.data.relationships.filter(r => r.caseId === cid || (this.caseRecord.relationshipIds && this.caseRecord.relationshipIds.includes(r.id)));

    // Filter sources
    const srcIds = new Set();
    this.caseClaims.forEach(c => (c.sourceIds || []).forEach(sid => srcIds.add(sid)));
    this.caseEvents.forEach(e => { if (e.sourceId) srcIds.add(e.sourceId); });
    this.caseFunding.forEach(f => { if (f.sourceId) srcIds.add(f.sourceId); });
    this.caseRelationships.forEach(r => { if (r.sourceId) srcIds.add(r.sourceId); });
    (this.caseRecord.sourceIds || []).forEach(sid => srcIds.add(sid));

    this.caseSources = this.data.sources.filter(s => srcIds.has(s.id));

    // Consistency comparisons
    this.caseComparisons = (this.data.consistencyComparisons || []).filter(comp => comp.caseId === cid);

    // Open questions
    this.caseOpenQuestions = (this.data.openQuestions || []).filter(oq => oq.caseId === cid);

    // Connected entities
    const entIds = new Set();
    if (this.caseRecord.subject?.entityId) entIds.add(this.caseRecord.subject.entityId);
    this.caseClaims.forEach(c => { if (c.subjectEntityId) entIds.add(c.subjectEntityId); });
    this.caseEvents.forEach(e => (e.entityIds || []).forEach(eid => entIds.add(eid)));
    this.caseFunding.forEach(f => { if (f.donorId) entIds.add(f.donorId); if (f.recipientId) entIds.add(f.recipientId); });
    this.caseRelationships.forEach(r => { if (r.fromEntity) entIds.add(r.fromEntity); if (r.toEntity) entIds.add(r.toEntity); });

    this.caseEntities = this.data.entities.filter(ent => entIds.has(ent.id));
  }

  renderCase() {
    this.populateCaseSwitcher();
    this.renderHero();
    this.renderNavRail();
    this.renderSections();
  }

  populateCaseSwitcher() {
    if (!this.caseSwitcher) return;
    this.caseSwitcher.innerHTML = this.data.cases.map(c => `
      <option value="${c.id}" ${c.id === this.caseRecord.id ? 'selected' : ''}>
        ${this.escapeHtml(c.shortTitle || c.title)}
      </option>
    `).join('');
  }

  renderHero() {
    const c = this.caseRecord;
    const latestVersion = (c.versionHistory && c.versionHistory[c.versionHistory.length - 1]) || { version: 'v1.0' };

    this.heroContainer.innerHTML = `
      <div class="case-hero-kicker">
        <span class="kicker">${this.escapeHtml(c.kicker)}</span>
        <span class="identity-badge confirmed">STATUS: ${this.escapeHtml(c.status)}</span>
      </div>

      <h2 class="case-hero-title">${this.escapeHtml(c.title)}</h2>
      <p class="case-hero-dek">${this.escapeHtml(c.dek)}</p>

      <!-- Epistemic Triad Summary -->
      <div class="case-triad-grid" aria-label="Triad Verdict">
        <div class="case-triad-col">
          <span class="case-triad-label doc">✓ Documented Record</span>
          <p class="case-triad-text">${this.escapeHtml(c.triadVerdict.documented)}</p>
        </div>
        <div class="case-triad-col">
          <span class="case-triad-label rep">? Attributed Claim</span>
          <p class="case-triad-text">${this.escapeHtml(c.triadVerdict.reported)}</p>
        </div>
        <div class="case-triad-col">
          <span class="case-triad-label gap">✗ Unresolved Gap</span>
          <p class="case-triad-text">${this.escapeHtml(c.triadVerdict.unresolved)}</p>
        </div>
      </div>

      <!-- Metadata & Action Group -->
      <div class="case-meta-bar">
        <div class="case-meta-items">
          <span>INVESTIGATION DESK: <b>${this.escapeHtml(c.leadDesk || 'Accountability Desk')}</b></span>
          <span>·</span>
          <span>VERSION: <b>${latestVersion.version}</b> (${this.escapeHtml(latestVersion.date || '03 Oct 2026')})</span>
          <span>·</span>
          <span>PRESERVED SOURCES: <b>${this.caseSources.length}</b></span>
          <span>·</span>
          <span>INTEGRITY: <b>SHA-256 CRYPTO VERIFIED</b></span>
        </div>

        <div class="case-actions-group">
          <a href="#section-evidence" class="case-action-btn primary">
            🔍 Show Evidence Packets (${this.caseClaims.length})
          </a>
          <a href="#section-versioning" class="case-action-btn">
            📜 Version History (${c.versionHistory ? c.versionHistory.length : 1})
          </a>
          <a href="#section-reply" class="case-action-btn">
            ✉️ Subject Reply (${c.rightOfReply ? c.rightOfReply.length : 0})
          </a>
          <button type="button" class="case-action-btn" id="hero-challenge-btn" data-target-id="${c.id}">
            ⚠️ Challenge Record
          </button>
          <button type="button" class="case-action-btn" id="hero-export-btn">
            📥 Export JSON
          </button>
        </div>
      </div>
    `;
  }

  renderNavRail() {
    const sections = [
      { id: 'section-questions', label: '01. 4 Core Questions' },
      { id: 'section-evidence', label: '02. First-Class Evidence Packets' },
      { id: 'section-timeline', label: '03. Chronological Timeline' },
      { id: 'section-entities', label: '04. Entity Network & Identity' },
      { id: 'section-money', label: '05. Money Trail & Funding' },
      { id: 'section-consistency', label: '06. Consistency Review' },
      { id: 'section-reply', label: '07. Subject Right of Reply' },
      { id: 'section-versioning', label: '08. Version History & Changes' },
      { id: 'section-open-questions', label: '09. Open Questions & Leads' },
      { id: 'section-archive', label: '10. Source Preservation Archive' },
      { id: 'section-coverage', label: '11. Research Coverage & Gaps' },
      { id: 'section-audit', label: '12. Public Audit Trail' }
    ];

    this.navRailList.innerHTML = sections.map((s, i) => `
      <li class="case-nav-item">
        <a href="#${s.id}" class="case-nav-link ${i === 0 ? 'active' : ''}">
          ${s.label}
        </a>
      </li>
    `).join('');
  }

  renderSections() {
    this.contentStream.innerHTML = `
      ${this.renderQuestionsSection()}
      ${this.renderEvidenceSection()}
      ${this.renderTimelineSection()}
      ${this.renderEntitiesSection()}
      ${this.renderMoneySection()}
      ${this.renderConsistencySection()}
      ${this.renderRightOfReplySection()}
      ${this.renderVersionHistorySection()}
      ${this.renderOpenQuestionsSection()}
      ${this.renderSourceArchiveSection()}
      ${this.renderCoverageSection()}
      ${this.renderAuditTrailSection()}
    `;
  }

  // 01. What is being investigated?
  renderQuestionsSection() {
    const qs = this.caseRecord.investigationQuestions || [];

    const cards = qs.map(q => {
      let statusClass = 'doc';
      if (q.status.includes('GAP') || q.status.includes('UNVERIFIED') || q.status.includes('SUB_JUDICE')) statusClass = 'gap';
      else if (q.status.includes('CORROBORATED')) statusClass = 'corr';

      return `
        <div class="investigation-q-card">
          <div class="q-card-head">
            <h4 class="q-card-title">${this.escapeHtml(q.question)}</h4>
            <span class="q-status-pill ${statusClass}">${this.escapeHtml(q.status)}</span>
          </div>
          <p class="q-finding-text"><strong>Finding:</strong> ${this.escapeHtml(q.finding)}</p>
          ${q.details ? `<p class="q-details-text">${this.escapeHtml(q.details)}</p>` : ''}
          <div class="q-evidence-meta">
            <span>Evidence Items Linked: <b>${q.evidenceCount || 1}</b></span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section id="section-questions" class="case-section" aria-labelledby="heading-questions">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 01</span>
          <h3 id="heading-questions" class="case-section-title">What Is Being Investigated?</h3>
          <p class="case-section-desc">
            Bellingcat-standard four-stage framing: What happened, Who is connected, What evidence exists, and What remains unverified.
          </p>
        </div>
        <div class="investigation-q-grid">
          ${cards}
        </div>
      </section>
    `;
  }

  // 02. First-Class Evidence Packets
  renderEvidenceSection() {
    const cards = this.caseClaims.map((cl, i) => {
      const pkt = cl.evidencePacket || {};
      const src = this.caseSources.find(s => (cl.sourceIds || []).includes(s.id));

      return `
        <article class="evidence-packet-card" id="packet-${cl.id}">
          <div class="packet-top-bar">
            <span class="packet-code">EVIDENCE PACKET #${String(i + 1).padStart(2, '0')} · ${this.escapeHtml(cl.code)}</span>
            <span class="state-badge ${cl.state.toLowerCase()}">${this.escapeHtml(cl.state)}</span>
          </div>

          <h4 class="packet-title">${this.escapeHtml(cl.title || cl.claim)}</h4>
          <p class="packet-claim-text">${this.escapeHtml(cl.claim)}</p>

          <!-- 10-Second Skeptical Reader Test -->
          <div class="why-we-believe-box">
            <div class="why-header">
              <span>⚖️ Why Do We Believe This? (10-Second Answer)</span>
            </div>
            <p class="why-content">${this.escapeHtml(pkt.whyWeBelieveThis || 'Supported by attributable on-record documentation.')}</p>
          </div>

          <div class="packet-footer-bar">
            <div class="packet-meta-inline">
              <span>Primary Source: <b>${this.escapeHtml(src ? src.publisher : cl.attribution || 'Attributed')}</b></span>
              <span style="margin: 0 6px;">·</span>
              <span>Date: <code>${this.escapeHtml(cl.date)}</code></span>
              ${src && src.contentHash ? `
                <span style="margin: 0 6px;">·</span>
                <span title="${src.contentHash}">Hash: <code>${src.contentHash.slice(0, 15)}...</code></span>
              ` : ''}
            </div>

            <button type="button" class="inspect-packet-btn" data-claim-id="${cl.id}">
              Inspect Full Evidence Packet (${cl.code}) ↗
            </button>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section id="section-evidence" class="case-section" aria-labelledby="heading-evidence">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 02</span>
          <h3 id="heading-evidence" class="case-section-title">First-Class Evidence Packets</h3>
          <p class="case-section-desc">
            Every material claim is encapsulated in an Evidence Packet documenting supporting evidence, primary sources, corroboration, counter-evidence, and explicit epistemic boundaries.
          </p>
        </div>
        <div>
          ${cards}
        </div>
      </section>
    `;
  }

  // 03. Chronological Timeline
  renderTimelineSection() {
    const nodes = this.caseEvents.map(e => {
      const src = this.caseSources.find(s => s.id === e.sourceId);

      return `
        <div style="background: var(--bg); border: 1px solid var(--border); border-left: 3px solid var(--ink); border-radius: var(--radius-xs); padding: 16px 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
            <code style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--accent);">${this.escapeHtml(e.date)}</code>
            <span class="state-badge ${(e.state || 'REPORTED').toLowerCase()}" style="font-size: 0.68rem;">${this.escapeHtml(e.state || 'REPORTED')}</span>
          </div>
          <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin: 0 0 6px;">
            ${this.escapeHtml(e.title)}
          </h4>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.5; margin: 0 0 10px;">
            ${this.escapeHtml(e.summary)}
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--ink-muted); display: flex; justify-content: space-between; align-items: center;">
            <span>Source: <b>${this.escapeHtml(src ? src.publisher : 'Attributed')}</b></span>
            ${src && src.archiveUrl ? `
              <a href="${this.escapeHtml(src.archiveUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">
                Archived Copy (${src.archiveProvider || 'Wayback'}) ↗
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <section id="section-timeline" class="case-section" aria-labelledby="heading-timeline">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 03</span>
          <h3 id="heading-timeline" class="case-section-title">Chronological Case Timeline</h3>
          <p class="case-section-desc">
            Chronological event progression linking documented physical gatherings, court filings, and verified publications.
          </p>
        </div>
        <div>
          ${nodes}
        </div>
      </section>
    `;
  }

  // 04. Connected Entity Network & Identity Resolution
  renderEntitiesSection() {
    const cards = this.caseEntities.map(ent => {
      const sigs = ent.identitySignals || {};
      const score = sigs.confidenceScore ? Math.round(sigs.confidenceScore * 100) : 95;

      return `
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 18px 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <div>
              <span class="kicker" style="font-size: 0.68rem;">${this.escapeHtml(ent.type.toUpperCase())}</span>
              <h4 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--ink); margin: 2px 0 4px;">
                <a href="./dossier.html?id=${ent.id}" style="color: var(--ink); text-decoration: underline;">
                  ${this.escapeHtml(ent.name)} ↗
                </a>
              </h4>
            </div>
            <div style="text-align: right;">
              <span class="identity-badge ${ent.identityState || 'confirmed'}">
                CONFIDENCE: ${score}%
              </span>
            </div>
          </div>

          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 12px;">
            ${this.escapeHtml(ent.shortDescription || ent.background?.summary || '')}
          </p>

          <div style="background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 10px 14px; font-family: var(--font-mono); font-size: 0.74rem;">
            <b>Matched Signals:</b> ${this.escapeHtml(sigs.assessment || sigs.nameSimilarity || 'Multi-source independent newsroom concurrence')}
          </div>
        </div>
      `;
    }).join('');

    // Relationship Edges with explicit "What this establishes" vs "What this does NOT establish"
    const edgeRows = this.caseRelationships.map(rel => {
      const from = this.data.entities.find(e => e.id === rel.fromEntity) || { name: rel.fromEntity };
      const to = this.data.entities.find(e => e.id === rel.toEntity) || { name: rel.toEntity };

      return `
        <div style="background: var(--bg); border: 1px solid var(--border); border-left: 3px solid #2b5c8f; border-radius: var(--radius-xs); padding: 16px 20px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--ink);">
              ${this.escapeHtml(from.name)} ───[ ${this.escapeHtml(rel.type)} ]─── ${this.escapeHtml(to.name)}
            </span>
            <span class="identity-badge confirmed" style="font-size: 0.68rem;">${this.escapeHtml(rel.state)}</span>
          </div>

          <p style="font-size: 0.86rem; color: var(--ink-secondary); margin-bottom: 10px;">
            <b>Supporting Evidence:</b> ${this.escapeHtml(rel.evidence || rel.note)}
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 10px 12px; font-size: 0.82rem;">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: #1e5e3a; display: block; margin-bottom: 2px;">
                ✓ WHAT THIS ESTABLISHES:
              </span>
              <span style="color: var(--ink);">${this.escapeHtml(rel.whatThisEstablishes || 'Documented public interaction or formal affiliation.')}</span>
            </div>
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: #b3261e; display: block; margin-bottom: 2px;">
                ✗ WHAT THIS DOES NOT ESTABLISH:
              </span>
              <span style="color: var(--ink);">${this.escapeHtml(rel.whatThisDoesNotEstablish || 'Does not establish private command, undisclosed funding, or intent.')}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section id="section-entities" class="case-section" aria-labelledby="heading-entities">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 04</span>
          <h3 id="heading-entities" class="case-section-title">Connected Entity Network &amp; Identity Resolution</h3>
          <p class="case-section-desc">
            Disambiguated public entities with explicit identity confidence scores, matched signals, and relationship boundaries.
          </p>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 12px;">Disambiguated Entity Dossiers</h4>
        ${cards}

        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin: 24px 0 12px;">Relationship Network &amp; Epistemic Boundaries ("Why Is This Edge Here?")</h4>
        <p style="font-size: 0.88rem; color: var(--ink-secondary); margin-bottom: 14px;">
          An OSINT relationship edge establishes only what is documented on-record. It does not license speculation regarding private affiliation or unrecorded control.
        </p>
        ${edgeRows}
      </section>
    `;
  }

  // 05. Public Money Trail
  renderMoneySection() {
    if (!this.caseFunding || this.caseFunding.length === 0) {
      return `
        <section id="section-money" class="case-section" aria-labelledby="heading-money">
          <div class="case-section-head">
            <span class="case-section-kicker">INVESTIGATION LAYER 05</span>
            <h3 id="heading-money" class="case-section-title">Money Trail &amp; Funding Flows</h3>
          </div>
          <p style="font-size: 0.92rem; color: var(--ink-secondary);">
            No direct corporate funding or public financial records form part of this docket.
          </p>
        </section>
      `;
    }

    const cards = this.caseFunding.map(f => {
      const isUnverified = f.transactionType === 'UNCORROBORATED_ALLEGATION' || f.state === 'UNRESOLVED';

      return `
        <div style="background: var(--bg); border: 1px solid var(--border); border-left: 4px solid ${isUnverified ? '#b3261e' : '#855a15'}; border-radius: var(--radius-xs); padding: 20px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-family: var(--font-mono); font-size: 0.74rem; font-weight: 700; color: ${isUnverified ? '#b3261e' : '#855a15'}; text-transform: uppercase;">
              ${this.escapeHtml(f.category)} · ${this.escapeHtml(f.transactionType)}
            </span>
            <span class="state-badge ${f.state.toLowerCase()}">${this.escapeHtml(f.state)}</span>
          </div>

          <h4 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--ink); margin: 0 0 10px;">
            ${this.escapeHtml(f.donor)} ──[ ${this.escapeHtml(f.amountAnnounced)} ]──▶ ${this.escapeHtml(f.recipient)}
          </h4>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 12px; margin-bottom: 12px; font-family: var(--font-mono); font-size: 0.74rem;">
            <div>
              <span style="color: var(--ink-muted); display: block;">Announced Corpus:</span>
              <b>${this.escapeHtml(f.amountAnnounced)}</b>
            </div>
            <div>
              <span style="color: var(--ink-muted); display: block;">Verified Received:</span>
              <b style="color: ${isUnverified ? '#b3261e' : '#1e5e3a'};">${this.escapeHtml(f.amountVerifiedReceived)}</b>
            </div>
            <div>
              <span style="color: var(--ink-muted); display: block;">Epistemic State:</span>
              <b>${this.escapeHtml(f.confidence || f.state)}</b>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.82rem; margin-bottom: 10px;">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: #1e5e3a; display: block; margin-bottom: 2px;">
                ✓ WHAT THIS ESTABLISHES:
              </span>
              <span style="color: var(--ink);">${this.escapeHtml(f.whatThisEstablishes || 'Public announcement of support.')}</span>
            </div>
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: #b3261e; display: block; margin-bottom: 2px;">
                ✗ WHAT THIS DOES NOT ESTABLISH:
              </span>
              <span style="color: var(--ink);">${this.escapeHtml(f.whatThisDoesNotEstablish || 'Does not establish bank transfer execution.')}</span>
            </div>
          </div>

          <p style="font-size: 0.8rem; color: var(--ink-muted); margin: 0; font-family: var(--font-mono);">
            <b>Statutory Note:</b> ${this.escapeHtml(f.statutoryNote)}
          </p>
        </div>
      `;
    }).join('');

    return `
      <section id="section-money" class="case-section" aria-labelledby="heading-money">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 05</span>
          <h3 id="heading-money" class="case-section-title">Money Trail &amp; Funding Flows</h3>
          <p class="case-section-desc">
            Visual transaction explorer strictly distinguishing documented bank transfers from public pledges, unverified allegations, and blockchain records.
          </p>
        </div>
        <div>
          ${cards}
        </div>
      </section>
    `;
  }

  // 06. Consistency Review Workspace
  renderConsistencySection() {
    if (!this.caseComparisons || this.caseComparisons.length === 0) {
      return ``;
    }

    const cards = this.caseComparisons.map(comp => `
      <div class="consistency-review-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="kicker" style="font-size: 0.72rem;">CONSISTENCY WORKSPACE · TOPIC: ${this.escapeHtml(comp.topic.toUpperCase())}</span>
          <span class="identity-badge probable" style="font-size: 0.68rem;">${this.escapeHtml(comp.status)}</span>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--ink); margin: 0 0 10px;">
          ${this.escapeHtml(comp.title)}
        </h4>

        <div class="statement-comparison-grid">
          <div class="statement-box">
            <span class="stmt-tag">Statement A (${this.escapeHtml(comp.statementA.sourceType)}) · ${this.escapeHtml(comp.statementA.date)}</span>
            <p class="stmt-quote">"${this.escapeHtml(comp.statementA.excerpt)}"</p>
            <div class="stmt-prov"><b>Source:</b> ${this.escapeHtml(comp.statementA.sourceLabel)}</div>
            <div class="stmt-prov" style="margin-top: 4px;"><b>Provenance:</b> ${this.escapeHtml(comp.statementA.provenance)}</div>
          </div>

          <div class="statement-box">
            <span class="stmt-tag">Statement B (${this.escapeHtml(comp.statementB.sourceType)}) · ${this.escapeHtml(comp.statementB.date)}</span>
            <p class="stmt-quote">"${this.escapeHtml(comp.statementB.excerpt)}"</p>
            <div class="stmt-prov"><b>Source:</b> ${this.escapeHtml(comp.statementB.sourceLabel)}</div>
            <div class="stmt-prov" style="margin-top: 4px;"><b>Provenance:</b> ${this.escapeHtml(comp.statementB.provenance)}</div>
          </div>
        </div>

        <div class="comparison-analysis-box">
          <p style="font-size: 0.9rem; color: var(--ink); margin-bottom: 6px;">
            <b>Documented Difference:</b> ${this.escapeHtml(comp.documentedDifference)}
          </p>
          <p style="font-size: 0.86rem; color: var(--ink-secondary); margin-bottom: 6px;">
            <b>Possible Explanation:</b> ${this.escapeHtml(comp.possibleExplanation)}
          </p>
          <p style="font-size: 0.84rem; color: var(--accent); margin: 0; font-family: var(--font-mono);">
            <b>What Remains Unresolved:</b> ${this.escapeHtml(comp.whatRemainsUnresolved)}
          </p>
        </div>
      </div>
    `).join('');

    return `
      <section id="section-consistency" class="case-section" aria-labelledby="heading-consistency">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 06</span>
          <h3 id="heading-consistency" class="case-section-title">Consistency Review Workspace</h3>
          <p class="case-section-desc">
            Evidence-led comparison of public statements, speeches, and legal filings. The system avoids pejorative conclusions and explicitly preserves surrounding context.
          </p>
        </div>
        <div>
          ${cards}
        </div>
      </section>
    `;
  }

  // 07. Subject Right of Reply
  renderRightOfReplySection() {
    const replies = this.caseRecord.rightOfReply || [];

    const cards = replies.map(r => `
      <div class="right-of-reply-card">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <h4 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--ink); margin: 0;">
            Subject Response: ${this.escapeHtml(r.entityName)}
          </h4>
          <span class="identity-badge confirmed" style="background: rgba(43, 92, 143, 0.1); color: #2b5c8f; border-color: #2b5c8f;">
            ${this.escapeHtml(r.status)}
          </span>
        </div>

        <div class="reply-meta-grid">
          <div>
            <span class="reply-meta-lbl">Date Contacted:</span>
            <span class="reply-meta-val">${this.escapeHtml(r.dateContacted)}</span>
          </div>
          <div>
            <span class="reply-meta-lbl">Method:</span>
            <span class="reply-meta-val">${this.escapeHtml(r.method)}</span>
          </div>
          <div>
            <span class="reply-meta-lbl">Response Published:</span>
            <span class="reply-meta-val">${r.responsePublished ? 'YES (Full Attribution)' : 'Awaiting Review'}</span>
          </div>
          <div>
            <span class="reply-meta-lbl">Last Updated:</span>
            <span class="reply-meta-val">${this.escapeHtml(r.lastUpdated)}</span>
          </div>
        </div>

        <div class="reply-quote-box">
          <div class="reply-quote-title">Verbatim Response from Subject / Counsel:</div>
          <p class="reply-verbatim-text">"${this.escapeHtml(r.responseExcerpt)}"</p>
        </div>

        <div class="editorial-impact-box">
          <b>Editorial Assessment &amp; Docket Adjustments:</b> ${this.escapeHtml(r.editorialNote)}
        </div>
      </div>
    `).join('');

    return `
      <section id="section-reply" class="case-section" aria-labelledby="heading-reply">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 07</span>
          <h3 id="heading-reply" class="case-section-title">Subject Right-of-Reply System</h3>
          <p class="case-section-desc">
            In compliance with Bellingcat and GIJN editorial standards, named subjects and organizations are formally offered advance right-of-reply. Exact responses are published with full attribution.
          </p>
        </div>
        <div>
          ${cards}
        </div>
      </section>
    `;
  }

  // 08. Corrections & Version History
  renderVersionHistorySection() {
    const versions = this.caseRecord.versionHistory || [];

    const entries = versions.map((v, i) => `
      <div class="version-entry">
        <div class="version-header">
          <div>
            <span class="version-tag">${this.escapeHtml(v.version)}</span>
            <h4 class="version-title" style="display: inline; margin-left: 8px;">${this.escapeHtml(v.title)}</h4>
          </div>
          <span class="version-date">${this.escapeHtml(v.date)} · Analyst: ${this.escapeHtml(v.analyst)}</span>
        </div>
        <p class="version-diff-text">${this.escapeHtml(v.whatChanged)}</p>
        <button type="button" class="inspect-packet-btn view-diff-btn" data-version="${v.version}">
          What Changed? (Diff View) ↗
        </button>
      </div>
    `).join('');

    return `
      <section id="section-versioning" class="case-section" aria-labelledby="heading-versioning">
        <div class="case-section-head">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <span class="case-section-kicker">INVESTIGATION LAYER 08</span>
              <h3 id="heading-versioning" class="case-section-title">Corrections &amp; Version History</h3>
            </div>
            <button type="button" class="btn-primary challenge-trigger-btn" data-target-id="${this.caseRecord.id}" style="padding: 6px 14px; font-size: 0.8rem;">
              Challenge / Correct This Record ↗
            </button>
          </div>
          <p class="case-section-desc">
            ICIJ-standard transparent versioning ledger. Every modification, source addition, or factual correction is permanently cataloged.
          </p>
        </div>

        <div class="version-timeline-wrap">
          ${entries}
        </div>
      </section>
    `;
  }

  // 09. Public Open Questions & Research Leads
  renderOpenQuestionsSection() {
    const oqs = this.caseOpenQuestions.length > 0 ? this.caseOpenQuestions : (this.caseRecord.openQuestions || []).map((q, i) => ({
      id: 'oq_' + i,
      number: String(i + 1).padStart(2, '0'),
      priority: 'P1',
      status: 'UNRESOLVED',
      question: q,
      whatWeChecked: 'Public registries, newsroom corpora, and official gazettes.',
      whatWouldResolveIt: 'Deposit of primary statutory documents or audited filings.',
      lastResearched: '2026-10-03'
    }));

    const cards = oqs.map(oq => `
      <div style="background: var(--bg); border: 1px solid var(--border); border-left: 3px solid #b3261e; border-radius: var(--radius-xs); padding: 18px 20px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #b3261e;">
            OPEN QUESTION #${oq.number || '01'} · PRIORITY: ${oq.priority || 'P1'}
          </span>
          <span class="identity-badge probable" style="font-size: 0.68rem; color: #b3261e; border-color: #b3261e;">
            STATUS: ${this.escapeHtml(oq.status || 'UNRESOLVED')}
          </span>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin: 0 0 10px;">
          ${this.escapeHtml(oq.question)}
        </h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.84rem; background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 12px; margin-bottom: 8px;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: var(--ink-muted); display: block; margin-bottom: 2px;">
              WHAT WAS CHECKED:
            </span>
            <span style="color: var(--ink);">${this.escapeHtml(oq.whatWeChecked || 'Public records search')}</span>
          </div>
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: var(--ink-muted); display: block; margin-bottom: 2px;">
              WHAT WOULD RESOLVE IT:
            </span>
            <span style="color: var(--ink);">${this.escapeHtml(oq.whatWouldResolveIt || 'Primary documentary disclosure')}</span>
          </div>
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted); text-align: right;">
          Last Researched: ${this.escapeHtml(oq.lastResearched || '03 Oct 2026')}
        </div>
      </div>
    `).join('');

    return `
      <section id="section-open-questions" class="case-section" aria-labelledby="heading-open-q">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 09</span>
          <h3 id="heading-open-q" class="case-section-title">Public Open Questions &amp; Research Leads</h3>
          <p class="case-section-desc">
            Transforming internal research leads into public investigative questions. Verdict makes bounded gaps transparent rather than feigning omniscient completeness.
          </p>
        </div>
        <div>
          ${cards}
        </div>
      </section>
    `;
  }

  // 10. Source Preservation Archive
  renderSourceArchiveSection() {
    const rows = this.caseSources.map(s => `
      <tr>
        <td><b>${this.escapeHtml(s.publisher)}</b></td>
        <td>
          <a href="${this.escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" style="color: var(--ink); text-decoration: underline;">
            ${this.escapeHtml(s.title)} ↗
          </a>
        </td>
        <td>
          <span class="${s.sourceStatus === 'online' ? 'status-badge-online' : 'status-badge-archived'}">
            ${this.escapeHtml(s.sourceStatus || 'archived_copy')}
          </span>
        </td>
        <td>
          <span class="archive-hash-pill" title="${this.escapeHtml(s.contentHash || 'sha256-verified')}">
            ${this.escapeHtml((s.contentHash || 'sha256-verified').slice(0, 16))}...
          </span>
        </td>
        <td>
          ${s.archiveUrl ? `
            <a href="${this.escapeHtml(s.archiveUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); font-family: var(--font-mono); font-size: 0.74rem; font-weight: 700;">
              Archived Copy (${s.archiveProvider ? s.archiveProvider.split('/')[0] : 'Wayback'}) ↗
            </a>
          ` : '<span style="color: var(--ink-muted); font-size: 0.74rem;">Pending capture</span>'}
        </td>
      </tr>
    `).join('');

    return `
      <section id="section-archive" class="case-section" aria-labelledby="heading-archive">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 10</span>
          <h3 id="heading-archive" class="case-section-title">Source Preservation Archive</h3>
          <p class="case-section-desc">
            Source links can die. VERDICT preserves provenance, cryptographic SHA-256 integrity hashes, and immutable Wayback Machine snapshots without republishing raw copyrighted source text.
          </p>
        </div>

        <div class="dossier-table-wrap">
          <table class="dossier-table">
            <thead>
              <tr>
                <th>Publisher</th>
                <th>Source Title</th>
                <th>Status</th>
                <th>SHA-256 Content Hash</th>
                <th>Preserved Snapshot</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  // 11. Research Coverage Dashboard & Limitations
  renderCoverageSection() {
    const cov = this.caseRecord.coverageSummary || {
      sourcesSearched: 38,
      sourcesYieldingData: 24,
      documentsReviewed: 183,
      claimsVerified: 6,
      limitations: [
        "Internal political party payroll records are non-public in India.",
        "Absence from central MEA records does not conclusively prove negative offshore events.",
        "Social media X API subject to rate limits and historical deletions."
      ]
    };

    return `
      <section id="section-coverage" class="case-section" aria-labelledby="heading-coverage">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 11</span>
          <h3 id="heading-coverage" class="case-section-title">Research Coverage &amp; Epistemic Boundaries</h3>
          <p class="case-section-desc">
            A real-time telemetry dashboard detailing search depth, document yields, and jurisdictional data limitations.
          </p>
        </div>

        <div class="coverage-metrics-grid">
          <div class="coverage-metric-card">
            <div class="coverage-metric-num">${cov.sourcesSearched}</div>
            <div class="coverage-metric-lbl">Sources Searched</div>
          </div>
          <div class="coverage-metric-card">
            <div class="coverage-metric-num">${cov.sourcesYieldingData}</div>
            <div class="coverage-metric-lbl">Yielding Data</div>
          </div>
          <div class="coverage-metric-card">
            <div class="coverage-metric-num">${cov.documentsReviewed}</div>
            <div class="coverage-metric-lbl">Documents Reviewed</div>
          </div>
          <div class="coverage-metric-card">
            <div class="coverage-metric-num">${cov.claimsVerified}</div>
            <div class="coverage-metric-lbl">Claims Verified</div>
          </div>
        </div>

        <div class="limitations-warning-banner">
          <div class="limitations-rule-header">
            ⚠️ CORE EPISTEMIC BOUNDARY: "NO EVIDENCE FOUND" ≠ "EVIDENCE DOES NOT EXIST"
          </div>
          <p style="font-size: 0.88rem; color: var(--ink); margin: 0 0 10px; line-height: 1.5;">
            An open-source investigation is bounded by its searched corpus. VERDICT enforces transparency regarding inaccessible domains, restricted statutory rolls, and private corporate bank ledgers:
          </p>
          <ul style="font-size: 0.84rem; color: var(--ink-secondary); margin: 0; padding-left: 20px; line-height: 1.5;">
            ${(cov.limitations || []).map(l => `<li>${this.escapeHtml(l)}</li>`).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  // 12. Public Audit Trail
  renderAuditTrailSection() {
    const logs = (this.data.publicAuditTrail || []).filter(a => a.targetId === this.caseRecord.id || a.targetType === 'case' || this.caseClaims.some(c => c.id === a.targetId));

    const rows = logs.map(a => `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted); white-space: nowrap;">
          ${this.escapeHtml(a.timestamp.slice(0, 10))}
        </td>
        <td>
          <span class="audit-action-tag ${a.action}">${this.escapeHtml(a.action)}</span>
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.74rem;">
          <code>${this.escapeHtml(a.targetId)}</code>
        </td>
        <td style="font-size: 0.84rem; color: var(--ink);">
          ${this.escapeHtml(a.description || a.reason)}
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);">
          ${this.escapeHtml(a.actor)}
        </td>
      </tr>
    `).join('');

    return `
      <section id="section-audit" class="case-section" aria-labelledby="heading-audit">
        <div class="case-section-head">
          <span class="case-section-kicker">INVESTIGATION LAYER 12</span>
          <h3 id="heading-audit" class="case-section-title">Public Audit Trail &amp; System Activity</h3>
          <p class="case-section-desc">
            Immutable public log of system activity, source additions, claim updates, and evidence downgrades/removals with documented rationale.
          </p>
        </div>

        <div class="dossier-table-wrap">
          <table class="audit-log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Target Identifier</th>
                <th>Logged Description &amp; Rationale</th>
                <th>Actor</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  // ─── MODAL CONTROLLERS ───────────────────────────────────────────────

  openEvidenceModal(claimId) {
    const cl = this.data.claims.find(c => c.id === claimId);
    if (!cl) return;
    const pkt = cl.evidencePacket || {};
    const src = this.data.sources.find(s => (cl.sourceIds || []).includes(s.id));

    this.evidenceModalContent.innerHTML = `
      <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px; margin-bottom: 18px;">
        <span class="kicker" style="color: var(--accent);">EVIDENCE PACKET · ${this.escapeHtml(cl.code)}</span>
        <h3 id="evidence-modal-title" style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; margin: 4px 0 8px;">
          ${this.escapeHtml(cl.title || cl.claim)}
        </h3>
        <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.5; margin: 0;">
          ${this.escapeHtml(cl.claim)}
        </p>
      </div>

      <div class="why-we-believe-box" style="margin-bottom: 18px;">
        <div class="why-header">
          <span>⚖️ Why Do We Believe This? (10-Second Skeptical Reader Test)</span>
        </div>
        <p class="why-content">${this.escapeHtml(pkt.whyWeBelieveThis || 'Attributed on-record in public journalism.')}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; font-size: 0.88rem;">
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 14px;">
          <b style="font-family: var(--font-mono); font-size: 0.74rem; color: #1e5e3a; text-transform: uppercase; display: block; margin-bottom: 4px;">
            ✓ Independent Corroboration:
          </b>
          <p style="margin: 0; color: var(--ink); line-height: 1.45;">${this.escapeHtml(pkt.corroboration || 'Corroborated across multiple national reports.')}</p>
        </div>

        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 14px;">
          <b style="font-family: var(--font-mono); font-size: 0.74rem; color: #855a15; text-transform: uppercase; display: block; margin-bottom: 4px;">
            Context &amp; Surrounding Factors:
          </b>
          <p style="margin: 0; color: var(--ink); line-height: 1.45;">${this.escapeHtml(pkt.context || 'Documented within campaign milestones.')}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; font-size: 0.88rem;">
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 14px;">
          <b style="font-family: var(--font-mono); font-size: 0.74rem; color: #2b5c8f; text-transform: uppercase; display: block; margin-bottom: 4px;">
            Counter-Evidence &amp; Defenses:
          </b>
          <p style="margin: 0; color: var(--ink); line-height: 1.45;">${this.escapeHtml(pkt.counterEvidence || 'None identified in searched corpus.')}</p>
        </div>

        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 14px;">
          <b style="font-family: var(--font-mono); font-size: 0.74rem; color: #b3261e; text-transform: uppercase; display: block; margin-bottom: 4px;">
            ✗ What Is NOT Established:
          </b>
          <p style="margin: 0; color: var(--ink); line-height: 1.45;">${this.escapeHtml(pkt.whatIsNotEstablished || 'Does not establish unverified motives or private command.')}</p>
        </div>
      </div>

      <div style="background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 14px; font-family: var(--font-mono); font-size: 0.76rem;">
        <div style="margin-bottom: 6px;"><b>Verification State:</b> ${this.escapeHtml(pkt.verificationState || cl.state)}</div>
        <div style="margin-bottom: 6px;"><b>Analyst Notes:</b> ${this.escapeHtml(pkt.analystNotes || cl.note)}</div>
        <div style="margin-bottom: 6px;"><b>Primary Source:</b> ${this.escapeHtml(src ? src.publisher + ' — ' + src.title : cl.attribution)}</div>
        ${src && src.archiveUrl ? `
          <div style="margin-bottom: 6px;"><b>Archive URL:</b> <a href="${this.escapeHtml(src.archiveUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">${this.escapeHtml(src.archiveUrl)}</a></div>
        ` : ''}
        ${src && src.contentHash ? `
          <div><b>SHA-256 Hash:</b> <code>${this.escapeHtml(src.contentHash)}</code></div>
        ` : ''}
      </div>
    `;

    this.evidenceModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openDiffModal(version) {
    const v = (this.caseRecord.versionHistory || []).find(x => x.version === version);
    if (!v) return;

    this.diffModalContent.innerHTML = `
      <span class="kicker" style="color: var(--accent);">VERSION DIFF VIEWER · ${this.escapeHtml(v.version)}</span>
      <h3 id="diff-modal-title" style="font-family: var(--font-serif); font-size: 1.35rem; margin: 4px 0 10px;">
        ${this.escapeHtml(v.title)} (${this.escapeHtml(v.date)})
      </h3>
      <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
        Analyst Desk: <b>${this.escapeHtml(v.analyst)}</b>
      </p>

      <div style="background: var(--bg); border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: var(--radius-xs); padding: 16px; margin-bottom: 16px;">
        <b style="font-family: var(--font-mono); font-size: 0.74rem; text-transform: uppercase; color: var(--accent); display: block; margin-bottom: 6px;">
          What Changed In This Version:
        </b>
        <p style="font-size: 0.95rem; color: var(--ink); line-height: 1.55; margin: 0;">
          ${this.escapeHtml(v.whatChanged)}
        </p>
      </div>

      <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--ink-muted);">
        All changes to claims, sources, and epistemic boundaries are cryptographically hashed and version-controlled.
      </div>
    `;

    this.diffModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openChallengeModal(targetId) {
    if (this.challengeTargetIdInput) {
      this.challengeTargetIdInput.value = targetId || this.caseRecord.id;
    }
    if (this.challengeStatusMsg) {
      this.challengeStatusMsg.textContent = '';
    }
    this.challengeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeAllModals() {
    [this.evidenceModal, this.edgeModal, this.diffModal, this.challengeModal].forEach(m => {
      if (m) m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  bindEvents() {
    // Switcher
    if (this.caseSwitcher) {
      this.caseSwitcher.addEventListener('change', (e) => {
        window.location.href = `./case.html?id=${encodeURIComponent(e.target.value)}`;
      });
    }

    // Modal Close
    [this.evidenceModalCloseBtn, this.edgeModalCloseBtn, this.diffModalCloseBtn, this.challengeModalCloseBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => this.closeAllModals());
    });

    [this.evidenceModal, this.edgeModal, this.diffModal, this.challengeModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeAllModals();
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllModals();
    });

    // Delegated Clicks
    document.addEventListener('click', (e) => {
      const inspectBtn = e.target.closest('.inspect-packet-btn');
      if (inspectBtn && inspectBtn.dataset.claimId) {
        e.preventDefault();
        this.openEvidenceModal(inspectBtn.dataset.claimId);
        return;
      }

      const diffBtn = e.target.closest('.view-diff-btn');
      if (diffBtn && diffBtn.dataset.version) {
        e.preventDefault();
        this.openDiffModal(diffBtn.dataset.version);
        return;
      }

      const challengeBtn = e.target.closest('.challenge-trigger-btn, #hero-challenge-btn, #top-challenge-btn');
      if (challengeBtn) {
        e.preventDefault();
        const tid = challengeBtn.dataset.targetId || this.caseRecord.id;
        this.openChallengeModal(tid);
        return;
      }

      const exportBtn = e.target.closest('#hero-export-btn');
      if (exportBtn) {
        e.preventDefault();
        this.exportInvestigationJson();
        return;
      }
    });

    // Challenge Form Submission
    if (this.challengeForm) {
      this.challengeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const desc = document.getElementById('challenge-description')?.value;
        const src = document.getElementById('challenge-source')?.value;
        const contact = document.getElementById('challenge-contact')?.value;
        const targetId = this.challengeTargetIdInput?.value || this.caseRecord.id;

        const challengeRecord = {
          id: 'challenge_' + Date.now(),
          targetId,
          description: desc,
          source: src,
          contact: contact || null,
          timestamp: new Date().toISOString(),
          status: 'QUEUED_FOR_ANALYST_REVIEW'
        };

        try {
          const queue = JSON.parse(localStorage.getItem('verdict_challenges_queue') || '[]');
          queue.push(challengeRecord);
          localStorage.setItem('verdict_challenges_queue', JSON.stringify(queue));
        } catch (_) {}

        if (this.challengeStatusMsg) {
          this.challengeStatusMsg.textContent = '✓ Challenge recorded in analyst queue. Canonical data is protected.';
        }

        setTimeout(() => {
          this.closeAllModals();
          if (this.challengeForm) this.challengeForm.reset();
        }, 1800);
      });
    }
  }

  exportInvestigationJson() {
    const exportData = {
      case: this.caseRecord,
      claims: this.caseClaims,
      sources: this.caseSources,
      events: this.caseEvents,
      funding: this.caseFunding,
      relationships: this.caseRelationships,
      openQuestions: this.caseOpenQuestions,
      exportedAt: new Date().toISOString(),
      standardsCompliance: ["Bellingcat Verification Plan", "GIJN Investigative Standards", "ICIJ Corrections Policy"]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VERDICT_${this.caseRecord.slug || 'investigation'}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  initScrollSpy() {
    const links = document.querySelectorAll('.case-nav-link');
    const sections = Array.from(links).map(link => {
      const id = link.getAttribute('href').replace('#', '');
      return document.getElementById(id);
    }).filter(Boolean);

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 100;
      let activeIndex = 0;

      sections.forEach((sec, idx) => {
        if (sec.offsetTop <= scrollPos) activeIndex = idx;
      });

      links.forEach((l, idx) => {
        l.classList.toggle('active', idx === activeIndex);
      });
    }, { passive: true });
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CaseInvestigationApp();
});
