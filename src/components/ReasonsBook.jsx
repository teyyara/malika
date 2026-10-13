import React, { useState } from "react";
import { reasonsBook } from "../data/reasonsBook.js";

export default function ReasonsBook() {
  const [page, setPage] = useState(0);
  const lastPage = reasonsBook.length - 1;
  const progress = ((page + 1) / reasonsBook.length) * 100;

  return (
    <section className="reasons-book" aria-labelledby="reasons-book-heading">
      <details className="reasons-book-disclosure">
        <summary>
          <span className="reasons-book-seal" aria-hidden="true">♡</span>
          <span className="reasons-book-summary-copy">
            <span className="reasons-book-eyebrow">A LITTLE BOOK, WITH A LOT OF HEART</span>
            <strong id="reasons-book-heading">A Hundred Little Reasons I Love You</strong>
            <small>One page at a time. No need to read them all in one sitting.</small>
          </span>
          <span className="reasons-book-summary-action">Open the little book <span aria-hidden="true">⌄</span></span>
        </summary>
        <div className="reasons-book-content">
          <p className="reasons-book-intro">A hundred small reminders from Zack to Malika. Not a checklist, not a test—just little pages to return to whenever your heart needs a softer word.</p>
          <div className="reasons-book-page" aria-label={"Reason " + (page + 1) + " of " + reasonsBook.length}>
            <div className="reasons-book-page-top">
              <span className="reasons-book-page-label">A REASON TO KEEP CLOSE</span>
              <span className="reasons-book-page-count">{String(page + 1).padStart(2, "0")} <span> / {String(reasonsBook.length).padStart(2, "0")}</span></span>
            </div>
            <div className="reasons-book-ornament" aria-hidden="true">✦ <span>♡</span> ✧</div>
            <p className="reasons-book-number" aria-hidden="true">{String(page + 1).padStart(2, "0")}</p>
            <p className="reasons-book-reason" aria-live="polite" key={page}>{reasonsBook[page]}</p>
            <div className="reasons-book-progress" role="progressbar" aria-label="Pages read in the little book" aria-valuemin={1} aria-valuemax={reasonsBook.length} aria-valuenow={page + 1} aria-valuetext={"Reason " + (page + 1) + " of " + reasonsBook.length}>
              <span style={{ width: progress + "%" }} />
            </div>
            <div className="reasons-book-controls">
              <button type="button" className="reasons-book-prev" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
                <span aria-hidden="true">←</span> Previous page
              </button>
              {page === lastPage ? (
                <button type="button" className="reasons-book-next" onClick={() => setPage(0)}>
                  Begin again <span aria-hidden="true">↺</span>
                </button>
              ) : (
                <button type="button" className="reasons-book-next" onClick={() => setPage((current) => Math.min(lastPage, current + 1))}>
                  Next little reason <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
            <p className="reasons-book-note" aria-live="polite">{page === lastPage ? "That was the last page for now. The little book can always begin again." : "Take your time. There is no prize for reaching the end quickly."}</p>
          </div>
          <p className="reasons-book-footer">Made with love, one page at a time. <span aria-hidden="true">♡</span></p>
        </div>
      </details>
    </section>
  );
}
