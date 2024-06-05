import json
import re
from contextlib import asynccontextmanager
from enum import Enum
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Query

# SIMPLE store of data for this exercise
DATA = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    with open('seed_data/contributions.json') as f:
        DATA['contribution_data'] = json.load(f)['contributions']
    yield
    DATA.clear()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",  # Replace with the actual origin of your frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Arqiva Tech Test 1 -  Good Luck!"}


class ContributionOrder(str, Enum):
    id = "id"
    title = "title"
    description = "description"
    startTime = "startTime"
    endTime = "endTime"
    owner = "owner"


class MatchType(str, Enum):
    any = "any"
    all = "all"


class ContributionFilter(str, Enum):
    id: Optional[str]  # equals
    title: Optional[str]  # contains
    description: Optional[str]  # contains
    startBefore: Optional[str]
    startAfter: Optional[str]
    endBefore: Optional[str]
    endAfter: Optional[str]
    owner: Optional[str]  # equals
    match: Optional[MatchType]


def _ids(l: list):
    return [i['id'] for i in l]


@app.get("/contributions/")
async def list_contributions(skip: int = 0, limit: int = 30,
                             order_by: ContributionOrder = Query(default=ContributionOrder.id),
                             id: Optional[List[str]] = Query(None),
                             owner: Optional[str] = Query(None),
                             title: Optional[str] = Query(None),
                             description: Optional[str] = Query(None),
                             startBefore: Optional[str] = Query(None),
                             startAfter: Optional[str] = Query(None),
                             endBefore: Optional[str] = Query(None),
                             endAfter: Optional[str] = Query(None),
                             match: MatchType = Query(default=MatchType.all)
                             ):
    contributions: list = DATA['contribution_data']

    all_ids = [] if match == MatchType.any else _ids(contributions)
    matching_ids = all_ids
    matching_title = all_ids
    matching_description = all_ids
    matching_owner = all_ids
    matching_start_before = all_ids
    matching_start_after = all_ids
    matching_end_before = all_ids
    matching_end_after = all_ids

    if id:
        matching_ids = _ids(list(filter(lambda c: c['id'] in [int(i) for i in id], contributions)))
        print("IDs :", matching_ids)

    if title:
        matching_title = _ids(list(filter(lambda c: re.search(title, c['title'], re.IGNORECASE), contributions)))
        print("Title :", matching_title)

    if description:
        matching_description = _ids(
            list(filter(lambda c: re.search(description, c['description'], re.IGNORECASE), contributions)))
        print("Desc :", matching_description)

    if owner:
        matching_owner = _ids(list(filter(lambda c: re.search(owner, c['owner'], re.IGNORECASE), contributions)))
        print("Desc :", matching_owner)

    if startBefore:
        matching_start_before = _ids(list(filter(lambda c: c['startTime'] < startBefore, contributions)))
        print("StartBefore :", matching_start_before)

    if startAfter:
        matching_start_after = _ids(list(filter(lambda c: c['startTime'] > startAfter, contributions)))
        print("StartAfter :", matching_start_after)

    if endBefore:
        matching_end_before = _ids(list(filter(lambda c: c['endTime'] < endBefore, contributions)))
        print("EndBefore :", matching_end_before)

    if endAfter:
        matching_end_after = _ids(list(filter(lambda c: c['endTime'] > endAfter, contributions)))
        print("EndAfter :", matching_end_after)

    matching_contribution_ids = []
    if match == MatchType.any:
        matching_contribution_ids = set(
            matching_contribution_ids + matching_ids + matching_title + matching_description + matching_start_before +
            matching_start_after + matching_end_before + matching_end_after + matching_owner)
    else:  # all
        matching_contribution_ids = list(
            set(matching_ids) & set(matching_title) & set(matching_description) & set(matching_start_before) & set(
                matching_start_after) & set(matching_end_before) & set(matching_end_after) & set(matching_owner))

    matching_contributions = [c for c in contributions if c['id'] in matching_contribution_ids]

    if order_by:
        matching_contributions = sorted(matching_contributions, key=lambda contribution: contribution[order_by])

    paginated_contributions = matching_contributions[skip:skip + limit]

    return {
        "contributions": paginated_contributions,
        "total": len(matching_contributions),
        "skip": skip,
        "limit": limit
    }

