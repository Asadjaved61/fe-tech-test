import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination, Row } from "react-bootstrap";
import moment from "moment";
import {
  ContributionI,
  Status,
} from "../../interfaces/contributions.interface";
import ContributionsList from "./ContributionsList";
import { mediaOwners } from "../../data/media-owners";
import "./Contributions.css";

// *** CONSTANTS  ***
const API_ENDPOINT = "http://127.0.0.1:8000/contributions/";
const contributionsPerPage = 14;

// This component is responsible for fetching and displaying contributions
const Contributions = () => {
  const [contributions, setContributions] = useState<ContributionI[] | null>(
    null
  );
  const [filteredContributions, setFilteredContributions] = useState<
    ContributionI[] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [totalContributions, setTotalContributions] = useState(50);
  const totalPages = Math.ceil(totalContributions / contributionsPerPage);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = Number(queryParams.get("page")) ?? 1;
  const mediaOwner = queryParams.get("owner") ?? "";

  useEffect(() => {
    setCurrentPage(page);
    console.log(mediaOwner);
    setSelectedOwner(mediaOwner);
    const newSkipValue = (page - 1) * contributionsPerPage;
    getContributions(newSkipValue, mediaOwner);
  }, []);

  const getContributions = async (skipNumber: Number, owner?: string) => {
    let url = `${API_ENDPOINT}?skip=${skipNumber}&limit=${contributionsPerPage}`;
    if (owner) {
      url += `&owner=${owner}`;
    }
    // Fetch contributions from the API with pagination
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          // Throw an error if the response is not OK
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Format the dates and set the contributions state
        const contributionsWithFormattedDates = data?.contributions.map(
          (contribution: ContributionI) => ({
            ...contribution,
            status: getStatus(contribution.startTime, contribution.endTime),
            startTime: new Date(contribution.startTime).toLocaleTimeString(),
            endTime: new Date(contribution.endTime).toLocaleTimeString(),
          })
        );
        setContributions(contributionsWithFormattedDates);
        setTotalContributions(data?.total);

        setFilteredContributions(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const FilterByOwner = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const mediaOwner = event.target.value;
    if (mediaOwner === "") {
      return contributions;
    }
    // Create a URLSearchParams object
    let params = new URLSearchParams();
    // Append the selected owner to the parameters
    params.append("owner", mediaOwner);

    // Navigate to the new URL with the appended parameter
    navigate(`/contributions/?page=${currentPage}&${params.toString()}`);
    getContributions(0, mediaOwner);
    // Filter contributions by the selected owner
    /*const filteredContributions =
      contributions &&
      contributions.filter((contribution) => contribution.owner === mediaOwner);*/
    setFilteredContributions(filteredContributions);
    setSelectedOwner(mediaOwner);
  };

  const getStatus = useCallback(
    (startTime: string, endTime: string): string => {
      const now = moment();
      const start = moment(startTime);
      const end = moment(endTime);

      if (now.isBefore(start)) {
        return Status.Scheduled;
      } else if (now.isAfter(end)) {
        return Status.Complete;
      } else {
        return Status.Active;
      }
    },
    []
  );

  const handlePageChange = (pageNumber: number) => {
    // Calculate the new skip value based on the page number and the number of contributions per page
    const newSkipValue = (pageNumber - 1) * contributionsPerPage;

    navigate(`/contributions/?page=${pageNumber}`);

    // Make the API call with the new skip value
    getContributions(newSkipValue);

    // Update the current page
    setCurrentPage(pageNumber);
    setSearchValue("");
  };

  const onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Filter contributions by search term
    const filteredContributions =
      contributions &&
      contributions.filter((contribution) =>
        contribution.title
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );

    setFilteredContributions(filteredContributions);
    setSearchValue(event.target.value);
  };

  return (
    <div className='container mt-5'>
      <div className='input-group'>
        <input
          type='search'
          className='form-control rounded'
          value={searchValue}
          placeholder='Search'
          aria-label='Search'
          aria-describedby='search-title'
          onChange={onSearchTermChange}
        />
        <div>
          <select
            value={selectedOwner}
            className='form-select'
            aria-label='filter by media owner'
            onChange={FilterByOwner}
          >
            <option value='' disabled>
              Filter By Media Owner
            </option>
            {mediaOwners.map((owner) => (
              <option
                key={owner}
                value={owner}
                selected={owner === selectedOwner}
                className={owner === selectedOwner ? "active" : ""}
              >
                {owner}
              </option>
            ))}
          </select>
        </div>
      </div>
      {contributions !== null && (
        <ContributionsList
          contributions={
            filteredContributions ? filteredContributions : contributions
          }
        />
      )}
      <Row className='mt-3'>
        <Pagination className='d-flex justify-content-center align-items-center'>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Row>
    </div>
  );
};

export default Contributions;
