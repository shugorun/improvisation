export function Explainer() {
  return (
    <details className="explainer">
      <summary>How does it read my mind?</summary>
      <div className="explainer-body">
        <p>
          It doesn&apos;t — it just bets that you can&apos;t be random. Every time you press a key,
          the Oracle records the few moves that came before it. To predict your next move, it finds
          every past moment where you were in the same short situation and guesses whatever you did
          most often back then.
        </p>
        <p>
          People are terrible random generators. We avoid repeating ourselves, we over-alternate,
          and we fall into little rhythms. A handful of counters is enough to exploit that — usually
          predicting around 60–70% of &ldquo;random&rdquo; presses, well above the 50% you&apos;d
          get from a coin.
        </p>
        <p>
          This is a classic demonstration: the <strong>Aaronson Oracle</strong>, echoing Claude
          Shannon&apos;s 1953 &ldquo;mind-reading machine.&rdquo; If you want to beat it, you have
          to stop deciding and start using a real source of randomness — which is exactly the point.
        </p>
      </div>
    </details>
  )
}
