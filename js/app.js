/**
 * VERDICT â Public Accountability & Open-Source Intelligence
 * Research Interface Controller (Vanilla ES Module)
 */

import { VERDICT_DATA } from './data.js';

class VerdictApp {
  constructor() {
    this.data = VERDICT_DATA;
    this.selectedEntityId = null;
    this.activeFilter = 'all';
    this.activeTargetType = 'all';
    this.searchQuery = '';

    this.initElements();
    this.bindEvents();
    this.renderInitialViews();
  }

  initElements() {
    // Search & Target Type
    this.searchInput = document.getElementById('search-input');
    this.searchClearBtn = document.getElementById('search-clear');
    this.targetTypeBtns = document.querySelectorAll('.target-type-btn');
    this.tryLinks = document.querySelectorAll('.try-link');

    // Section Filters
    this.filterChips = document.querySelectorAll('.filter-chip');
    this.activeFilterAlert = document.getElementById('active-filter-alert');
    this.filterMessage = document.getElementById('filter-message');
    this.filterResetBtn = document.getElementById('filter-reset-btn');

    // Disambiguation & Unindexed Panels
    this.disambiguationPanel = document.getElementById('disambiguation-panel');
    this.disambiguationList = document.getElementById('disambiguation-list');
    this.unindexedCard = document.getElementById('unindexed-card');
    this.unindexedQueryText = document.getElementById('unindexed-query-text');
    this.unindexedLeadBtn = document.getElementById('unindexed-lead-btn');

    // Content Containers
    this.evidenceContainer = document.getElementById('evidence-stream');
    this.entitiesContainer = document.getElementById('entities-grid');
    this.timelineContainer = document.getElementById('timeline-stream');
    this.fundingContainer = document.getElementById('funding-tbody');
    this.questionsContainer = document.getElementById('questions-grid');

    // Modal
    this.modalBackdrop = document.getElementById('source-modal');
    this.modalCloseBtn = document.getElementById('modal-close-btn');
    this.modalBody = document.getElementById('modal-content-body');
  }

  bindEvents() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (this.searchClearBtn) {
          this.searchClearBtn.style.display = this.searchQuery ? 'block' : 'none';
        }
        this.applyFilters();
      });
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        if (this.searchInput) {
          this.searchInput.value = '';
          this.searchInput.focus();
        }
        this.searchQuery = '';
        this.searchClearBtn.style.display = 'none';
        this.applyFilters();
      });
    }

    // Target Type Selectors
    this.targetTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.targetTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTargetType = btn.dataset.targetType || 'all';

        const targetConf = this.data.supportedTargetTypes.find(t => t.id === this.activeTargetType);
        if (this.searchInput && targetConf) {
          this.searchInput.placeholder = targetConf.placeholder;
          this.searchInput.focus();
        }
        this.applyFilters();
      });
    });

    // Try Prompts Links
    this.tryLinks.forEach(link => {
      link.addEventListener('click', () => {
        const query = link.dataset.query;
        if (this.searchInput && query) {
          this.searchInput.value = query;
          this.searchQuery = query.toLowerCase();
          if (this.searchClearBtn) this.searchClearBtn.style.display = 'block';
          this.applyFilters();
          this.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Filter Chips
    this.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.dataset.filter || 'all';
        this.applyFilters();
      });
    });

    // Reset filter
    if (this.filterResetBtn) {
      this.filterResetBtn.addEventListener('click', () => {
        this.resetAllFilters();
      });
    }

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== this.searchInput && !this.isModalOpen()) {
        e.preventDefault();
        if (this.searchInput) {
          this.searchInput.focus();
          this.searchInput.select();
        }
      }
      if (e.key === 'Escape') {
        if (this.isModalOpen()) {
          this.closeModal();
        } else if (this.searchQuery || this.selectedEntityId) {
          this.resetAllFilters();
        }
      }
    });

    // Modal close
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) {
          this.closeModal();
        }
      });
    }

    // Delegate source modal openers across the document
    document.addEventListener('click', (e) => {
      const sourceBtn = e.target.closest('[data-source-id]');
      if (sourceBtn) {
        e.preventDefault();
        const sourceId = sourceBtn.dataset.sourceId;
        this.openSourceModal(sourceId);
      }
    });
  }

  isModalOpen() {
    return this.modalBackdrop && this.modalBackdrop.classList.contains('open');
  }

  openSourceModal(sourceId) {
    const source = this.data.sources.find(s => s.id === sourceId);
    if (!source || !this.modalBody || !this.modalBackdrop) return;

    this.modalBody.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
        ${source.code} Â· ${source.sourceClass}
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
      <div style="background: var(--bg); border-left: 3px solid var(--border-strong); padding: 12px 16px; font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 20px;">
        <b>Forensic Notes:</b> ${this.escapeHtml(source.notes)}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);">Chain of Custody Verified</span>
        <a href="${this.escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
          Open Primary URL â
        </a>
      </div>
    `;

    this.modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  resetAllFilters() {
    this.searchQuery = '';
    this.selectedEntityId = null;
    this.activeFilter = 'all';
    this.activeTargetType = 'all';

    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchInput.placeholder = this.data.supportedTargetTypes[0].placeholder;
    }
    if (this.searchClearBtn) {
      this.searchClearBtn.style.display = 'none';
    }

    this.targetTypeBtns.forEach(b => b.classList.toggle('active', b.dataset.targetType === 'all'));
    this.filterChips.forEach(c => c.classList.toggle('active', c.dataset.filter === 'all'));
    document.querySelectorAll('.entity-card').forEach(c => c.classList.remove('selected'));

    if (this.disambiguationPanel) this.disambiguationPanel.style.display = 'none';
    if (this.unindexedCard) this.unindexedCard.style.display = 'none';

    this.applyFilters();
  }

  selectEntity(entityId) {
    if (this.selectedEntityId === entityId) {
      this.selectedEntityId = null;
    } else {
      this.selectedEntityId = entityId;
    }

    document.querySelectorAll('.entity-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.entityId === this.selectedEntityId);
    });

    this.applyFilters();
  }

  applyFilters() {
    let matchCount = 0;
    const q = this.searchQuery;

    // Check for Ambiguous Demo Queries (e.g. Rahul Sharma)
    if (q && this.disambiguationPanel && this.data.disambiguationExamples) {
      const demoKey = Object.keys(this.data.disambiguationExamples).find(k => q.includes(k) || k.includes(q));
      if (demoKey) {
        const demo = this.data.disambiguationExamples[demoKey];
        this.renderDisambiguation(demo);
        this.disambiguationPanel.style.display = 'block';
      } else {
        this.disambiguationPanel.style.display = 'none';
      }
    } else if (this.disambiguationPanel) {
      this.disambiguationPanel.style.display = 'none';
    }

    // 1. Evidence / Claims
    const claimCards = document.querySelectorAll('.evidence-row');
    claimCards.forEach(card => {
      const id = card.dataset.id;
      const claim = this.data.claims.find(c => c.id === id);
      if (!claim) return;

      const matchType = (this.activeFilter === 'all' || this.activeFilter === 'claims') &&
                        (this.activeTargetType === 'all' || this.activeTargetType === 'case');
      const matchEntity = !this.selectedEntityId || claim.subjectEntityId === this.selectedEntityId;
      const textToSearch = `${claim.code} ${claim.title} ${claim.claim} ${claim.attribution} ${claim.note} ${(claim.tags || []).join(' ')}`.toLowerCase();
      const matchSearch = !q || textToSearch.includes(q);

      const visible = matchType && matchEntity && matchSearch;
      card.style.display = visible ? 'block' : 'none';
      if (visible) matchCount++;
    });

    // 2. Entities
    const entityCards = document.querySelectorAll('.entity-card');
    entityCards.forEach(card => {
      const id = card.dataset.entityId;
      const entity = this.data.entities.find(e => e.id === id);
      if (!entity) return;

      const matchType = (this.activeFilter === 'all' || this.activeFilter === 'entities') &&
                        (this.activeTargetType === 'all' || this.activeTargetType === entity.type);
      const matchEntity = !this.selectedEntityId || entity.id === this.selectedEntityId;
      const textToSearch = `${entity.name} ${entity.publicRole} ${(entity.aliases || []).join(' ')} ${entity.notes}`.toLowerCase();
      const matchSearch = !q || textToSearch.includes(q);

      const visible = matchType && matchEntity && matchSearch;
      card.style.display = visible ? 'block' : 'none';
      if (visible) matchCount++;
    });

    // 3. Timeline
    const timelineEntries = document.querySelectorAll('.timeline-entry');
    timelineEntries.forEach(entry => {
      const id = entry.dataset.id;
      const evt = this.data.events.find(e => e.id === id);
      if (!evt) return;

      const matchType = (this.activeFilter === 'all' || this.activeFilter === 'timeline') &&
                        (this.activeTargetType === 'all');
      const matchEntity = !this.selectedEntityId || (evt.entityIds && evt.entityIds.includes(this.selectedEntityId));
      const textToSearch = `${evt.date} ${evt.title} ${evt.summary}`.toLowerCase();
      const matchSearch = !q || textToSearch.includes(q);

      const visible = matchType && matchEntity && matchSearch;
      entry.style.display = visible ? 'block' : 'none';
      if (visible) matchCount++;
    });

    // 4. Funding
    const fundingRows = document.querySelectorAll('.ledger-row');
    fundingRows.forEach(row => {
      const id = row.dataset.id;
      const fund = this.data.funding.find(f => f.id === id);
      if (!fund) return;

      const matchType = (this.activeFilter === 'all' || this.activeFilter === 'funding') &&
                        (this.activeTargetType === 'all');
      const textToSearch = `${fund.donor} ${fund.recipient} ${fund.category} ${fund.amountAnnounced} ${fund.statutoryNote}`.toLowerCase();
      const matchSearch = !q || textToSearch.includes(q);

      const visible = matchType && matchSearch;
      row.style.display = visible ? 'table-row' : 'none';
      if (visible) matchCount++;
    });

    // Check for Unindexed Target State
    if (q && matchCount === 0 && (!this.disambiguationPanel || this.disambiguationPanel.style.display === 'none')) {
      if (this.unindexedCard) {
        if (this.unindexedQueryText) this.unindexedQueryText.textContent = q;
        if (this.unindexedLeadBtn) {
          this.unindexedLeadBtn.onclick = () => {
            window.location.href = `./contribute.html?target=${encodeURIComponent(q)}`;
          };
        }
        this.unindexedCard.style.display = 'block';
      }
    } else if (this.unindexedCard) {
      this.unindexedCard.style.display = 'none';
    }

    // Update Alert Banner
    if (this.activeFilterAlert) {
      const isFiltered = Boolean(q || this.selectedEntityId || this.activeFilter !== 'all' || this.activeTargetType !== 'all');
      if (isFiltered) {
        let msg = `Showing ${matchCount} matching record${matchCount === 1 ? '' : 's'}`;
        if (this.selectedEntityId) {
          const ent = this.data.entities.find(e => e.id === this.selectedEntityId);
          msg += ` connected to "${ent ? ent.name : this.selectedEntityId}"`;
        }
        if (q) {
          msg += ` matching "${q}"`;
        }
        if (this.activeTargetType !== 'all') {
          msg += ` in target [${this.activeTargetType.toUpperCase()}]`;
        }
        if (this.activeFilter !== 'all') {
          msg += ` section [${this.activeFilter.toUpperCase()}]`;
        }
        this.filterMessage.textContent = msg;
        this.activeFilterAlert.style.display = 'flex';
      } else {
        this.activeFilterAlert.style.display = 'none';
      }
    }
  }

  renderDisambiguation(demo) {
    if (!this.disambiguationList) return;
    this.disambiguationList.innerHTML = demo.candidates.map(c => `
      <div class="candidate-card">
        <div class="candidate-info">
          <h4>${this.escapeHtml(c.name)}</h4>
          <div class="candidate-meta">
            <b>Organization:</b> ${this.escapeHtml(c.organization)} Â· 
            <b>Role:</b> ${this.escapeHtml(c.role)} Â· 
            <b>Jurisdiction:</b> ${this.escapeHtml(c.location)}
          </div>
          <div style="font-size: 0.78rem; color: var(--ink-secondary); margin-top: 4px;">
            Signals: ${c.signals.map(s => `<code>${this.escapeHtml(s)}</code>`).join(' ')} Â· Active: ${c.activeYears}
          </div>
        </div>
        <div>
          <span class="identity-badge ${c.state}">${c.state}</span>
        </div>
      </div>
    `).join('');
  }

  renderInitialViews() {
    this.renderEntities();
    this.renderClaims();
    this.renderTimeline();
    this.renderFunding();
    this.renderQuestions();
  }

  renderEntities() {
    if (!this.entitiesContainer) return;
    this.entitiesContainer.innerHTML = this.data.entities.map(entity => {
      const relCount = this.data.relationships.filter(r => r.fromEntity === entity.id || r.toEntity === entity.id).length;
      const claimCount = this.data.claims.filter(c => c.subjectEntityId === entity.id).length;

      return `
        <article class="entity-card" data-entity-id="${entity.id}" role="region" aria-label="Entity ${this.escapeHtml(entity.name)}">
          <div class="entity-type-badge">${entity.type} Â· ${entity.identityState}</div>
          <h3 class="entity-name">
            <a href="./dossier.html?id=${entity.id}" style="color: inherit; text-decoration: none;" title="Open complete investigative dossier">
              ${this.escapeHtml(entity.name)} â
            </a>
          </h3>
          <p class="entity-role">${this.escapeHtml(entity.publicRole)}</p>
          <div class="entity-pivots">
            <span>${claimCount} Claim${claimCount === 1 ? '' : 's'}</span>
            <span>${relCount} Relationship${relCount === 1 ? '' : 's'}</span>
          </div>
          <div style="margin-top: 14px; display: flex; gap: 8px;">
            <a href="./dossier.html?id=${entity.id}" class="btn-primary" style="flex: 1; justify-content: center; padding: 7px 12px; font-size: 0.78rem; text-decoration: none;">
              Open Full Dossier â
            </a>
            <button type="button" class="filter-chip entity-filter-btn" data-entity-filter-id="${entity.id}" style="padding: 6px 10px; font-size: 0.74rem;">
              Filter Brief
            </button>
          </div>
        </article>
      `;
    }).join('');

    this.entitiesContainer.querySelectorAll('.entity-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.entityFilterId;
        this.selectEntity(id);
      });
    });
  }

  renderClaims() {
    if (!this.evidenceContainer) return;
    this.evidenceContainer.innerHTML = this.data.claims.map(claim => {
      const source = this.data.sources.find(s => claim.sourceIds && claim.sourceIds.includes(s.id));
      const sourceHtml = source ? `
        <button class="source-link-btn" data-source-id="${source.id}" title="Inspect source provenance">
          Source: ${this.escapeHtml(claim.attribution)} [${source.code}] â
        </button>
      ` : `<span>${this.escapeHtml(claim.attribution)}</span>`;

      const subjectEntity = this.data.entities.find(e => e.id === claim.subjectEntityId);
      const entityPill = subjectEntity ? `
        <a href="./dossier.html?id=${subjectEntity.id}" class="entity-pill-link" title="Open complete dossier for ${this.escapeHtml(subjectEntity.name)}">
          Subject: ${this.escapeHtml(subjectEntity.name)} â
        </a>
      ` : '';

      return `
        <article class="evidence-row" data-id="${claim.id}">
          <div class="evidence-top">
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <span class="evidence-id-badge">${claim.code} Â· ${claim.date}</span>
              ${entityPill}
            </div>
            <span class="state-badge ${claim.state.toLowerCase()}">${claim.state}</span>
          </div>
          <h3 class="evidence-title">${this.escapeHtml(claim.title)}</h3>
          <p class="evidence-claim">${this.escapeHtml(claim.claim)}</p>
          <div class="evidence-note">
            <b>Research Note:</b> ${this.escapeHtml(claim.note)}
          </div>
          <div class="evidence-footer">
            <span class="source-attribution">${sourceHtml}</span>
            <span style="font-size: 0.72rem; color: var(--ink-faint);">${(claim.tags || []).map(t => `#${t}`).join(' ')}</span>
          </div>
        </article>
      `;
    }).join('');
  }

  renderTimeline() {
    if (!this.timelineContainer) return;
    this.timelineContainer.innerHTML = this.data.events.map((evt, idx) => {
      const source = this.data.sources.find(s => s.id === evt.sourceId);
      const isFeatured = idx === this.data.events.length - 1;

      const eventEntities = (evt.entityIds || []).map(id => this.data.entities.find(e => e.id === id)).filter(Boolean);
      const entityPills = eventEntities.map(ent => `
        <a href="./dossier.html?id=${ent.id}" class="entity-pill-link" style="font-size: 0.68rem; padding: 1px 6px;" title="Open dossier for ${this.escapeHtml(ent.name)}">
          ${this.escapeHtml(ent.name)} â
        </a>
      `).join(' ');

      return `
        <div class="timeline-entry ${isFeatured ? 'featured' : ''}" data-id="${evt.id}">
          <div class="timeline-date-label">${evt.date}</div>
          <div class="timeline-content-card">
            <h4 class="timeline-entry-title">${this.escapeHtml(evt.title)}</h4>
            <p class="timeline-entry-desc">${this.escapeHtml(evt.summary)}</p>
            <div class="timeline-entry-footer">
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <span class="state-badge ${evt.state.toLowerCase()}">${evt.state}</span>
                ${entityPills}
              </div>
              ${source ? `
                <button class="source-link-btn" data-source-id="${source.id}">
                  ${source.code} Â· ${source.publisher} â
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderFunding() {
    if (!this.fundingContainer) return;
    this.fundingContainer.innerHTML = this.data.funding.map(fund => {
      const source = this.data.sources.find(s => s.id === fund.sourceId);
      return `
        <tr class="ledger-row" data-id="${fund.id}">
          <td>
            <div style="font-weight: 600; color: var(--ink);">${this.escapeHtml(fund.donor)}</div>
            <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--ink-muted); margin-top: 2px;">
              â ${this.escapeHtml(fund.recipient)}
            </div>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600;">${this.escapeHtml(fund.category)}</span>
          </td>
          <td>
            <div class="ledger-amt ${fund.amountAnnounced.includes('Undisclosed') ? 'unknown' : ''}">
              ${this.escapeHtml(fund.amountAnnounced)}
            </div>
            <div style="font-size: 0.75rem; color: var(--ink-muted); margin-top: 2px;">
              Verified: ${this.escapeHtml(fund.amountVerifiedReceived)}
            </div>
          </td>
          <td>
            <span class="state-badge ${fund.state.toLowerCase()}">${fund.state}</span>
          </td>
          <td>
            <div style="font-size: 0.82rem; color: var(--ink-secondary); line-height: 1.45; margin-bottom: 6px;">
              ${this.escapeHtml(fund.statutoryNote)}
            </div>
            ${source ? `
              <button class="source-link-btn" data-source-id="${source.id}" style="font-size: 0.72rem;">
                ${source.publisher} [${source.code}] â
              </button>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }

  renderQuestions() {
    if (!this.questionsContainer) return;
    this.questionsContainer.innerHTML = this.data.openQuestions.map(q => `
      <article class="question-card">
        <div class="question-num">${q.number}</div>
        <h4 class="question-text">${this.escapeHtml(q.question)}</h4>
        <div class="question-context">
          <b>Research context:</b> ${this.escapeHtml(q.context)}
        </div>
      </article>
    `).join('');
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

// Initialise upon DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.verdictApp = new VerdictApp();
});
