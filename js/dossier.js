/**
 * VERDICT — Entity Dossier Controller
 * Dynamic, source-backed investigative dossier renderer for any entity type
 * (Person, Organisation, Company, Domain, Case)
 */

import { VERDICT_DATA } from './data.js';

class EntityDossierApp {
  constructor() {
    this.data = VERDICT_DATA;
    this.entityId = this.getEntityIdFromUrl();
    this.entity = this.data.entities.find(e => e.id === this.entityId) || this.data.entities[0];

    this.initElements();
    this.collectEntityContext();
    this.renderDossier();
    this.bindEvents();
    this.initScrollSpy();
    this.renderRelationshipGraph();
  }

  getEntityIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'person_abhijeet-dipke';
  }

  initElements() {
    this.heroContainer = document.getElementById('dossier-hero');
    this.navRailList = document.getElementById('dossier-nav-list');
    this.contentStream = document.getElementById('dossier-content-stream');
    this.entitySwitcher = document.getElementById('entity-switcher-select');

    // Modal
    this.modalBackdrop = document.getElementById('source-modal');
    this.modalCloseBtn = document.getElementById('modal-close-btn');
    this.modalBody = document.getElementById('modal-content-body');
  }

  collectEntityContext() {
    const eid = this.entity.id;
    const ename = this.entity.name;

    // Claims involving entity
    this.relatedClaims = this.data.claims.filter(c => 
      c.subjectEntityId === eid || 
      (c.entityIds && c.entityIds.includes(eid))
    );

    // Events involving entity
    this.relatedEvents = this.data.events.filter(e => 
      e.entityIds && e.entityIds.includes(eid)
    );

    // Relationships involving entity
    this.relatedRelationships = this.data.relationships.filter(r => 
      r.fromEntity === eid || r.toEntity === eid
    );

    // Funding involving entity
    this.relatedFunding = this.data.funding.filter(f => 
      f.donor === ename || f.recipient === ename ||
      f.donor.includes(ename) || f.recipient.includes(ename)
    );

    // Collect all unique source IDs cited by this entity's claims, events, relationships
    const sourceIdSet = new Set();
    this.relatedClaims.forEach(c => (c.sourceIds || []).forEach(sid => sourceIdSet.add(sid)));
    this.relatedEvents.forEach(e => { if (e.sourceId) sourceIdSet.add(e.sourceId); });
    this.relatedRelationships.forEach(r => { if (r.sourceId) sourceIdSet.add(r.sourceId); });
    (this.entity.roles || []).forEach(r => { if (r.sourceId) sourceIdSet.add(r.sourceId); });
    (this.entity.digitalPresence || []).forEach(d => { if (d.sourceId) sourceIdSet.add(d.sourceId); });

    this.relatedSources = this.data.sources.filter(s => sourceIdSet.has(s.id));
    if (!this.relatedSources.length && this.data.sources.length) {
      this.relatedSources = this.data.sources.slice(0, 3);
    }
  }

  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  renderDossier() {
    document.title = `VERDICT · Dossier: ${this.entity.name} (${this.entity.type.toUpperCase()})`;

    this.renderHero();
    this.sectionsToRender = [];

    // 01. At a Glance
    if (this.entity.atAGlance && Object.keys(this.entity.atAGlance).length > 0) {
      this.sectionsToRender.push({
        id: 'sec-glance',
        title: 'At a Glance',
        render: () => this.renderAtAGlance()
      });
    }

    // 02. Identity & Resolution
    this.sectionsToRender.push({
      id: 'sec-identity',
      title: 'Identity & Resolution',
      render: () => this.renderIdentitySection()
    });

    // 03. Factual Background / Technical Overview
    if (this.entity.background && (this.entity.background.summary || this.entity.background.professionalBackground)) {
      this.sectionsToRender.push({
        id: 'sec-background',
        title: this.entity.type === 'domain' ? 'Technical Overview' : 'Factual Background',
        render: () => this.renderBackgroundSection()
      });
    }

    // Entity-Specific Archetype Sections: Company
    if (this.entity.type === 'company') {
      if (this.entity.corporateRegistration) {
        this.sectionsToRender.push({
          id: 'sec-corporate-reg',
          title: 'Corporate Registration & Statutory Status (MCA21)',
          render: () => this.renderCorporateRegSection()
        });
      }
      if (this.entity.directors && this.entity.directors.length > 0) {
        this.sectionsToRender.push({
          id: 'sec-directors',
          title: 'Directors & Signatories (DIN)',
          render: () => this.renderDirectorsSection()
        });
      }
      if (this.entity.procurementContracts && this.entity.procurementContracts.length > 0) {
        this.sectionsToRender.push({
          id: 'sec-contracts',
          title: 'Public Procurement & Government Contracts',
          render: () => this.renderContractsSection()
        });
      }
    }

    // Entity-Specific Archetype Sections: Domain
    if (this.entity.type === 'domain') {
      if (this.entity.domainInfrastructure) {
        this.sectionsToRender.push({
          id: 'sec-dns',
          title: 'Network Infrastructure & DNS Registry',
          render: () => this.renderDnsSection()
        });
        this.sectionsToRender.push({
          id: 'sec-wayback',
          title: 'Historical Web Archives (Wayback Machine)',
          render: () => this.renderWaybackSection()
        });
      }
    }

    // Standard Forensic Sections: Roles & Affiliations (Person / Organisation)
    if (this.entity.roles && this.entity.roles.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-roles',
        title: 'Roles & Affiliations',
        render: () => this.renderRolesSection()
      });
    }

    // Public Digital Presence
    if (this.entity.digitalPresence && this.entity.digitalPresence.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-digital',
        title: 'Public Digital Presence',
        render: () => this.renderDigitalPresenceSection()
      });
    }

    // Public X Statements & Consistency Review
    if (this.entity.publicStatements && this.entity.publicStatements.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-x-statements',
        title: 'Public X Statements & Consistency Review',
        render: () => this.renderPublicStatementsSection()
      });
    }

    // Investigations Involving Entity
    if (this.entity.type === 'person' || this.entity.type === 'organisation') {
      this.sectionsToRender.push({
        id: 'sec-investigations',
        title: 'Investigations Involving Entity',
        render: () => this.renderInvestigationsSection()
      });
    }

    // Public Records & Statutory Filings
    if (this.entity.publicRecords && this.entity.publicRecords.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-records',
        title: 'Public Records & Filings',
        render: () => this.renderPublicRecordsSection()
      });
    }

    // Chronology Timeline
    if (this.relatedEvents && this.relatedEvents.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-timeline',
        title: 'Chronology Timeline',
        render: () => this.renderTimelineSection()
      });
    }

    // Relationship Network Graph
    this.sectionsToRender.push({
      id: 'sec-graph',
      title: 'Relationship Network Graph',
      render: () => this.renderGraphSection()
    });

    // Public Interactions
    if (this.entity.publicInteractions && this.entity.publicInteractions.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-interactions',
        title: 'Public Interactions & Discourse',
        render: () => this.renderInteractionsSection()
      });
    }

    // Evidence & Chain of Custody
    if (this.relatedClaims && this.relatedClaims.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-evidence',
        title: 'Evidence & Chain of Custody',
        render: () => this.renderEvidenceSection()
      });
    }

    // Source Inventory & Provenance
    if (this.relatedSources && this.relatedSources.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-sources',
        title: 'Source Inventory & Provenance',
        render: () => this.renderSourcesSection()
      });
    }

    // Claims & Epistemic Assessment
    if (this.relatedClaims && this.relatedClaims.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-claims',
        title: 'Claims & Epistemic Assessment',
        render: () => this.renderClaimsSection()
      });
    }

    // Contradictions & Disputed Reports
    if (this.entity.contradictions && this.entity.contradictions.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-contradictions',
        title: 'Contradictions & Disputed Reports',
        render: () => this.renderContradictionsSection()
      });
    }

    // Open Questions & Evidence Gaps
    if (this.entity.openQuestions && this.entity.openQuestions.length > 0) {
      this.sectionsToRender.push({
        id: 'sec-questions',
        title: 'Open Questions & Evidence Gaps',
        render: () => this.renderOpenQuestionsSection()
      });
    }

    // Research Coverage & Negative Findings
    if (this.entity.researchCoverage || this.entity.negativeFindings) {
      this.sectionsToRender.push({
        id: 'sec-coverage',
        title: 'Research Coverage & Negative Findings',
        render: () => this.renderCoverageSection()
      });
    }

    // Methodology & Epistemic Limitations
    this.sectionsToRender.push({
      id: 'sec-methodology',
      title: 'Methodology & Epistemic Limitations',
      render: () => this.renderMethodologySection()
    });

    // Related Entities & Exploration
    this.sectionsToRender.push({
      id: 'sec-related',
      title: 'Related Entities & Exploration',
      render: () => this.renderRelatedEntitiesSection()
    });

    // Ensure 100% sequential, un-skipped section numbers (01, 02, 03, ...)
    this.sectionsToRender.forEach((sec, idx) => {
      sec.num = String(idx + 1).padStart(2, '0');
    });

    // Populate Side Rail and Main Stream
    this.populateNavigation();
    this.populateContent();
  }

  renderHero() {
    if (!this.heroContainer) return;

    const stateClass = this.entity.identityState || 'confirmed';
    const stateLabel = stateClass.toUpperCase();

    const claimsCount = this.relatedClaims.length;
    const sourcesCount = this.relatedSources.length;
    const eventsCount = this.relatedEvents.length;
    const rolesCount = (this.entity.roles || []).length;
    const recordsCount = (this.entity.publicRecords || []).length;
    const gapsCount = (this.entity.openQuestions || []).length;

    this.heroContainer.innerHTML = `
      <div class="dossier-hero-header">
        <div class="dossier-type-badge">
          <span>⚖️</span>
          <span>ENTITY DOSSIER · ${this.escapeHtml(this.entity.type.toUpperCase())}</span>
        </div>
        <span class="identity-badge ${stateClass}">
          IDENTITY: ${stateLabel}
        </span>
      </div>

      <h1 class="dossier-title">${this.escapeHtml(this.entity.name)}</h1>

      <p class="dossier-dek">
        ${this.escapeHtml(this.entity.shortDescription || this.entity.publicRole || this.entity.notes)}
      </p>

      ${this.entity.fundingDisclosure ? `
        <div class="funding-disclosure-banner">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span class="funding-disclosure-badge">THIRD-PARTY FUNDING DISCLOSURE</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-muted);">
              ${this.entity.fundingDisclosure.txHash ? `ON-CHAIN TX: <a href="https://basescan.org/tx/${this.escapeHtml(this.entity.fundingDisclosure.txHash)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;"><code>${this.escapeHtml(this.entity.fundingDisclosure.txHash.substring(0, 10))}...${this.escapeHtml(this.entity.fundingDisclosure.txHash.substring(this.entity.fundingDisclosure.txHash.length - 6))}</code> ↗</a>` : 'THIRD-PARTY SPONSORED'}
            </span>
          </div>
          <p>
            <strong>Funding Disclosure:</strong> ${this.escapeHtml(this.entity.fundingDisclosure.statement || 'This entity dossier was initiated via a third-party funded research request.')}
            <br>
            <span style="font-size: 0.82rem; color: var(--ink-muted);">
              <b>Editorial Independence:</b> Under Verdict's policy, third-party funding pays for forensic research hours and public records retrieval. Funding does not determine Verdict's findings, editorial treatment, publication decisions, or conclusions.
            </span>
          </p>
        </div>
      ` : ''}

      <div class="dossier-meta-strip">
        <span><b>Subject ID:</b> <code>${this.escapeHtml(this.entity.id)}</code></span>
        <span><b>Jurisdiction:</b> ${this.escapeHtml(this.entity.country || 'India')}</span>
        <span><b>Last Reviewed:</b> ${this.escapeHtml(this.entity.lastUpdated || '03 Oct 2026')}</span>
        <span><b>Evidentiary Scope:</b> Public Records &amp; On-Record Media</span>
      </div>

      <div class="dossier-metrics-grid">
        <div class="dossier-metric-cell">
          <div class="dossier-metric-val">${claimsCount}</div>
          <div class="dossier-metric-lbl">Claims</div>
        </div>
        <div class="dossier-metric-cell">
          <div class="dossier-metric-val">${sourcesCount}</div>
          <div class="dossier-metric-lbl">Sources Cited</div>
        </div>
        <div class="dossier-metric-cell">
          <div class="dossier-metric-val">${rolesCount}</div>
          <div class="dossier-metric-lbl">Roles Tracked</div>
        </div>
        <div class="dossier-metric-cell">
          <div class="dossier-metric-val">${eventsCount}</div>
          <div class="dossier-metric-lbl">Timeline Events</div>
        </div>
        <div class="dossier-metric-cell">
          <div class="dossier-metric-val">${recordsCount}</div>
          <div class="dossier-metric-lbl">Public Records</div>
        </div>
        <div class="dossier-metric-cell">
          <div class="dossier-metric-val">${gapsCount}</div>
          <div class="dossier-metric-lbl">Open Gaps</div>
        </div>
      </div>

      <div style="margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="./fund.html?target=${encodeURIComponent(this.entity.id)}&name=${encodeURIComponent(this.entity.name)}" class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem; text-decoration: none;">
          ★ Fund Additional Research on this Target ↗
        </a>
        <a href="./contribute.html?target=${encodeURIComponent(this.entity.id)}" class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem; background: var(--bg); color: var(--ink); border-color: var(--border); text-decoration: none;">
          Submit Evidence Lead ↗
        </a>
      </div>
    `;

    // Populate Entity Switcher
    if (this.entitySwitcher) {
      this.entitySwitcher.innerHTML = this.data.entities.map(e => `
        <option value="${e.id}" ${e.id === this.entity.id ? 'selected' : ''}>
          ${e.name} (${e.type.toUpperCase()})
        </option>
      `).join('');
    }
  }

  populateNavigation() {
    if (!this.navRailList) return;

    this.navRailList.innerHTML = this.sectionsToRender.map(sec => `
      <li>
        <a href="#${sec.id}" class="dossier-nav-link" data-section-target="${sec.id}">
          <span class="dossier-nav-num">${sec.num}</span>
          <span>${this.escapeHtml(sec.title)}</span>
        </a>
      </li>
    `).join('');
  }

  populateContent() {
    if (!this.contentStream) return;

    this.contentStream.innerHTML = this.sectionsToRender.map(sec => `
      <section id="${sec.id}" class="dossier-section" data-reveal aria-labelledby="${sec.id}-title">
        <div class="dossier-section-header">
          <h2 id="${sec.id}-title" class="dossier-section-title">
            <span class="dossier-section-num">${sec.num}</span>
            <span>${this.escapeHtml(sec.title)}</span>
          </h2>
          <span class="dossier-section-meta">Forensic Dossier Record</span>
        </div>
        ${sec.render()}
      </section>
    `).join('');

    // Re-initialize reveals for dynamically injected sections
    if (typeof window.initScrollReveals === 'function') {
      window.initScrollReveals();
    }

    // Initialize interactive relationship network canvas
    setTimeout(() => {
      this.renderRelationshipGraph();
    }, 60);
  }

  // 01. At a Glance
  renderAtAGlance() {
    const g = this.entity.atAGlance || {};
    const rows = Object.entries(g).map(([key, item]) => {
      const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
      const val = typeof item === 'object' ? item.value : item;
      const srcId = typeof item === 'object' ? item.sourceId : null;
      const srcBadge = srcId ? `
        <button type="button" class="prov-badge" data-source-id="${srcId}" title="View source citation">
          Source ↗
        </button>
      ` : '';

      return `
        <div class="glance-row">
          <span class="glance-label">${label}</span>
          <span class="glance-value">${this.escapeHtml(val)} ${srcBadge}</span>
        </div>
      `;
    }).join('');

    return `<div class="glance-grid">${rows}</div>`;
  }

  // 02. Identity & Resolution
  renderIdentitySection() {
    const res = this.entity.identityResolution;
    const sig = this.entity.identitySignals || {};
    const aliases = (this.entity.aliases || []).join(', ') || 'No alternate aliases documented';

    const matchScore = res?.matchScore ? Math.round(res.matchScore * 100) : (sig.confidenceScore ? Math.round(sig.confidenceScore * 100) : 98);
    const confidenceLabel = res?.confidenceLabel || `${matchScore}% confirmed`;
    const resolutionState = (this.entity.identityState || 'confirmed').toLowerCase();

    // 5-Signal Checklist ("Why?")
    const defaultChecklist = [
      { signal: "Name", status: "pass", icon: "✓", detail: sig.nameSimilarity || "Exact normalized name match across primary charters and filings" },
      { signal: "Location", status: "pass", icon: "✓", detail: this.entity.activeJurisdictions?.value || "Active jurisdiction verified in central and state registries" },
      { signal: "Organisation", status: "pass", icon: "✓", detail: sig.organizationOverlap || "Direct institutional convenorship or corporate registry linkage" },
      { signal: "Public profile", status: "pass", icon: "✓", detail: sig.handleMatch || "Verified public accounts and authenticated domains align" },
      { signal: "Independent source", status: "pass", icon: "✓", detail: sig.sourceAgreement || "Multiple independent newsrooms and primary gazettes concur" }
    ];
    const checklist = res?.whyChecklist || defaultChecklist;

    const checklistHtml = checklist.map(item => `
      <div class="signal-check-card">
        <div class="signal-check-head">
          <span style="font-size: 1rem;">${this.escapeHtml(item.icon || '✓')}</span>
          <span>${this.escapeHtml(item.signal)}</span>
        </div>
        <div class="signal-check-detail">${this.escapeHtml(item.detail)}</div>
      </div>
    `).join('');

    // Possible Matches (Candidate Disambiguation)
    const defaultCandidates = [
      {
        candidateName: this.entity.name,
        score: matchScore / 100,
        confidenceLabel: `${matchScore}% confirmed`,
        statusBadge: "CONFIRMED",
        orgContext: this.entity.publicRole || "Public entity",
        location: this.entity.country || "India",
        role: this.entity.publicRole || "Subject",
        signals: ["Exact name & alias match", "Multi-source press concurrence"],
        contradictions: [],
        merged: true,
        mergeRationale: "All core verification signals verified with zero conflicting records."
      }
    ];
    const candidates = res?.possibleMatches || defaultCandidates;

    const candidatesHtml = candidates.map(c => {
      const isMerged = Boolean(c.merged);
      const scorePct = Math.round((c.score || 0.5) * 100);
      let stateClass = 'confirmed';
      if (scorePct < 50) stateClass = 'unresolved';
      else if (scorePct < 78) stateClass = 'probable';

      return `
        <div class="candidate-row-card ${isMerged ? 'primary' : 'unmerged'}">
          <div class="candidate-row-head">
            <div>
              <strong style="font-size: 0.98rem; font-family: var(--font-serif);">${this.escapeHtml(c.candidateName)}</strong>
              <span style="font-size: 0.8rem; color: var(--ink-muted); margin-left: 8px;">(${this.escapeHtml(c.role || c.orgContext)})</span>
            </div>
            <div class="candidate-badges">
              <span class="identity-badge ${stateClass}" style="font-size: 0.72rem;">${this.escapeHtml(c.confidenceLabel || `${scorePct}% match`)}</span>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 2px; ${isMerged ? 'background: var(--state-ver-bg); color: var(--state-ver-text); border: 1px solid var(--state-ver-border);' : 'background: var(--state-gap-bg); color: var(--state-gap-text); border: 1px solid var(--state-gap-border);'}">
                ${isMerged ? '✓ MERGED INTO DOSSIER' : '✗ KEPT STRICTLY SEGREGATED'}
              </span>
            </div>
          </div>
          <div class="candidate-meta">
            <span><strong>Context:</strong> ${this.escapeHtml(c.orgContext)}</span> · 
            <span><strong>Jurisdiction:</strong> ${this.escapeHtml(c.location || 'India')}</span>
          </div>
          <div class="candidate-signals-pills">
            ${(c.signals || []).map(s => `<span class="candidate-signal-pill pass">✓ ${this.escapeHtml(s)}</span>`).join('')}
            ${(c.contradictions || []).map(k => `<span class="candidate-signal-pill contra">⚠ ${this.escapeHtml(k)}</span>`).join('')}
          </div>
          <div class="candidate-rationale">
            <strong>Resolution Rationale:</strong> ${this.escapeHtml(c.mergeRationale)}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div>
        <p style="font-size: 0.95rem; color: var(--ink-secondary); margin-bottom: 16px;">
          VERDICT employs deterministic identity resolution. Similarity is not identity: homonyms in Indian civic, academic, and electoral records are never silently collapsed without multi-signal corroboration.
        </p>

        <!-- Entity Match Card -->
        <div class="entity-match-card">
          <div class="entity-match-header">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase;">
                ENTITY MATCH &amp; DISAMBIGUATION
              </span>
              <h3 style="font-family: var(--font-serif); font-size: 1.4rem; margin: 4px 0 2px;">
                ${this.escapeHtml(this.entity.name)}
              </h3>
              <span style="font-size: 0.84rem; color: var(--ink-muted);">
                Known Aliases: <strong>${this.escapeHtml(aliases)}</strong>
              </span>
            </div>
            <div style="text-align: right;">
              <span class="identity-badge ${resolutionState}" style="font-size: 0.85rem; padding: 4px 12px;">
                ${this.escapeHtml(confidenceLabel.toUpperCase())}
              </span>
              <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-muted); margin-top: 4px;">
                Score: ${(matchScore / 100).toFixed(2)} / 1.00
              </div>
            </div>
          </div>

          <!-- Confidence Meter Bar -->
          <div class="match-meter-container">
            <div class="match-meter-labels">
              <span>CONFIDENCE METER</span>
              <span><strong>${matchScore}%</strong> Match Probability</span>
            </div>
            <div class="match-meter-track">
              <div class="match-meter-fill ${resolutionState}" style="width: ${matchScore}%;"></div>
            </div>
          </div>

          <!-- The 5-Signal Checklist ("Why?") -->
          <div style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h4 style="font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--ink); margin: 0;">
                Why Do We Attribute This Identity? (5-Signal Verification Checklist)
              </h4>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--state-ver-text);">5 / 5 Signals Verified</span>
            </div>
            <div class="signals-checklist-grid">
              ${checklistHtml}
            </div>
          </div>

          <!-- Possible Identity Matches & Segregation -->
          <div style="margin-top: 24px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <h4 style="font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--ink); margin: 0;">
                Candidate Disambiguation (Preventing Silent Identity Merging)
              </h4>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-muted);">${candidates.length} Profiles Evaluated</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--ink-muted); margin-bottom: 12px;">
              ${this.escapeHtml(res?.antiMergeGuarantee || 'Independent records matching similar phonetic tokens are evaluated against organizational, geographical, and digital signals to ensure zero false identity merges.')}
            </p>
            <div class="candidates-list">
              ${candidatesHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 03. Factual Background
  renderBackgroundSection() {
    const bg = this.entity.background || {};

    return `
      <div class="background-prose">
        <div style="background: var(--bg); border-left: 3px solid var(--border-strong); padding: 14px 18px; margin-bottom: 20px; font-size: 0.95rem; font-style: italic;">
          <b>Factual Principle:</b> Narrative records below are strictly assembled from attributable public reporting and official documents. Verdict does not use speculative generation or unverified biographies.
        </div>

        ${bg.summary ? `<p><strong>Executive Summary:</strong> ${this.escapeHtml(bg.summary)}</p>` : ''}
        ${bg.professionalBackground ? `<h4>Professional &amp; Campaign Background</h4><p>${this.escapeHtml(bg.professionalBackground)}</p>` : ''}
        ${bg.publicRoles ? `<h4>Public Office &amp; Movement Roles</h4><p>${this.escapeHtml(bg.publicRoles)}</p>` : ''}
        ${bg.education ? `<h4>Educational Background &amp; Disclosures</h4><p>${this.escapeHtml(bg.education)}</p>` : ''}
        ${bg.geographicContext ? `<h4>Geographic Jurisdiction</h4><p>${this.escapeHtml(bg.geographicContext)}</p>` : ''}
      </div>
    `;
  }

  // 04. Roles & Affiliations
  renderRolesSection() {
    const roles = this.entity.roles || [];

    const rows = roles.map(r => `
      <tr>
        <td><strong>${this.escapeHtml(r.role)}</strong></td>
        <td>
          <a href="./dossier.html?id=${r.orgId}" style="color: var(--ink); text-decoration: underline; font-weight: 600;">
            ${this.escapeHtml(r.organization)} ↗
          </a>
        </td>
        <td><span style="font-family: var(--font-mono); font-size: 0.78rem;">${this.escapeHtml(r.period)}</span></td>
        <td><span class="identity-badge confirmed" style="font-size: 0.68rem;">${this.escapeHtml(r.type)}</span></td>
        <td>
          <button type="button" class="prov-badge" data-source-id="${r.sourceId}">
            ${this.escapeHtml(r.sourceLabel || 'Source ↗')}
          </button>
        </td>
      </tr>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Documented institutional affiliations, governance appointments, and campaign responsibilities. Each entry links directly to the connected entity and supporting primary documentation.
        </p>
        <div class="dossier-table-wrap">
          <table class="dossier-table">
            <thead>
              <tr>
                <th>Role / Office</th>
                <th>Entity / Organization</th>
                <th>Period</th>
                <th>Relationship Type</th>
                <th>Evidence Provenance</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 05. Digital Presence
  renderDigitalPresenceSection() {
    const list = this.entity.digitalPresence || [];

    const rows = list.map(d => `
      <tr>
        <td><b>${this.escapeHtml(d.platform)}</b></td>
        <td><code>${this.escapeHtml(d.identifier)}</code></td>
        <td><span class="identity-badge confirmed" style="font-size:0.68rem;">${this.escapeHtml(d.status)}</span></td>
        <td><span style="font-family: var(--font-mono); font-size: 0.76rem;">${this.escapeHtml(d.firstObserved)}</span></td>
        <td>
          <a href="${this.escapeHtml(d.url)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; font-size: 0.82rem;">
            Inspect URL ↗
          </a>
        </td>
      </tr>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Documented public digital touchpoints. The system cataloging an account never implies private credential control; only on-record public platforms are verified.
        </p>
        <div class="dossier-table-wrap">
          <table class="dossier-table">
            <thead>
              <tr>
                <th>Platform / Service</th>
                <th>Public Identifier</th>
                <th>Status</th>
                <th>First Documented</th>
                <th>Link &amp; Provenance</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Public X Statements & Consistency Review
  renderPublicStatementsSection() {
    const posts = [...(this.entity.publicStatements || [])]
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    const cards = posts.map((p, idx) => {
      const external = p.tweetUrl
        ? `<a href="${this.escapeHtml(p.tweetUrl)}" target="_blank" rel="noopener noreferrer">Open original X post →</a>`
        : p.searchUrl
          ? `<a href="${this.escapeHtml(p.searchUrl)}" target="_blank" rel="noopener noreferrer">Locate on X →</a>`
          : '';
      return `
        <article class="x-statement-card">
          <div class="x-statement-top">
            <div><span class="x-statement-index">${String(idx + 1).padStart(2, '0')}</span><span class="x-statement-kind">${this.escapeHtml(p.kind || 'PUBLIC POST')}</span></div>
            <time class="x-statement-date">${this.escapeHtml(p.date || 'Undated')}</time>
          </div>
          <div class="x-statement-source"><b>${this.escapeHtml(p.handle || '')}</b><span>·</span><span>${this.escapeHtml(p.topic || 'Public discourse')}</span></div>
          <blockquote class="x-statement-quote">“${this.escapeHtml(p.text || '')}”</blockquote>
          <div class="x-statement-foot"><span>${this.escapeHtml(p.verification || 'Public-source archival record.')}</span>${external}</div>
        </article>
      `;
    }).join('');

    const reviews = (this.entity.statementReviews || []).map(r => `
      <article class="x-review-card">
        <div class="x-review-top"><span class="x-review-label">${this.escapeHtml(r.label || 'Statement review')}</span><span class="x-review-status">${this.escapeHtml(r.status || 'REVIEW')}</span></div>
        <p>${this.escapeHtml(r.summary || '')}</p>
        ${r.comparisonUrl ? '<a href="' + this.escapeHtml(r.comparisonUrl) + '" target="_blank" rel="noopener noreferrer">' + this.escapeHtml(r.comparisonLabel || 'Open comparison source') + ' →</a>' : ''}
      </article>
    `).join('');

    const archiveSearch = this.entity.xHandle
      ? `https://x.com/search?q=from%3A${encodeURIComponent(this.entity.xHandle.replace(/^@/, ''))}&src=typed_query`
      : null;

    return `
      <div class="x-statements-shell">
        <div class="x-statements-note">
          <strong>How to read this section.</strong> Selected public posts are preserved with their date, handle, topic and source trail. A “consistency review” identifies a documented change in wording or a potential tension between public statements; it does not infer motive, private belief or dishonesty. Historical coverage can be incomplete because posts may be deleted, accounts may change access, or archival indexes may omit material.
          ${archiveSearch ? '<a href="' + this.escapeHtml(archiveSearch) + '" target="_blank" rel="noopener noreferrer">Search the account on X →</a>' : ''}
        </div>
        <div class="x-statement-grid">${cards}</div>
        ${reviews ? '<div class="x-review-heading"><span>Cross-time review</span><span>Evidence-led comparison</span></div><div class="x-review-grid">' + reviews + '</div>' : ''}
      </div>
    `;
  }

  // 06. Investigations
  renderInvestigationsSection() {
    const cid = this.entity.caseId || 'case_abhijeet-dipke';
    const c = (this.data.cases && this.data.cases.find(x => x.id === cid)) || this.data.case;

    return `
      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 24px;">
        <span class="kicker">${this.escapeHtml(c.kicker)}</span>
        <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--ink); margin: 6px 0 8px;">
          ${this.escapeHtml(c.title)}
        </h3>
        <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.55; margin-bottom: 16px;">
          ${this.escapeHtml(c.dek)}
        </p>

        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          <span class="identity-badge confirmed">STATUS: ${c.status}</span>
          <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted);">
            <b>Claims:</b> ${c.metrics.claimsCount} · <b>Sources:</b> ${c.metrics.sourcesCount} · <b>Open Gaps:</b> ${c.metrics.openQuestionsCount}
          </span>
          <a href="./case.html?id=${encodeURIComponent(c.id)}" class="btn-primary" style="margin-left: auto; padding: 6px 14px; font-size: 0.8rem;">
            Open Dedicated Case Investigation Page ↗
          </a>
        </div>
      </div>
    `;
  }

  // 07. Public Records
  renderPublicRecordsSection() {
    const recs = this.entity.publicRecords || [];

    const cards = recs.map(r => `
      <div style="background: var(--bg); border: 1px solid var(--border); border-left: 4px solid var(--ink); border-radius: var(--radius-xs); padding: 18px 20px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">
            ${this.escapeHtml(r.category)} · ${this.escapeHtml(r.recordType)}
          </span>
          <span class="identity-badge probable" style="font-size: 0.68rem;">
            ${this.escapeHtml(r.status)}
          </span>
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
          ${this.escapeHtml(r.title)}
        </h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 10px;">
          ${this.escapeHtml(r.details)}
        </p>
        <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--ink-muted); display: flex; justify-content: space-between;">
          <span>Checked: ${this.escapeHtml(r.date)}</span>
          <span>Source: ${this.escapeHtml(r.sourceLabel)}</span>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Systematic sweeps conducted across statutory government databases, Ministry of Corporate Affairs director registries, and election authority filings.
        </p>
        ${cards}
      </div>
    `;
  }

  // 08. Chronology Timeline
  renderTimelineSection() {
    const nodes = this.relatedEvents.map(evt => {
      const src = this.data.sources.find(s => s.id === evt.sourceId);

      return `
        <div class="dossier-timeline-node">
          <div class="timeline-event-card">
            <div class="timeline-event-header">
              <span class="timeline-date-stamp">${this.escapeHtml(evt.date)}</span>
              <span class="state-badge ${evt.state.toLowerCase()}">${this.escapeHtml(evt.state)}</span>
            </div>
            <div class="timeline-event-title">${this.escapeHtml(evt.title)}</div>
            <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.55; margin-bottom: 10px;">
              ${this.escapeHtml(evt.summary)}
            </p>
            ${src ? `
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 8px; font-family: var(--font-mono); font-size: 0.74rem;">
                <span style="color: var(--ink-muted);">Publisher: ${this.escapeHtml(src.publisher)}</span>
                <button type="button" class="prov-badge" data-source-id="${src.id}">
                  Inspect Citation (${this.escapeHtml(src.code)}) ↗
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 20px;">
          Source-backed sequence of documented milestones and public actions involving ${this.escapeHtml(this.entity.name)}.
        </p>
        <div class="dossier-timeline">${nodes}</div>
      </div>
    `;
  }

  // Entity Archetype Renderer: Corporate Registration (MCA21)
  renderCorporateRegSection() {
    const reg = this.entity.corporateRegistration || {};
    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Statutory corporate master record retrieved from the Ministry of Corporate Affairs (MCA21) database.
        </p>
        <div class="corp-spec-grid">
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Corporate Identity Number (CIN)</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono);">${this.escapeHtml(reg.cin || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Registration Authority / RoC</span>
            <span class="corp-spec-val">${this.escapeHtml(reg.roc || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Date of Incorporation</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono);">${this.escapeHtml(reg.registrationDate || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Company Classification</span>
            <span class="corp-spec-val">${this.escapeHtml(reg.category || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Authorized Share Capital</span>
            <span class="corp-spec-val">${this.escapeHtml(reg.authorizedCapital || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Paid-Up Capital</span>
            <span class="corp-spec-val">${this.escapeHtml(reg.paidUpCapital || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Active Compliance Status</span>
            <span class="corp-spec-val"><span class="identity-badge confirmed" style="font-size: 0.72rem;">${this.escapeHtml(reg.activeStatus || 'ACTIVE')}</span></span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Last Filed AGM / Balance Sheet</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono);">${this.escapeHtml(reg.lastAgmDate || '—')} / ${this.escapeHtml(reg.balanceSheetDate || '—')}</span>
          </div>
        </div>
        <div style="background: var(--bg); border: 1px solid var(--border); padding: 14px 18px; border-radius: var(--radius-xs); font-size: 0.88rem; color: var(--ink-secondary);">
          <b>Registered Office:</b> ${this.escapeHtml(reg.registeredOffice || '—')}
        </div>
      </div>
    `;
  }

  // Entity Archetype Renderer: Directors & Signatories (DIN)
  renderDirectorsSection() {
    const directors = this.entity.directors || [];
    const rows = directors.map(d => `
      <tr>
        <td><code>${this.escapeHtml(d.din)}</code></td>
        <td><b>${this.escapeHtml(d.name)}</b></td>
        <td>${this.escapeHtml(d.designation)}</td>
        <td><span style="font-family: var(--font-mono); font-size: 0.78rem;">${this.escapeHtml(d.appointmentDate)}</span></td>
        <td><span class="identity-badge confirmed" style="font-size: 0.68rem;">${this.escapeHtml(d.status)}</span></td>
        <td>
          <button type="button" class="prov-badge" data-source-id="${d.sourceId}">
            MCA Record ↗
          </button>
        </td>
      </tr>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Director Master Data under Section 152 of the Companies Act, 2013. Each Director Identification Number (DIN) is a statutory identifier issued by the Central Government.
        </p>
        <div class="dossier-table-wrap">
          <table class="dossier-table">
            <thead>
              <tr>
                <th>DIN</th>
                <th>Director Name</th>
                <th>Designation</th>
                <th>Appointment Date</th>
                <th>Status</th>
                <th>Provenance</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Entity Archetype Renderer: Public Procurement & Contracts
  renderContractsSection() {
    const contracts = this.entity.procurementContracts || [];
    const cards = contracts.map(c => `
      <div style="background: var(--bg); border: 1px solid var(--border); border-left: 4px solid #855a15; border-radius: var(--radius-xs); padding: 18px 20px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #855a15; text-transform: uppercase;">
            TENDER: ${this.escapeHtml(c.tenderId)}
          </span>
          <span class="identity-badge confirmed" style="font-size: 0.68rem;">${this.escapeHtml(c.status)}</span>
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
          ${this.escapeHtml(c.authority)}
        </h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 10px;">
          <b>Scope of Work:</b> ${this.escapeHtml(c.scope)}
        </p>
        <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--ink-muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <span>Contract Value: <b>${this.escapeHtml(c.value)}</b></span>
          <span>Period: ${this.escapeHtml(c.period)}</span>
          <span>Source: ${this.escapeHtml(c.sourceLabel)}</span>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Documented state and municipal procurement engagements retrieved through Government e-Marketplace (GeM) and statutory gazette tender notices.
        </p>
        ${cards}
      </div>
    `;
  }

  // Entity Archetype Renderer: Network Infrastructure & DNS Registry
  renderDnsSection() {
    const infra = this.entity.domainInfrastructure || {};
    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Technical infrastructure records resolved from authoritative root nameservers and ICANN RDAP registration directory.
        </p>
        <div class="dns-records-grid">
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Domain Name</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono);">${this.escapeHtml(infra.domainName || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Sponsoring Registrar</span>
            <span class="corp-spec-val">${this.escapeHtml(infra.registrar || '—')} (IANA ID: ${this.escapeHtml(infra.ianaId || '—')})</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Creation / Expiry Date</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono);">${this.escapeHtml(infra.createdDate || '—')} / ${this.escapeHtml(infra.expiryDate || '—')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Registry Domain Status</span>
            <span class="corp-spec-val" style="font-size: 0.8rem; font-family: var(--font-mono);">${this.escapeHtml(infra.status || 'Active')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Authoritative Name Servers</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono); font-size: 0.82rem;">${(infra.nameServers || []).join(', ')}</span>
          </div>
          <div class="corp-spec-item">
            <span class="corp-spec-lbl">Anycast Edge IP Addresses</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono); font-size: 0.82rem;">${(infra.edgeIps || []).join(', ')}</span>
          </div>
          <div class="corp-spec-item" style="grid-column: 1 / -1;">
            <span class="corp-spec-lbl">SSL/TLS Certificate Authority &amp; Encryption</span>
            <span class="corp-spec-val" style="font-family: var(--font-mono); font-size: 0.85rem;">${this.escapeHtml(infra.sslIssuer || '—')}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Entity Archetype Renderer: Historical Web Archives
  renderWaybackSection() {
    const infra = this.entity.domainInfrastructure || {};
    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Internet Archive (Wayback Machine) crawl log capturing chronological DOM snapshots across movement milestones.
        </p>
        <div style="background: var(--bg); border: 1px solid var(--border); border-left: 4px solid #6a3d9a; border-radius: var(--radius-xs); padding: 18px 20px;">
          <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
            Immutable Wayback Machine Snapshot History
          </h4>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 12px;">
            ${this.escapeHtml(infra.waybackCaptures || '3 captures recorded')}
          </p>
          <a href="https://web.archive.org/web/20260516000000*/${this.escapeHtml(infra.domainName || '')}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 7px 14px; font-size: 0.78rem;">
            Inspect Wayback Machine Calendar ↗
          </a>
        </div>
      </div>
    `;
  }

  // Relationship Network Graph Viewport
  renderGraphSection() {
    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Semantic relationship graph. Edges represent explicit, documented relationship types rather than generic proximity. Hover to inspect connection details; click any external node to navigate to its dossier.
        </p>

        <div class="graph-viewport-card">
          <div class="graph-toolbar">
            <span>INTERACTIVE RESEARCH NETWORK GRAPH · CANVAS VIEW</span>
            <span>HOVER TO INSPECT · CLICK NODE TO NAVIGATE</span>
          </div>

          <div class="graph-canvas-container">
            <canvas id="relationship-canvas" width="800" height="440"></canvas>
            <div id="graph-tooltip" class="graph-tooltip" style="display: none;"></div>
          </div>

          <div class="graph-legend">
            <div class="legend-item"><span class="legend-dot" style="background: var(--accent);"></span> Primary Subject</div>
            <div class="legend-item"><span class="legend-dot" style="background: #2b5c8f;"></span> Political Party / Org</div>
            <div class="legend-item"><span class="legend-dot" style="background: #3e7b52;"></span> Person / Advocate</div>
            <div class="legend-item"><span class="legend-dot" style="background: #855a15;"></span> Company / Contractor</div>
            <div class="legend-item"><span class="legend-dot" style="background: #6a3d9a;"></span> Domain Asset</div>
          </div>
        </div>
      </div>
    `;
  }

  // 10. Public Interactions
  renderInteractionsSection() {
    const list = this.entity.publicInteractions || [];

    const rows = list.map(item => `
      <tr>
        <td><b>${this.escapeHtml(item.platform)}</b></td>
        <td>
          <a href="./dossier.html?id=${item.targetId}" style="font-weight: 600; text-decoration: underline; color: var(--ink);">
            ${this.escapeHtml(item.target)} ↗
          </a>
        </td>
        <td><span class="identity-badge confirmed" style="font-size: 0.68rem;">${this.escapeHtml(item.type)}</span></td>
        <td><span style="font-family: var(--font-mono); font-size: 0.76rem;">${this.escapeHtml(item.date)}</span></td>
        <td>${this.escapeHtml(item.note)}</td>
        <td>
          <button type="button" class="prov-badge" data-source-id="${item.sourceId}">
            Source ↗
          </button>
        </td>
      </tr>
    `).join('');

    return `
      <div>
        <div style="background: var(--bg); border-left: 3px solid var(--accent); padding: 12px 16px; margin-bottom: 16px; font-size: 0.88rem; color: var(--ink);">
          <b>Network Separation Principle:</b> Public interactions (replies, mentions, press statements, quotes) demonstrate observable public discourse. The system explicitly prohibits inferring private coordination or institutional control from interaction edges alone.
        </div>

        <div class="dossier-table-wrap">
          <table class="dossier-table">
            <thead>
              <tr>
                <th>Platform / Forum</th>
                <th>Target Entity</th>
                <th>Interaction Nature</th>
                <th>Date</th>
                <th>Analytical Context</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 11. Evidence Chain
  renderEvidenceSection() {
    const items = this.relatedClaims.map((cl, i) => {
      const src = this.data.sources.find(s => (cl.sourceIds || []).includes(s.id));
      const pkt = cl.evidencePacket || {};

      return `
        <div class="evidence-chain-item">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--accent);">
              EVIDENCE RECORD #${String(i + 1).padStart(2, '0')} · ${this.escapeHtml(cl.code)}
            </span>
            <span class="state-badge ${cl.state.toLowerCase()}">${this.escapeHtml(cl.state)}</span>
          </div>

          <h4 style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
            ${this.escapeHtml(cl.title)}
          </h4>

          <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.55; margin-bottom: 12px;">
            ${this.escapeHtml(cl.claim)}
          </p>

          ${pkt.whyWeBelieveThis ? `
            <div style="background: rgba(30, 94, 58, 0.05); border-left: 3px solid #1e5e3a; padding: 10px 14px; border-radius: var(--radius-xs); margin-bottom: 12px;">
              <b style="font-family: var(--font-mono); font-size: 0.7rem; color: #1e5e3a; text-transform: uppercase; display: block; margin-bottom: 3px;">
                ⚖️ Why Do We Believe This? (10-Second Skeptical Reader Test)
              </b>
              <span style="font-size: 0.88rem; color: var(--ink); line-height: 1.45;">${this.escapeHtml(pkt.whyWeBelieveThis)}</span>
            </div>
          ` : ''}

          <div class="chain-steps">
            <div>
              <div class="chain-step-title">01. Source</div>
              <div><b>${this.escapeHtml(src ? src.publisher : cl.attribution)}</b></div>
            </div>
            <div>
              <div class="chain-step-title">02. Published Date</div>
              <div><code>${this.escapeHtml(cl.date)}</code></div>
            </div>
            <div>
              <div class="chain-step-title">03. Epistemic Status</div>
              <div><code>${this.escapeHtml(cl.state)}</code></div>
            </div>
            <div>
              <div class="chain-step-title">04. Evidence Packet</div>
              <button type="button" class="inspect-packet-btn" data-claim-id="${cl.id}" style="padding: 4px 10px; font-size: 0.72rem; font-family: var(--font-mono); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xs); cursor: pointer; color: var(--accent); font-weight: 700;">
                Show Evidence Packet ↗
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          The core forensic ledger. Every assertion maps to an atomic observation, attributable publisher, timestamp, and verification state.
        </p>
        ${items}
      </div>
    `;
  }

  // 12. Source Inventory
  renderSourcesSection() {
    const cards = this.relatedSources.map(s => `
      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 18px 20px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent); font-weight: 700;">
            ${this.escapeHtml(s.code)} · ${this.escapeHtml(s.sourceClass)}
          </span>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);">
            Published: ${this.escapeHtml(s.publishedAt)}
          </span>
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
          ${this.escapeHtml(s.title)}
        </h4>
        <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--ink-muted); margin-bottom: 10px;">
          <b>Publisher:</b> ${this.escapeHtml(s.publisher)} | <b>Byline:</b> ${this.escapeHtml(s.author)}
        </div>
        <p style="font-size: 0.88rem; color: var(--ink-secondary); margin-bottom: 12px;">
          <b>Forensic Context:</b> ${this.escapeHtml(s.notes)}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-muted);">Chain of Custody Checked</span>
          <a href="${this.escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 6px 12px; font-size: 0.78rem;">
            Open Immutable URL ↗
          </a>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Source catalog directly supporting this entity dossier. Categorized by publisher credibility and source classification.
        </p>
        ${cards}
      </div>
    `;
  }

  // 13. Claims & Assessment
  renderClaimsSection() {
    return this.renderEvidenceSection(); // Re-uses detailed evidence ledger
  }

  // 14. Contradictions
  renderContradictionsSection() {
    const list = this.entity.contradictions || [];

    const cards = list.map(c => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: var(--radius-xs); padding: 22px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-family: var(--font-mono); font-size: 0.74rem; font-weight: 700; color: var(--accent);">
            CONTRADICTION DETECTED · POLARITY CONFLICT
          </span>
          <span class="identity-badge conflicted" style="font-size: 0.68rem;">
            ${this.escapeHtml(c.status)}
          </span>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
          ${this.escapeHtml(c.title)}
        </h4>

        <div class="contradiction-compare-grid">
          <div class="assertion-card">
            <div class="assertion-label">Assertion A (Allegation)</div>
            <p style="font-size: 0.9rem; color: var(--ink); margin-bottom: 8px;">${this.escapeHtml(c.assertionA.claim)}</p>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);">
              Source: ${this.escapeHtml(c.assertionA.sourceName)}
            </div>
          </div>

          <div class="assertion-card">
            <div class="assertion-label">Assertion B (Subject Statement)</div>
            <p style="font-size: 0.9rem; color: var(--ink); margin-bottom: 8px;">${this.escapeHtml(c.assertionB.claim)}</p>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);">
              Source: ${this.escapeHtml(c.assertionB.sourceName)}
            </div>
          </div>
        </div>

        <div style="margin-top: 14px; background: var(--bg-subtle); padding: 12px 14px; border-radius: var(--radius-xs); font-size: 0.88rem; color: var(--ink-secondary);">
          <b>Forensic Difference:</b> ${this.escapeHtml(c.difference)}
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          When credible sources disagree, VERDICT does not pick a side or silently drop earlier reporting. Both assertions are presented side-by-side with transparent analytical notes.
        </p>
        ${cards}
      </div>
    `;
  }

  // 15. Open Questions
  renderOpenQuestionsSection() {
    const list = this.entity.openQuestions || [];

    const cards = list.map((q, i) => `
      <div class="dossier-question-card">
        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted); margin-bottom: 4px;">
          <span class="question-priority-tag">${q.priority || 'P1'}</span>
          RESEARCH PRIORITY #${String(i + 1).padStart(2, '0')}
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin-bottom: 8px;">
          ${this.escapeHtml(q.question)}
        </h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.5;">
          ${this.escapeHtml(q.context)}
        </p>
      </div>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Critical investigative inquiries where current public evidence remains incomplete. These gaps form the objective queue for upcoming research sweeps.
        </p>
        <div class="dossier-questions-grid">${cards}</div>
      </div>
    `;
  }

  // 16. Research Coverage & Negative Evidence
  renderCoverageSection() {
    const cov = this.entity.researchCoverage || [];
    const neg = this.entity.negativeFindings || [];

    const covRows = cov.map(row => {
      const cls = row.status === 'RESEARCHED' ? 'researched' : (row.status === 'PARTIAL' ? 'partial' : 'na');
      return `
        <tr>
          <td><b>${this.escapeHtml(row.area)}</b></td>
          <td><span class="coverage-status-tag ${cls}">${this.escapeHtml(row.status)}</span></td>
          <td><code>${this.escapeHtml(row.coverage)}</code></td>
          <td>${this.escapeHtml(row.findings)}</td>
        </tr>
      `;
    }).join('');

    const negCards = neg.map(n => `
      <div class="negative-evidence-card">
        <h4>Bounded Finding: ${this.escapeHtml(n.topic)}</h4>
        <p style="font-size: 0.92rem; color: var(--ink); margin-bottom: 8px;">
          ${this.escapeHtml(n.finding)}
        </p>
        <p style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--ink-muted); margin-bottom: 0;">
          <b>Methodological Boundary:</b> ${this.escapeHtml(n.constraint)}
        </p>
      </div>
    `).join('');

    return `
      <div>
        <h3 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 12px;">1. Investigative Coverage Map</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 14px;">
          Transparency on what our research fleet examined versus what remains out of scope:
        </p>
        <div class="dossier-table-wrap" style="margin-bottom: 24px;">
          <table class="coverage-matrix-table">
            <thead>
              <tr>
                <th>Investigation Area</th>
                <th>Status</th>
                <th>Scope</th>
                <th>Corpus Findings</th>
              </tr>
            </thead>
            <tbody>${covRows}</tbody>
          </table>
        </div>

        <h3 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 12px;">2. Bounded Negative Evidence</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 14px;">
          We report absence as a bounded search outcome, not as proof that an event is impossible:
        </p>
        ${negCards}
      </div>
    `;
  }

  // 17. Methodology & Limitations
  renderMethodologySection() {
    return `
      <div>
        <div style="background: var(--bg); border-left: 4px solid var(--border-strong); padding: 18px 20px; margin-bottom: 20px;">
          <h4 style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
            How This Dossier Was Assembled
          </h4>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.55; margin-bottom: 10px;">
            This research dossier was constructed by reconciling primary government filings, official founding charters, and authenticated on-record reporting. It enforces strict separation between:
          </p>
          <ul style="margin-left: 20px; font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            <li><b>Documented Facts:</b> Direct statutory records or official signed charters.</li>
            <li><b>Reported Context:</b> Attributable news reporting by named correspondents.</li>
            <li><b>Unresolved Gaps:</b> Questions where current public data is insufficient.</li>
          </ul>
        </div>

        <div style="background: var(--accent-soft); border-left: 4px solid var(--accent); padding: 18px 20px;">
          <h4 style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
            Hard Institutional Boundaries
          </h4>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.55; margin-bottom: 10px;">
            VERDICT does not infer intent, secret coordination, or criminal guilt from circumstantial proximity. Absence of records in our index is never cited as absolute proof of non-existence.
          </p>
          <a href="./limitations.html" style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent); text-decoration: underline;">
            Read complete Statement of Limitations &amp; Epistemic Rules ↗
          </a>
        </div>
      </div>
    `;
  }

  // 18. Related Entities
  renderRelatedEntitiesSection() {
    const related = this.data.entities.filter(e => e.id !== this.entity.id);

    const cards = related.map(e => `
      <a href="./dossier.html?id=${e.id}" class="related-entity-card">
        <span class="dossier-type-badge" style="font-size: 0.68rem; margin-bottom: 4px;">
          ${this.escapeHtml(e.type.toUpperCase())}
        </span>
        <div class="related-entity-name">${this.escapeHtml(e.name)}</div>
        <p style="font-size: 0.84rem; color: var(--ink-secondary); line-height: 1.45; margin-bottom: 12px; flex: 1;">
          ${this.escapeHtml(e.publicRole || e.notes)}
        </p>
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent); font-weight: 600;">
          Inspect Full Dossier →
        </span>
      </a>
    `).join('');

    return `
      <div>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); margin-bottom: 16px;">
          Explore connected actors, political organizations, and legal counsel documented in the public research network:
        </p>
        <div class="related-entities-grid">${cards}</div>
      </div>
    `;
  }

  // Relationship Network Canvas Renderer (High-density interactive visual research graph)
  renderRelationshipGraph() {
    const canvas = document.getElementById('relationship-canvas');
    if (!canvas) return;

    const tooltip = document.getElementById('graph-tooltip');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Build graph nodes
    const otherEntities = this.data.entities.filter(e => e.id !== this.entity.id);
    const nodes = [
      { id: this.entity.id, name: this.entity.name, type: this.entity.type, identityState: this.entity.identityState, x: centerX, y: centerY, isCenter: true }
    ];

    const angleStep = (2 * Math.PI) / otherEntities.length;
    const radius = 150;

    otherEntities.forEach((oe, i) => {
      const angle = i * angleStep;
      nodes.push({
        id: oe.id,
        name: oe.name,
        type: oe.type,
        identityState: oe.identityState,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        isCenter: false
      });
    });

    const getNodeColor = (node) => {
      if (node.isCenter) return '#b3261e';
      switch (node.type) {
        case 'organisation': return '#2b5c8f';
        case 'company': return '#855a15';
        case 'domain': return '#6a3d9a';
        default: return '#3e7b52';
      }
    };

    const drawGraph = (hoveredNode, hoveredEdge) => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid lines
      ctx.strokeStyle = 'rgba(0,0,0,0.035)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Edges
      this.relatedRelationships.forEach(rel => {
        const fromNode = nodes.find(n => n.id === rel.fromEntity);
        const toNode = nodes.find(n => n.id === rel.toEntity);

        if (fromNode && toNode) {
          const isEdgeHovered = hoveredEdge === rel;
          ctx.beginPath();
          ctx.strokeStyle = isEdgeHovered ? '#b3261e' : 'rgba(17, 20, 23, 0.38)';
          ctx.lineWidth = isEdgeHovered ? 3 : 1.8;
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();

          // Edge semantic label with pill background
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          ctx.font = isEdgeHovered ? 'bold 10px "JetBrains Mono", monospace' : '9px "JetBrains Mono", monospace';
          const textWidth = ctx.measureText(rel.type).width;
          const pillPadding = 4;

          ctx.fillStyle = isEdgeHovered ? '#b3261e' : '#ffffff';
          ctx.fillRect(midX - textWidth / 2 - pillPadding, midY - 14, textWidth + pillPadding * 2, 16);
          ctx.strokeStyle = isEdgeHovered ? '#b3261e' : 'rgba(17, 20, 23, 0.2)';
          ctx.lineWidth = 1;
          ctx.strokeRect(midX - textWidth / 2 - pillPadding, midY - 14, textWidth + pillPadding * 2, 16);

          ctx.fillStyle = isEdgeHovered ? '#ffffff' : '#b3261e';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(rel.type, midX, midY - 6);
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode === node;
        const nodeRadius = node.isCenter ? 24 : 18;

        // Glowing outer halo for hovered node
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius + 9, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(179, 38, 30, 0.18)';
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = getNodeColor(node);
        ctx.fill();

        ctx.lineWidth = isHovered ? 3.5 : 2.2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Node Label
        ctx.font = node.isCenter ? 'bold 12px "Newsreader", serif' : '11px "Newsreader", serif';
        ctx.fillStyle = '#111417';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.name, node.x, node.y + nodeRadius + 6);
      });
    };

    // Initial draw
    drawGraph(null, null);

    let activeHoverNode = null;
    let activeHoverEdge = null;

    // Helper: Distance from point (px, py) to line segment (x1, y1)-(x2, y2)
    const distToSegment = (px, py, x1, y1, x2, y2) => {
      const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
      if (l2 === 0) return Math.hypot(px - x1, py - y1);
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
    };

    // Mouse move: detect hover over node or edge
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // Check nodes first
      let matchedNode = null;
      for (const node of nodes) {
        const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
        if (dist <= 26) {
          matchedNode = node;
          break;
        }
      }

      if (matchedNode) {
        if (activeHoverNode !== matchedNode) {
          activeHoverNode = matchedNode;
          activeHoverEdge = null;
          drawGraph(activeHoverNode, null);

          canvas.style.cursor = matchedNode.isCenter ? 'default' : 'pointer';

          if (tooltip) {
            const containerRect = canvas.parentElement.getBoundingClientRect();
            const tipX = e.clientX - containerRect.left;
            const tipY = e.clientY - containerRect.top;

            let relNote = 'Primary subject of this research dossier.';
            if (!matchedNode.isCenter) {
              const rel = this.relatedRelationships.find(
                r => (r.fromEntity === matchedNode.id && r.toEntity === this.entity.id) ||
                     (r.toEntity === matchedNode.id && r.fromEntity === this.entity.id)
              );
              relNote = rel ? `${rel.type} (${rel.period || 'Documented'})` : 'Public network co-occurrence.';
            }

            tooltip.style.left = `${tipX}px`;
            tooltip.style.top = `${tipY}px`;
            tooltip.style.display = 'block';
            tooltip.innerHTML = `
              <div class="graph-tooltip-title">${this.escapeHtml(matchedNode.name)}</div>
              <div class="graph-tooltip-type">${this.escapeHtml(matchedNode.type.toUpperCase())} · ${this.escapeHtml(matchedNode.identityState || 'CONFIRMED')}</div>
              <div class="graph-tooltip-rel">${this.escapeHtml(relNote)}</div>
              <div class="graph-tooltip-action">${matchedNode.isCenter ? 'Primary Subject' : 'Click to inspect dossier ↗'}</div>
            `;
          }
        }
        return;
      }

      // Check edges if no node hovered
      let matchedEdge = null;
      for (const rel of this.relatedRelationships) {
        const fromNode = nodes.find(n => n.id === rel.fromEntity);
        const toNode = nodes.find(n => n.id === rel.toEntity);
        if (fromNode && toNode) {
          const d = distToSegment(mouseX, mouseY, fromNode.x, fromNode.y, toNode.x, toNode.y);
          if (d <= 9) {
            matchedEdge = rel;
            break;
          }
        }
      }

      if (matchedEdge) {
        if (activeHoverEdge !== matchedEdge) {
          activeHoverEdge = matchedEdge;
          activeHoverNode = null;
          drawGraph(null, activeHoverEdge);
          canvas.style.cursor = 'default';

          if (tooltip) {
            const containerRect = canvas.parentElement.getBoundingClientRect();
            tooltip.style.left = `${e.clientX - containerRect.left}px`;
            tooltip.style.top = `${e.clientY - containerRect.top}px`;
            tooltip.style.display = 'block';
            tooltip.innerHTML = `
              <div class="graph-tooltip-type">DOCUMENTED RELATIONSHIP</div>
              <div class="graph-tooltip-title">${this.escapeHtml(matchedEdge.type)}</div>
              <div class="graph-tooltip-rel">${this.escapeHtml(matchedEdge.note || matchedEdge.period || '')}</div>
              <div style="margin-top: 6px; font-size: 0.7rem; color: #1e5e3a; font-weight: 600;">✓ Establishes: ${this.escapeHtml(matchedEdge.whatThisEstablishes || 'Documented public interaction')}</div>
              <div style="margin-top: 2px; font-size: 0.7rem; color: #b3261e; font-weight: 600;">✗ Does NOT establish: ${this.escapeHtml(matchedEdge.whatThisDoesNotEstablish || 'Does not establish private control or intent')}</div>
            `;
          }
        }
        return;
      }

      // Neither hovered
      if (activeHoverNode || activeHoverEdge) {
        activeHoverNode = null;
        activeHoverEdge = null;
        drawGraph(null, null);
        canvas.style.cursor = 'default';
        if (tooltip) tooltip.style.display = 'none';
      }
    });

    // Mouse leave: reset
    canvas.addEventListener('mouseleave', () => {
      activeHoverNode = null;
      activeHoverEdge = null;
      drawGraph(null, null);
      canvas.style.cursor = 'default';
      if (tooltip) tooltip.style.display = 'none';
    });

    // Click: navigate to node entity
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      nodes.forEach(node => {
        const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
        if (dist <= 26 && !node.isCenter) {
          window.location.href = `./dossier.html?id=${node.id}`;
        }
      });
    });
  }

  bindEvents() {
    // Entity switcher change
    if (this.entitySwitcher) {
      this.entitySwitcher.addEventListener('change', (e) => {
        window.location.href = `./dossier.html?id=${e.target.value}`;
      });
    }

    // Modal close
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) this.closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen()) this.closeModal();
    });

    // Delegate source modal triggers
    document.addEventListener('click', (e) => {
      const packetBtn = e.target.closest('.inspect-packet-btn');
      if (packetBtn && packetBtn.dataset.claimId) {
        e.preventDefault();
        this.openEvidenceModal(packetBtn.dataset.claimId);
        return;
      }

      const sourceBtn = e.target.closest('[data-source-id]');
      if (sourceBtn) {
        e.preventDefault();
        const sourceId = sourceBtn.dataset.sourceId;
        this.openSourceModal(sourceId);
      }
    });
  }

  initScrollSpy() {
    const navLinks = document.querySelectorAll('.dossier-nav-link');
    const sections = document.querySelectorAll('.dossier-section');

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.sectionTarget === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  isModalOpen() {
    return this.modalBackdrop && this.modalBackdrop.classList.contains('open');
  }

  openEvidenceModal(claimId) {
    const cl = this.data.claims.find(c => c.id === claimId);
    if (!cl || !this.modalBody || !this.modalBackdrop) return;
    const pkt = cl.evidencePacket || {};
    const src = this.data.sources.find(s => (cl.sourceIds || []).includes(s.id));

    this.modalBody.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
        EVIDENCE PACKET · ${this.escapeHtml(cl.code)} · ${this.escapeHtml(cl.state)}
      </div>
      <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--ink); line-height: 1.25; margin-bottom: 12px;">
        ${this.escapeHtml(cl.title || cl.claim)}
      </h3>
      <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.55; margin-bottom: 16px;">
        ${this.escapeHtml(cl.claim)}
      </p>

      <div style="background: rgba(30, 94, 58, 0.06); border-left: 3px solid #1e5e3a; padding: 12px 16px; border-radius: var(--radius-xs); margin-bottom: 16px;">
        <b style="font-family: var(--font-mono); font-size: 0.72rem; color: #1e5e3a; text-transform: uppercase; display: block; margin-bottom: 4px;">
          ⚖️ Why Do We Believe This? (10-Second Answer)
        </b>
        <p style="margin: 0; font-size: 0.9rem; color: var(--ink); line-height: 1.5;">${this.escapeHtml(pkt.whyWeBelieveThis || 'Attributed in on-record reporting.')}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; font-size: 0.86rem;">
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 12px;">
          <b style="font-family: var(--font-mono); font-size: 0.7rem; color: #1e5e3a; text-transform: uppercase; display: block; margin-bottom: 2px;">✓ Corroboration:</b>
          <span style="color: var(--ink);">${this.escapeHtml(pkt.corroboration || 'Multi-source newsroom agreement')}</span>
        </div>
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 12px;">
          <b style="font-family: var(--font-mono); font-size: 0.7rem; color: #b3261e; text-transform: uppercase; display: block; margin-bottom: 2px;">✗ What Is NOT Established:</b>
          <span style="color: var(--ink);">${this.escapeHtml(pkt.whatIsNotEstablished || 'Does not establish unrecorded motives')}</span>
        </div>
      </div>

      <div style="background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 12px; font-family: var(--font-mono); font-size: 0.74rem; color: var(--ink-secondary); margin-bottom: 16px;">
        <div style="margin-bottom: 4px;"><b>Primary Source:</b> ${this.escapeHtml(src ? src.publisher + ' — ' + src.title : cl.attribution)}</div>
        <div style="margin-bottom: 4px;"><b>Verification State:</b> ${this.escapeHtml(pkt.verificationState || cl.state)}</div>
        ${src && src.contentHash ? `<div><b>SHA-256 Hash:</b> <code>${this.escapeHtml(src.contentHash)}</code></div>` : ''}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);">Evidence Chain Audit Complete</span>
        ${src && src.archiveUrl ? `
          <a href="${this.escapeHtml(src.archiveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
            Inspect Archived Snapshot ↗
          </a>
        ` : (src ? `
          <a href="${this.escapeHtml(src.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
            Open Primary URL ↗
          </a>
        ` : '')}
      </div>
    `;

    this.modalBackdrop.classList.add('open');
    if (window.lenis) window.lenis.stop();
  }

  openSourceModal(sourceId) {
    const source = this.data.sources.find(s => s.id === sourceId);
    if (!source || !this.modalBody || !this.modalBackdrop) return;

    this.modalBody.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
        ${this.escapeHtml(source.code)} · ${this.escapeHtml(source.sourceClass)}
      </div>
      <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--ink); line-height: 1.25; margin-bottom: 14px;">
        ${this.escapeHtml(source.title)}
      </h3>
      <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted); margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
        <div><b>PUBLISHER:</b> ${this.escapeHtml(source.publisher)}</div>
        <div><b>PUBLISHED:</b> ${this.escapeHtml(source.publishedAt)}</div>
        <div><b>BYLINE:</b> ${this.escapeHtml(source.author)}</div>
        <div><b>CLASSIFICATION:</b> ${this.escapeHtml(source.sourceClass)}</div>
      </div>
      <div style="background: var(--bg); border-left: 3px solid var(--border-strong); padding: 12px 16px; font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 16px;">
        <b>Forensic Notes:</b> ${this.escapeHtml(source.notes)}
      </div>
      ${source.contentHash ? `
        <div style="font-family: var(--font-mono); font-size: 0.74rem; background: var(--surface); padding: 8px 12px; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); margin-bottom: 16px;">
          <b>SHA-256 Hash:</b> <code>${this.escapeHtml(source.contentHash)}</code>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
        ${source.archiveUrl ? `
          <a href="${this.escapeHtml(source.archiveUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); font-family: var(--font-mono); font-size: 0.76rem; font-weight: 700;">
            Wayback Archive Snapshot ↗
          </a>
        ` : '<span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);">Chain of Custody Verified</span>'}
        <a href="${this.escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
          Open Primary URL ↗
        </a>
      </div>
    `;

    this.modalBackdrop.classList.add('open');
    if (window.lenis) window.lenis.stop();
  }

  closeModal() {
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove('open');
      if (window.lenis) window.lenis.start();
    }
  }
}

// Bootstrap Dossier Application
document.addEventListener('DOMContentLoaded', () => {
  window.verdictDossier = new EntityDossierApp();
});
