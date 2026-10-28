from django.db import models

class Venue(models.Model):
    name = models.CharField(max_length=100)
    vibe = models.CharField(max_length=200)
    default_wait_mins = models.IntegerField(default=10)

class CheckInReport(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="checkins")
    wait_mins = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
