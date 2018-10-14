from notes import views
from django.conf.urls import url
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/notes/all/$', views.NoteList.as_view()),
    url(r'^api/notes/trash/$', views.TrashList.as_view()),
    url(r'^api/notes/id/(?P<pk>[0-9]+)/$', views.NoteDetail.as_view()),

    url(r'^api/notes/regular/$', views.RegularNoteList.as_view()),
    url(r'^api/notes/url/$', views.LinkNoteList.as_view()),
    url(r'^api/notes/image/$', views.ImageNoteList.as_view()),

    url(r'^api/notes/regular/id/(?P<pk>[0-9]+)/$', views.RegularNoteDetail.as_view()),
    url(r'^api/notes/url/id/(?P<pk>[0-9]+)/$', views.LinkNoteDetail.as_view()),
    url(r'^api/notes/image/id/(?P<pk>[0-9]+)/$', views.ImageNoteDetail.as_view()),
    url(r'^(?:.*)/?$', views.index, name='index'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
