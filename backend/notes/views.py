from notes.models import Note, RegularNote, LinkNote, ImageNote
from notes.serializers import NoteSerializer, RegularNoteSerializer, LinkNoteSerializer, ImageNoteSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from django.template import loader
from django.http import HttpResponse


def index(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render({}, request))


def getAll(trash=False):
    regular_notes = RegularNote.objects.filter(trash=trash)
    regular_note_serializer = RegularNoteSerializer(regular_notes, many=True).data
    url_notes = LinkNote.objects.filter(trash=trash)
    url_note_serializer = LinkNoteSerializer(url_notes, many=True).data
    image_notes = ImageNote.objects.filter(trash=trash)
    image_note_serializer = ImageNoteSerializer(image_notes, many=True).data

    return sorted(
        regular_note_serializer + url_note_serializer + image_note_serializer,
        key=lambda x: x.get('created')
    )


class NoteList(APIView):
    def get(self, request, format=None):
        chained_list = getAll(trash=False)
        return Response(chained_list)


class TrashList(APIView):
    def get(self, request, format=None):
        chained_list = getAll(trash=True)
        return Response(chained_list)


class RegularNoteList(generics.ListCreateAPIView):
    queryset = RegularNote.objects.filter(trash=False)
    serializer_class = RegularNoteSerializer


class LinkNoteList(generics.ListCreateAPIView):
    queryset = LinkNote.objects.filter(trash=False)
    serializer_class = LinkNoteSerializer


class ImageNoteList(generics.ListCreateAPIView):
    queryset = ImageNote.objects.filter(trash=False)
    serializer_class = ImageNoteSerializer


class NoteDetail(APIView):
    def __init__(self):
        super(NoteDetail, self).__init__()
        self.model_serializer_map = {
            'regular': {'model': RegularNote, 'serializer': RegularNoteSerializer},
            'url': {'model': LinkNote, 'serializer': LinkNoteSerializer},
            'image': {'model': ImageNote, 'serializer': ImageNoteSerializer}
        }

    def get_note_type(self, **kwargs):
        if 'pk' not in kwargs:
            return None

        note_type = Note.objects.get(**kwargs).type
        if note_type not in self.model_serializer_map:
            return None

        return note_type

    def get_model(self, note_type, **kwargs):
        try:
            return self.model_serializer_map[note_type]['model'].objects.get(**kwargs)
        except (AttributeError, ObjectDoesNotExist):
            return None

    def get_serializer(self, **kwargs):
        note_type = self.get_note_type(**kwargs)
        if not note_type:
            return None

        exact_model = self.get_model(note_type, **kwargs)
        if not exact_model:
            return None

        try:
            return self.model_serializer_map[note_type]['serializer']([exact_model], many=True).data
        except (AttributeError, ObjectDoesNotExist):
            return None

    def get_object(self, **kwargs):
        note_type = self.get_note_type(**kwargs)
        if not note_type:
            return None

        model = self.get_model(note_type, **kwargs)
        if not model:
            return None

        return model

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(**kwargs)
        if not serializer:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer)

    def delete(self, request, *args, **kwargs):
        obj = self.get_object(**kwargs)
        if not obj:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegularNoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RegularNote.objects.all()
    serializer_class = RegularNoteSerializer


class LinkNoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = LinkNote.objects.all()
    serializer_class = LinkNoteSerializer


class ImageNoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ImageNote.objects.all()
    serializer_class = ImageNoteSerializer
