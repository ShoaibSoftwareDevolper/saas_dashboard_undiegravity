import styles from './LoginPage.module.css';

const WAVE_PATHS = [
  'M-40,520 C120,430 240,620 400,520 S620,420 680,480',
  'M-40,580 C120,490 240,680 400,580 S620,480 680,540',
  'M-40,640 C120,550 240,740 400,640 S620,540 680,600',
  'M-40,700 C120,610 240,800 400,700 S620,600 680,660',
];

const RIBBON_PATHS = [
  'M-20,120 C140,60 260,200 420,140 S600,60 660,100',
  'M-20,170 C140,110 260,250 420,190 S600,110 660,150',
];

export function HeroBackdrop() {
  return (
    <svg
      className={styles.backdrop}
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.layerSlow}>
        {RIBBON_PATHS.map((path) => (
          <path key={path} d={path} className={styles.ribbon} />
        ))}
      </g>
      <g className={styles.layerFast}>
        {WAVE_PATHS.map((path) => (
          <path key={path} d={path} className={styles.wavePath} />
        ))}
        <path d="M0,800 L0,690 C140,620 260,760 400,690 S580,640 600,660 L600,800 Z" className={styles.swell} />
      </g>
    </svg>
  );
}
