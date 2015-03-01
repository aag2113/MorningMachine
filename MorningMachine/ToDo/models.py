import datetime

from django.db import models
from django.utils import timezone

class TaskList(models.Model):
    title = models.CharField(max_length=200)
    left = models.IntegerField(default=0)
    top = models.IntegerField(default=0)
    width = models.IntegerField(default=200)
    height = models.IntegerField(default=150)

    def __unicode__(self):
        return self.title


class Task(models.Model):
    taskList = models.ForeignKey(TaskList)
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField('Date Created', default=datetime.datetime.now)
    status = models.IntegerField(default=0)

    def __unicode__(self):
        return self.title

    