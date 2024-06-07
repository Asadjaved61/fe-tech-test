import React from "react";
import { ContributionI } from "../../interfaces/contributions.interface";
import Contribution from "./Contribution";

const ContributionsList = ({
  contributions,
}: {
  contributions: ContributionI[];
}) => {
  return (
    <div className='row contributions-list g-3 mt-2'>
      {contributions.map((contribution) => (
        <div key={contribution.id} className='col-md-4 col-sm-6'>
          <Contribution contribution={contribution} />
        </div>
      ))}
    </div>
  );
};

export default ContributionsList;
