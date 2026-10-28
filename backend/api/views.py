from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import Venue, CheckInReport
from api.calculator import WaitTimeCalculator

INITIAL_VENUES = [
    {"name": "Jack & Dan's", "default_wait_mins": 5, "vibe": "a couple groups waiting to get in"},
    {"name": "Globe", "default_wait_mins": 5, "vibe": "a couple groups waiting to get in"},
    {"name": "Borracho's", "default_wait_mins": 5, "vibe": "a couple groups waiting to get in"},
    {"name": "Logan Tavern", "default_wait_mins": 5, "vibe": "a couple groups waiting to get in"},
    {"name": "Star", "default_wait_mins": 5, "vibe": "a couple groups waiting to get in"},
    {"name": "The Viking", "default_wait_mins": 5, "vibe": "a couple groups waiting to get in"},
]

@api_view(["GET"])
def get_venues(request):

    if Venue.objects.count() == 0: # adds bars if table is empty
        for item in INITIAL_VENUES:
            Venue.objects.create(**item)
        
    calc = WaitTimeCalculator()
    data = []

    for v in Venue.objects.all().order_by("id"):
        # Get reported wait times from db
        reports = [c.wait_mins for c in v.checkins.all()]
        live_wait = calc.calculate_wait(reports, default_wait=v.default_wait_mins)
        data.append({
            "id": v.id,
            "name": v.name,
            "waitMins": live_wait,
            "vibe": v.vibe,
        })
    
    return Response(data)


@api_view(["POST"])
def create_checkin(request):
    venue_id = request.data.get("venue_id")
    wait_mins = int(request.data.get("wait_mins", 0))

    CheckInReport.objects.create(venue_id=venue_id, wait_mins=wait_mins)
    venue = Venue.objects.get(id=venue_id)
    reports = [c.wait_mins for c in venue.checkins.all()]
    new_wait = WaitTimeCalculator().calculate_wait(reports, default_wait=venue.default_wait_mins)

    return Response({"id": venue.id, "waitMins": new_wait})
