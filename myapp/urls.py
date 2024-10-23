from django.urls import path
from . import views
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path('api/navbar/', NavbarAPIView.as_view(), name='navbar-api'),
    path('api/category/', CategoryAPIView.as_view(), name='category-api'),
    path('api/news/', NewsListCreateView.as_view(), name='news-list-create'),
    path('api/topnews/', TopNewsList.as_view(), name='top-news-list'),
    path('news/<int:id>/', views.news_detail_view, name='news_detail'),
    path('topnews/<int:id>/', topnews_detail_view, name='topnews-detail-view'),
    path('submit-feedback/', feedback_view, name='feedback'),
    path("contact/", views.contact, name="contact"),
    path('trending-news/', trending_news_page, name='trending_news_page'),
    path('top-stories/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html',category_name="Top Stories")),
    path('epaper-daily/', epaper_view, name='epaper_view'),
    path('lokhit-movement/', lokhitmovement_view, name='lokhitmovement_view'),
    path('subscribe/', subscribe, name='subscribe'),
    path('search/', views.search_news, name='search_news'),
    path('about-us/', views.about, name='about'),
    path('hate-crime/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Hate Crime")),
    path('injustice/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Injustice")),
    path('religion/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Religion")),
    path('downtrodden/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Downtrodden")),
    path('sports/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Sports")),
    path('politics/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Politics")),
    path('education/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Education")),
    path('environment/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Environment")),
    path('economy/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Economy")),
    path('national/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="National")),
    path('international/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="International")),
    path('motivation/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Motivation")),
    path('muslim-freedom-fighters/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Muslim Freedom Fighters")),
    path('harmony/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Harmony")),
    path('hatred/', lambda request: dynamic_page_view(request, 'categorys-dynamic-page.html', category_name="Hatred")),
    path('donation/', donation, name='donation'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
