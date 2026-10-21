import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Command, FolderKanban, Search, UserRound } from 'lucide-react';
import { appConfig } from '../../config/app.config';
import { content } from '../../config/content';
import { dashboardService } from '../../services/workspace.service';
import type { SearchResult } from '../../types';
import styles from './Topbar.module.css';

const resultIcons = {
  project: FolderKanban,
  member: UserRound,
};

export function SearchBox() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ term: string; items: SearchResult[] } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const term = query.trim();
  const canSearch = term.length >= appConfig.search.minLength;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === content.topbar.searchShortcutKey.toLowerCase()) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    if (!canSearch) {
      return;
    }
    let active = true;
    const timer = setTimeout(() => {
      dashboardService
        .search(term)
        .then((items) => {
          if (active) setResults({ term, items });
        })
        .catch(() => {
          if (active) setResults({ term, items: [] });
        });
    }, appConfig.search.debounceMs);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [term, canSearch]);

  const visibleResults = canSearch && results?.term === term ? results.items : null;

  const selectResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    navigate(result.href);
  };

  return (
    <div
      className={styles.search}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <label className={styles.searchField}>
        <Search className={styles.searchIcon} aria-hidden />
        <span className="visually-hidden">{content.topbar.searchLabel}</span>
        <input
          id="topbar-search"
          ref={inputRef}
          type="search"
          className={styles.searchInput}
          placeholder={content.topbar.searchPlaceholder}
          value={query}
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Escape' && inputRef.current?.blur()}
        />
        <kbd className={styles.kbd}>
          <Command className={styles.kbdIcon} aria-hidden />
          {content.topbar.searchShortcutKey}
        </kbd>
      </label>

      {isOpen && visibleResults && (
        <div className={styles.results} role="listbox" aria-label={content.topbar.searchLabel}>
          {visibleResults.length ? (
            visibleResults.map((result) => {
              const Icon = resultIcons[result.type];
              return (
                <button
                  key={result.id}
                  type="button"
                  role="option"
                  aria-selected={false}
                  className={styles.result}
                  onClick={() => selectResult(result)}
                >
                  <span className={styles.resultIcon}>
                    <Icon aria-hidden />
                  </span>
                  <span className={styles.resultText}>
                    <span className={styles.resultTitle}>{result.title}</span>
                    <span className={styles.resultSubtitle}>{result.subtitle}</span>
                  </span>
                </button>
              );
            })
          ) : (
            <p className={styles.empty}>{content.topbar.searchEmpty}</p>
          )}
        </div>
      )}
    </div>
  );
}
