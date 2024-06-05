# Welcome to the Frontend Tech Test

## Project Overview

Build a simple yet functional web application that allows users to view and search through a list of video contributions. The application should demonstrate your ability to create a responsive, user-friendly interface and integrate with a backend service.

## Setup

This repository includes:

- This README file for instructions
- A very simple Python server which you can spin up locally. Please read the servers [README](./server/README.md) file for installation and running instructions. This server provides an API endpoint which you can use within this test to retrieve `Contributions`

If you have any issues with running the local server then please reach out.

## Instructions

Create a `ui` folder; this is where your implementation belongs.

Within the `ui` folder set up the project with your chosen frontend JS/TS framework (React.js, Vue.js or other).

Build a homepage that should show a list of contributions, retrieved from the provided backend API.

- For each contribution show its:
  - Title
  - Description
  - Start time; displaying the time in the users locale
  - End time; displaying the time in the users locale
  - Owner (the producer of the contribution)
  - Status; is the contribution `Complete` (in the past), `Active` (currently being aired) or `Scheduled` (in the future)
- Shows 14 contributions at once
- The contributions list should show with:
  - 3 contributions per row on desktop
  - 2 contributions per row on tablet
  - 1 contributions per row on mobile
- Have a working search bar at the top, that filters contributions by title
- Add pagination

Include a README file with instructions on how to run the project and any other relevant information.

A design file has not been provided. We expect the UI to be clean, intuitive and easy to read, but we do not expect you to be a designer so do not worry about flare. If you have a keen eye and enjoy the design aspect then the world is your oyster.

Feel free to modify the contributions data e.g. start and end times. Or add entries.

### Bonus

- Upgrade the search functionality so that you can filter by more than just title.
- Persist searches and pagination within the URL
- Add any extra features that showcase your skills

## Submission

Email back to the email address that provided this task with either:

- A link to a public repository where you have pushed your code
- A zipped folder containing this repository

Please keep the provided Server folder within your submission

## Evaluation Criteria

- Code Quality: Clean and well-organized.
- Functionality: The application meets all the specified requirements.
- User Interface: Usability of the user interface.
- Performance: Efficient handling of data and UI updates.
- Best Practices: Use of modern development best practices and tools (e.g., linting, testing).
