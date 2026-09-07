import { ChartDonut, CheckCircle, Circle, Star } from "@phosphor-icons/react";
import { COVERAGE_ITEMS } from "../../data/writingScenario.js";

const CRITERIA = ["Evidence-aware", "Worth differentiating", "Operational depth"];

export function CoveragePanel({ items = COVERAGE_ITEMS }) {
  const coveredCount = items.filter((item) => item.covered).length;

  return (
    <section aria-labelledby="coverage-title" className="coverage-panel">
      <div className="coverage-score">
        <ChartDonut aria-hidden="true" size={34} weight="duotone" />
        <div>
          <h2 id="coverage-title">Coverage</h2>
          <p>{coveredCount} of {items.length} core topics</p>
        </div>
      </div>

      <ul className="coverage-list">
        {items.map((item) => {
          const Icon = item.covered ? CheckCircle : Circle;
          return (
            <li data-state={item.covered ? "covered" : "uncovered"} key={item.label}>
              <Icon aria-hidden="true" size={18} weight={item.covered ? "fill" : "regular"} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>

      <ul aria-label="Review criteria" className="coverage-criterion">
        {CRITERIA.map((criterion) => (
          <li key={criterion}>
            <Star aria-hidden="true" size={16} weight="fill" />
            {criterion}
          </li>
        ))}
      </ul>
    </section>
  );
}
