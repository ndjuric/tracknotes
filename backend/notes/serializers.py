from notes.models import Note, RegularNote, LinkNote, ImageNote
from rest_framework import serializers


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


class RegularNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularNote
        fields = '__all__'


class LinkNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkNote
        fields = '__all__'


class ImageNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageNote
        fields = '__all__'
