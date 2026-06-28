# ADHD EEG Classification

Classifying ADHD vs. healthy children from resting-state EEG using handcrafted spectral and statistical features with classical machine learning.

A subject-level analysis on the IEEE 19-channel ADHD EEG dataset (Nasrabadi et al., 2020), implemented with `scipy`, `scikit-learn`, and `pandas`.

**[→ View the interactive research showcase](https://evasafi.github.io/adhd-eeg-classification/)**
---

## Background

Attention Deficit Hyperactivity Disorder (ADHD) is one of the most common neurodevelopmental disorders in children. EEG-based methods are an active area of research as a non-invasive, objective complement to behavioral diagnostic criteria.

Two findings from the literature motivate this project:

1. **The theta/beta ratio (TBR)** has historically been proposed as an ADHD biomarker - elevated theta and reduced beta activity over frontal-central regions.
2. **Multi-feature ML approaches** consistently outperform any single biomarker, suggesting ADHD-related EEG signatures are distributed across bands and channels.

This project builds a clean, end-to-end pipeline to test these ideas on a public benchmark dataset.

---

## Dataset

**IEEE EEG Data for ADHD / Control Children** (Nasrabadi et al., 2020) - [IEEE DataPort](https://ieee-dataport.org/open-access/eeg-data-adhd-control-children) | [Kaggle mirror](https://www.kaggle.com/datasets/danizo/eeg-dataset-for-adhd)

| Property | Value |
|---|---|
| Subjects | 121 (61 ADHD, 60 Control) |
| Age range | 7–12 years |
| Channels | 19 (10–20 standard) |
| Sampling rate | 128 Hz |
| Task | Visual attention (cartoon character counting) |
| Mean recording duration | 154s ADHD / 125s Control |

ADHD subjects were diagnosed by an experienced psychiatrist according to DSM-IV criteria. Controls had no history of psychiatric disorders, epilepsy, or high-risk behaviors.

---

## Methodology

### 1. Exploratory Data Analysis (`01_eda.ipynb`)
- Class balance and recording duration analysis
- Raw EEG signal inspection; ADHD signals appear noisier/more irregular than Control
- Power Spectral Density (PSD) comparison using Welch's method
- Group-level band power comparison across all 121 subjects

### 2. Feature Extraction (`02_feature_extraction.ipynb`)
171 features extracted per subject:

| Feature group | Count | Description |
|---|---|---|
| Band power | 76 | Delta (1–4 Hz), Theta (4–8), Alpha (8–12), Beta (12–30) × 19 channels |
| Theta/Beta ratio | 19 | One TBR per channel |
| Statistical | 76 | Mean, Variance, Skewness, Kurtosis × 19 channels |

Band power computed using Welch's method (`nperseg=256`), which is more stable than raw FFT on noisy, variable-length EEG.

### 3. Classification (`03_classification.ipynb`)
- **Models:** Random Forest (200 trees, `min_samples_leaf=2`), SVM with RBF kernel (`C=10`, `gamma='scale'`)
- **Preprocessing:** `StandardScaler` inside an `sklearn` Pipeline (critical for SVM)
- **Evaluation:** Stratified 5-fold cross-validation
- **Out-of-fold predictions** used for confusion matrices and ROC curves to avoid data leakage

---

## Results

### Cross-validated performance (5-fold)

| Model | Accuracy | F1 Score | ROC-AUC |
|---|---|---|---|
| **Random Forest** | **0.686 ± 0.042** | **0.700 ± 0.053** | **0.754 ± 0.048** |
| SVM (RBF) | 0.654 ± 0.062 | 0.651 ± 0.039 | 0.683 ± 0.085 |

Random Forest outperforms SVM across all three metrics. The AUC of 0.75 indicates moderate but meaningful separability which is well above chance (0.5), but lower than the ~85–95% accuracy figures sometimes reported in the literature. Those higher numbers typically rely on segmenting recordings into thousands of short windows (which inflates sample count and risks within-subject leakage); the evaluation here is subject-level, which is the honest and clinically meaningful benchmark.

### Most important features (Random Forest)

The top 20 features were dominated by:
- **Signal variance over parietal/temporal regions** - `Var_P7`, `Var_P3`, `Var_T7`, `Var_Pz`, `Var_F7`, `Var_O2`, `Var_Fz` - the strongest single signal in the data
- **Theta/Beta Ratio at the parietal midline** (`TBR_Pz`) - ranked #3, supporting the clinical biomarker hypothesis at a posterior site rather than the more commonly studied frontal-central one
- **Alpha activity over central midline** (`Alpha_Cz`) - ranked #4
- **Beta band activity** across central and frontal regions (`Beta_Cz`, `Beta_F4`, `Beta_C3`, `Beta_Fp2`)

The takeaway: ADHD-related EEG differences in this dataset are **distributed across signal-variability and spectral features**, not localized to one band or biomarker. Models built around a single feature (such as raw theta/beta ratio) under-perform multi-feature models, which is consistent with the literature.

### Theta/Beta ratio: the conventional biomarker

The mean TBR (averaged across all channels) was actually **higher in the Control group (2.99)** than in ADHD (2.54) in this dataset. This is opposite to the classical "elevated TBR in ADHD" finding, but it is consistent with several recent studies questioning TBR as a standalone diagnostic. TBR still contributed predictive value when used per-channel (especially at Pz), but it is not a clean separator on its own. This motivated the multi-feature approach used here.

---

## Project Structure

​```
adhd-eeg-classification/
├── data/
│   └── adhdata.csv                 # Download from Kaggle (not committed)
├── notebooks/
│   ├── 01_eda.ipynb                # Exploratory data analysis
│   ├── 02_feature_extraction.ipynb # Feature engineering (produces features.csv)
│   ├── 03_classification.ipynb     # Model training and evaluation
│   └── 04_xai.ipynb                # SHAP explainability and site data export
├── website/                        # React research showcase site
├── requirements.txt
└── README.md
​```

---

## How to Reproduce

1. **Clone the repository**
   ```bash
   git clone https://github.com/evasafi/adhd-eeg-classification.git
   cd adhd-eeg-classification
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Download the dataset** from [Kaggle](https://www.kaggle.com/datasets/danizo/eeg-dataset-for-adhd) and place `adhdata.csv` in `data/`

4. **Update the file path** at the top of each notebook to point to your local `data/adhdata.csv`

5. **Run the notebooks in order:**
   - `01_eda.ipynb` — exploratory analysis (~3 minutes)
   - `02_feature_extraction.ipynb` — produces `features.csv` (~3 minutes)
   - `03_classification.ipynb` — model training and evaluation (~1 minute)
6. **Run `04_xai.ipynb`** — computes SHAP values, generates topographic maps, exports `site_data.json` for the website
---

## Limitations

- **Sample size.** N=121 subjects is modest for deep learning; results may not generalize.
- **No artifact removal.** Eye blinks, muscle artifacts, and electrode drift were not removed. A production pipeline would use ICA or autoreject.
- **Single dataset.** Generalization to other recording setups, age ranges, or clinical populations is untested.
- **Subject-level features only.** Time-windowed or connectivity-based features could potentially improve performance.
- **Not for clinical use.** This is a research/educational project, not a diagnostic tool.

---

## References

- Nasrabadi, A. M. et al. (2020). *EEG data for ADHD / Control children.* IEEE DataPort.
- Snyder, S. M. et al. (2015). *Integration of an EEG biomarker with a clinician's ADHD evaluation.* Brain and Behavior.
- Multiple papers on this dataset are tracked at [PapersWithCode](https://paperswithcode.com/dataset/eeg-data-for-adhd-control-children).

---

## License

MIT
