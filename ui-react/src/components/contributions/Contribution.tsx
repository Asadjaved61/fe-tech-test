import React from "react";
import {
  ContributionI,
  Status,
} from "../../interfaces/contributions.interface";

const Contribution = React.memo(
  ({ contribution }: { contribution: ContributionI }) => {
    return (
      <div className='card h-100'>
        <div className='card-body'>
          <h5 className='card-title text-primary'>{contribution.title}</h5>
          <p className='card-text'>{contribution.description}</p>
          <p className='card-text'>
            <strong>Start time: </strong>
            {contribution.startTime}
          </p>
          <p className='card-text'>
            <strong>End time: </strong>
            {contribution.endTime}
          </p>
          <p className='card-text'>
            <strong>Owner: </strong>
            {contribution.owner}
          </p>
        </div>
        <div className='card-footer'>
          <small
            className={`badge ${
              contribution.status === Status.Scheduled
                ? "bg-warning"
                : contribution.status === Status.Active
                ? "bg-success"
                : "bg-primary"
            }`}
          >
            {contribution.status}
          </small>
        </div>
      </div>
    );
  }
);

export default Contribution;
