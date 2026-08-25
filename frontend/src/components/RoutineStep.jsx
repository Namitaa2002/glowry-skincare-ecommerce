import { Link } from "react-router-dom";

function RoutineStep({
  number,
  step,
  name,
  description,
  category,
  side,
}) {
  return (
    <Link
      to={`/category/${category}`}
      className={`routine-step routine-${side}`}
    >

      <div className="routine-step-number">
        {number}
      </div>

      <div className="routine-step-content">

        <span className="routine-step-label">
          {step}
        </span>

        <h3>
          {name}
        </h3>

        <p>
          {description}
        </p>

        <span className="routine-explore">
          Explore →
        </span>

      </div>

      <div className="routine-dot"></div>

    </Link>
  );
}

export default RoutineStep;