import { useState, useEffect } from 'react'
import EEGWave from './components/EEGWave'
import ROCChart from './components/ROCChart'
import FeatureImportanceChart from './components/FeatureImportanceChart'
import ConfusionMatrix from './components/ConfusionMatrix'
import SHAPWaterfall from './components/SHAPWaterfall'

const BASE = import.meta.env.BASE_URL

function fmt(mean, std) {
  return `${mean.toFixed(3)} ± ${std.toFixed(3)}`
}

export default function App() {
  const [data, setData] = useState(null)
  const [waterfallSubject, setWaterfallSubject] = useState('ADHD')

  useEffect(() => {
    fetch(`${BASE}site_data.json`)
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('Failed to load site_data.json:', err))
  }, [])

  const rf  = data?.model_results?.['Random Forest']
  const svm = data?.model_results?.['SVM (RBF)']
  const ds  = data?.dataset

  return (
    <>
      {/* ── Navigation ── */}
      <nav>
        <div className="nav-inner">
          <span className="nav-title">EEG · ADHD Classification</span>
          <ul className="nav-links">
            <li><a href="#dataset">Dataset</a></li>
            <li><a href="#methodology">Methodology</a></li>
            <li><a href="#results">Results</a></li>
            <li><a href="#explainability">Explainability</a></li>
            <li><a href="#findings">Findings</a></li>
          </ul>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ borderTop: 'none', paddingBottom: '4rem' }}>
        <div className="container">
          <EEGWave />

          <span className="section-label">Machine Learning · Neuroscience · XAI</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            maxWidth: '680px',
            marginBottom: '1.25rem',
          }}>
            Classifying ADHD from<br />
            <em>resting-state EEG signals</em>
          </h1>

          <p style={{ fontSize: '1.05rem', maxWidth: '60ch' }}>
            A machine learning study using 19-channel EEG recordings from 121 children
            to distinguish ADHD from neurotypical controls — with SHAP-based
            explainability mapped back onto the brain.
          </p>

          <div className="stat-row">
            <div className="stat">
              <span className="stat-value">0.754</span>
              <span className="stat-label">ROC-AUC · Random Forest</span>
            </div>
            <div className="stat">
              <span className="stat-value">121</span>
              <span className="stat-label">subjects · ages 7–12</span>
            </div>
            <div className="stat">
              <span className="stat-value">171</span>
              <span className="stat-label">features per subject</span>
            </div>
            <div className="stat">
              <span className="stat-value">5-fold</span>
              <span className="stat-label">stratified cross-validation</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/evasafi/adhd-eeg-classification"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                background: '#1A1A1A',
                color: '#FAFAF8',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
            <a
              href="#results"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.6rem 1.25rem',
                border: '1px solid var(--divider)',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              Jump to results →
            </a>
          </div>
        </div>
      </section>

      {/* ── Dataset ── */}
      <section id="dataset">
        <div className="container">
          <span className="section-label">Dataset</span>
          <h2>IEEE 19-Channel EEG</h2>
          <p style={{ marginTop: '0.5rem' }}>
            Nasrabadi et al. (2020). Resting-state EEG recorded from children
            diagnosed with ADHD and age-matched healthy controls under eyes-open
            conditions at 128 Hz.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
            <div>
              <table className="metric-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Total subjects</td><td>121</td></tr>
                  <tr><td>ADHD</td><td style={{ color: '#E07B7B', fontWeight: 500 }}>61</td></tr>
                  <tr><td>Control</td><td style={{ color: '#7BB8E0', fontWeight: 500 }}>60</td></tr>
                  <tr><td>Age range</td><td>7 – 12 years</td></tr>
                  <tr><td>Sampling rate</td><td>128 Hz</td></tr>
                  <tr><td>Channels</td><td>19 (10-20 system)</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <div style={{
                background: 'var(--bg-subtle)',
                borderRadius: '6px',
                padding: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}>
                <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  19 Channels (10-20)
                </div>
                {['Fp1','Fp2','F3','F4','C3','C4','P3','P4','O1','O2',
                  'F7','F8','T7','T8','P7','P8','Fz','Cz','Pz'].map(ch => (
                  <span key={ch} className="badge badge-theta" style={{ margin: '0.15rem' }}>{ch}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="img-grid" style={{ marginTop: '2rem' }}>
            <div className="img-wrap">
              <img src={`${BASE}plots/02_raw_eeg_adhd.png`} alt="Raw EEG — ADHD subject" />
              <div className="img-label">Raw EEG trace · ADHD subject (5 seconds, 8 channels)</div>
            </div>
            <div className="img-wrap">
              <img src={`${BASE}plots/02_raw_eeg_control.png`} alt="Raw EEG — Control subject" />
              <div className="img-label">Raw EEG trace · Control subject (5 seconds, 8 channels)</div>
            </div>
          </div>

          <div className="img-grid single" style={{ marginTop: '1.25rem' }}>
            <div className="img-wrap">
              <img src={`${BASE}plots/03_psd_comparison.png`} alt="PSD comparison ADHD vs Control" />
              <div className="img-label">Power Spectral Density — ADHD vs Control (Welch's method, averaged across channels)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section id="methodology">
        <div className="container">
          <span className="section-label">Methodology</span>
          <h2>Pipeline</h2>
          <p style={{ marginTop: '0.5rem' }}>
            End-to-end from raw EEG to model explanation. No artifact removal was applied
            to stay close to the original dataset conditions.
          </p>

          <div className="pipeline">
            {[
              { step: '01', title: 'Load EEG', detail: 'CSV, 128 Hz, 19-ch' },
              { step: '02', title: 'Band Power', detail: 'Welch PSD · 4 bands' },
              { step: '03', title: 'Features', detail: '171 per subject' },
              { step: '04', title: 'Classify', detail: 'RF · SVM · 5-fold CV' },
              { step: '05', title: 'Explain', detail: 'SHAP · Topomaps' },
            ].map((s, i, arr) => (
              <>
                <div key={s.step} className="pipeline-step">
                  <div className="pipeline-step-label">{s.step}</div>
                  <div className="pipeline-step-title">{s.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.detail}</div>
                </div>
                {i < arr.length - 1 && <div className="pipeline-arrow">→</div>}
              </>
            ))}
          </div>

          <h3 style={{ marginTop: '3rem' }}>Feature Engineering</h3>
          <p>
            Three families of features extracted per subject, yielding 171 total.
            All computed per-channel then concatenated into a flat feature vector.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              {
                title: 'Band Power',
                count: '76 features',
                desc: 'Absolute power in Delta (1–4 Hz), Theta (4–8 Hz), Alpha (8–12 Hz), and Beta (12–30 Hz) bands via Welch\'s method × 19 channels.',
                badges: ['Delta', 'Theta', 'Alpha', 'Beta'],
              },
              {
                title: 'Theta/Beta Ratio',
                count: '19 features',
                desc: 'TBR per channel. Clinically established ADHD biomarker — elevated theta relative to beta is consistently reported in ADHD children.',
                badges: ['TBR'],
              },
              {
                title: 'Statistical',
                count: '76 features',
                desc: 'Mean, variance, skewness, and kurtosis of the raw signal per channel. Captures amplitude distribution and temporal dynamics.',
                badges: ['Statistical'],
              },
            ].map(group => (
              <div key={group.title} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--divider)',
                borderRadius: '6px',
                padding: '1.25rem',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                  {group.count}
                </div>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{group.title}</div>
                <p style={{ fontSize: '0.83rem', marginBottom: '0.75rem' }}>{group.desc}</p>
                <div>
                  {group.badges.map(b => (
                    <span key={b} className={`badge badge-${b.toLowerCase().replace('/', '').replace(' ', '-').replace('theta/beta ratio', 'tbr')}`}>{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="img-grid single" style={{ marginTop: '2rem' }}>
            <div className="img-wrap">
              <img src={`${BASE}plots/04_band_power_boxplots.png`} alt="Band power boxplots" />
              <div className="img-label">Band power distribution across all 121 subjects — ADHD vs Control</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section id="results">
        <div className="container">
          <span className="section-label">Results</span>
          <h2>Model Performance</h2>
          <p style={{ marginTop: '0.5rem' }}>
            Evaluated with stratified 5-fold cross-validation. Metrics reported as
            mean ± standard deviation across folds. Confusion matrices show
            out-of-fold predictions aggregated across all 5 folds.
          </p>

          {rf && svm && (
            <table className="metric-table" style={{ marginTop: '2rem' }}>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>F1 Score</th>
                  <th>ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Random Forest</td>
                  <td className="best">{fmt(rf.accuracy_mean, rf.accuracy_std)}</td>
                  <td className="best">{fmt(rf.f1_mean, rf.f1_std)}</td>
                  <td className="best">{fmt(rf.roc_auc_mean, rf.roc_auc_std)}</td>
                </tr>
                <tr>
                  <td>SVM (RBF kernel)</td>
                  <td>{fmt(svm.accuracy_mean, svm.accuracy_std)}</td>
                  <td>{fmt(svm.f1_mean, svm.f1_std)}</td>
                  <td>{fmt(svm.roc_auc_mean, svm.roc_auc_std)}</td>
                </tr>
              </tbody>
            </table>
          )}

          <div className="chart-wrap" style={{ marginTop: '2rem' }}>
            <ROCChart rocData={data?.roc_curves} />
            <p className="chart-caption">
              ROC curves — out-of-fold predictions aggregated across all 5 CV folds.
              A diagonal line represents random classification (AUC = 0.5).
            </p>
          </div>

          <h3 style={{ marginTop: '3rem' }}>Confusion Matrices</h3>
          <p>Out-of-fold predictions across all subjects (n=121).</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
            {data?.confusion_matrices && Object.entries(data.confusion_matrices).map(([name, cm]) => (
              <div key={name}>
                <div style={{ fontWeight: 500, marginBottom: '0.75rem', fontSize: '0.9rem' }}>{name}</div>
                <ConfusionMatrix data={cm} modelName={name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explainability ── */}
      <section id="explainability">
        <div className="container">
          <span className="section-label">Explainability · XAI</span>
          <h2>What the model learned</h2>
          <p style={{ marginTop: '0.5rem' }}>
            SHAP (SHapley Additive exPlanations) decomposes each prediction into
            per-feature contributions. Values above zero push the model toward ADHD;
            below zero toward Control.
          </p>

          <h3 style={{ marginTop: '2.5rem' }}>Global Feature Importance</h3>
          <p>Two views of global importance: Random Forest's built-in mean decrease
          impurity, and mean absolute SHAP value across all subjects.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="chart-wrap" style={{ marginTop: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                RF Feature Importance (MDI)
              </div>
              <FeatureImportanceChart
                data={data?.feature_importance}
                title="Mean Decrease Impurity"
                valueKey="importance"
              />
            </div>
            <div className="chart-wrap" style={{ marginTop: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                SHAP Mean |Value|
              </div>
              <FeatureImportanceChart
                data={data?.shap_summary}
                title="Mean |SHAP value|"
                valueKey="mean_abs_shap"
              />
            </div>
          </div>

          <div className="img-grid single" style={{ marginTop: '1.5rem' }}>
            <div className="img-wrap">
              <img src={`${BASE}plots/09_shap_summary.png`} alt="SHAP beeswarm summary" />
              <div className="img-label">SHAP beeswarm — each dot is one subject. Color = feature value (high/low). Position = SHAP impact on ADHD prediction.</div>
            </div>
          </div>

          <h3 style={{ marginTop: '3rem' }}>Individual Predictions</h3>
          <p>
            SHAP waterfall for a representative subject from each group —
            selected as the subject whose predicted probability is closest
            to the group mean.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            {['ADHD', 'Control'].map(g => (
              <button
                key={g}
                onClick={() => setWaterfallSubject(g)}
                style={{
                  padding: '0.45rem 1rem',
                  border: `1px solid ${waterfallSubject === g ? (g === 'ADHD' ? '#E07B7B' : '#7BB8E0') : 'var(--divider)'}`,
                  borderRadius: '4px',
                  background: waterfallSubject === g ? (g === 'ADHD' ? '#FEE2E2' : '#DBEAFE') : 'transparent',
                  color: waterfallSubject === g ? (g === 'ADHD' ? '#991B1B' : '#1D4ED8') : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: waterfallSubject === g ? 500 : 400,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {g} subject
              </button>
            ))}
          </div>

          {data?.shap_waterfall && (
            <div className="chart-wrap">
              <SHAPWaterfall data={data.shap_waterfall[waterfallSubject]} />
              <p className="chart-caption">
                Top 15 features by |SHAP| for the selected subject.
                Base value = {data.shap_waterfall[waterfallSubject]?.base_value.toFixed(3)} (dataset mean prediction rate).
              </p>
            </div>
          )}

          <h3 style={{ marginTop: '3rem' }}>Brain Topography</h3>
          <p>
            Feature importance and band power mapped spatially onto the 19-electrode scalp layout.
            Warmer colors indicate higher values.
          </p>

          <div className="img-grid" style={{ marginTop: '1.5rem' }}>
            <div className="img-wrap">
              <img src={`${BASE}plots/11_topomap_theta.png`} alt="Theta power topomap" />
              <div className="img-label">Theta power (4–8 Hz) — ADHD vs Control</div>
            </div>
            <div className="img-wrap">
              <img src={`${BASE}plots/11_topomap_tbr.png`} alt="TBR topomap" />
              <div className="img-label">Theta/Beta Ratio — ADHD vs Control</div>
            </div>
          </div>
          <div className="img-grid single" style={{ marginTop: '1.25rem' }}>
            <div className="img-wrap">
              <img src={`${BASE}plots/11_topomap_shap.png`} alt="SHAP importance topomap" />
              <div className="img-label">Mean |SHAP| per channel — which brain regions drive classification</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Findings ── */}
      <section id="findings">
        <div className="container">
          <span className="section-label">Key Findings</span>
          <h2>Discussion</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
            <div>
              <h3>What the model found</h3>
              <ul className="limitations" style={{ listStyle: 'none' }}>
                {[
                  'Statistical features (variance, skewness) — particularly at parietal and temporal channels — were the strongest discriminators, outranking band power features.',
                  'The Theta/Beta Ratio at Pz ranked in the top 5 features, consistent with the clinical literature on frontal-central TBR elevation in ADHD.',
                  'Beta power at central (Cz) and frontal-right (F4) channels contributed meaningfully — suggesting reduced cortical inhibition in ADHD subjects.',
                  'Random Forest (AUC 0.754) outperformed SVM (AUC 0.683), likely due to its robustness to the high feature-to-sample ratio (171 features, 121 subjects).',
                ].map((finding, i) => (
                  <li key={i}>{finding}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Limitations</h3>
              <ul className="limitations">
                {[
                  'Small sample size (N=121). With only 121 subjects, cross-validation estimates carry meaningful uncertainty — the ± std on AUC reflects this.',
                  'No artifact removal. Eye blinks and muscle noise were not filtered, which may inflate variance features artificially.',
                  'Subject-level features only. All features are computed over the full recording per subject, discarding temporal dynamics.',
                  'Single dataset. Results may not generalize across EEG systems, recording protocols, or age groups outside 7–12 years.',
                  'No leave-one-subject-out validation. Stratified k-fold does not fully control for subject-level dependencies.',
                ].map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            background: 'var(--accent-light)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: '0 4px 4px 0',
            padding: '1.25rem 1.5rem',
            marginTop: '2.5rem',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              Clinical context
            </div>
            <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
              This is a research-grade classification study, not a diagnostic tool.
              EEG-based ADHD classification remains an active research area.
              The theta/beta ratio, while historically cited, is not currently
              endorsed as a standalone biomarker by clinical guidelines.
              These findings should be interpreted alongside behavioral and clinical assessment.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-inner">
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.3rem' }}>
              Eva Safi
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Software Engineering · Üsküdar University · Istanbul
            </div>
          </div>
          <div className="footer-links">
            <a href="https://github.com/evasafi/adhd-eeg-classification" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://github.com/evasafi" target="_blank" rel="noopener noreferrer">Portfolio</a>
            <a href="https://www.linkedin.com/in/eva-safi-467403272/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  )
}
