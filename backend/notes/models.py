import datetime
from django.db import models


class Note(models.Model):
    NOTE_TYPES = (('regular', 'Regular'), ('image', 'Image'), ('url', 'URL'))
    type = models.CharField(max_length=1, choices=NOTE_TYPES, default='regular', editable=False)
    trash = models.BooleanField(null=False, default=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    updated = models.DateTimeField(editable=False)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if not self.id:
            self.created = datetime.date.today()
        self.updated = datetime.datetime.today()
        super(Note, self).save(force_insert, force_update, using, update_fields)


class RegularNote(Note):
    WHITE = '#ffffff'
    RED = '#ffc5c0'
    BLUE = '#b7e9ff'
    GREY = '#cfd8dc'
    COLOR_CHOICES = ((WHITE, 'White'), (RED, 'Red'), (BLUE, 'Blue'), (GREY, 'Grey'))
    title = models.CharField(max_length=128)
    text = models.TextField()
    color = models.CharField(max_length=7, choices=COLOR_CHOICES, default=WHITE, null=True)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if not self.color:
            self.color = "#000000"
        self.type = 'regular'
        super(RegularNote, self).save(force_insert, force_update, using, update_fields)


class LinkNote(Note):
    url = models.TextField()

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.type = 'url'
        super(LinkNote, self).save(force_insert, force_update, using, update_fields)


class ImageNote(Note):
    url = models.TextField()
    stored_path = models.TextField(default='/', null=True, editable=False)
    
    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.type = 'image'
        super(ImageNote, self).save(force_insert, force_update, using, update_fields)
