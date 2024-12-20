from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.db import IntegrityError
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.db.models import Q
from .models import *
from .serializers import *
import json
import calendar
from datetime import datetime
import re
# Create your views here.

def custom_404_view(request, exception):
    logo = SiteLogo.objects.all()
    return render(request, 'error-404.html', {'logo': logo}, status=404)

def index(request):
    logo = SiteLogo.objects.all()
    epaper = EpaperDaily.objects.all()
    categories = Category.objects.all()
    news_queryset = New.objects.all()  # Assuming you have a News model
    paginator = Paginator(news_queryset, 10)  # Show 10 news items per page
    page_number = request.GET.get('page', 1)  # Default to page 1
    news_list = paginator.get_page(page_number)

    # Check if the request is an AJAX request
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        news_data = [
            {
                "id": news.id,
                "category": news.category.name,
                "category_url": news.category.category_url,
                "category_color": news.category.color,
                "date": news.date.strftime("%Y-%m-%d"),
                "title": news.title,
                "author": news.author,
                "description": news.description,
                "image": news.image.url,
                "is_trending": news.is_trending,
            }
            for news in news_list
        ]
        return JsonResponse({
            "news": news_data,
            "has_next": news_list.has_next(),
        })

    return render(request, 'index.html', {'logo': logo, 'news_list': news_list, 'categories': categories,'epaper': epaper})

def news_list(request):
    news_queryset = New.objects.all()  # Assuming you have a News model
    paginator = Paginator(news_queryset, 10)  # Show 10 news items per page
    page_number = request.GET.get('page')
    news_list = paginator.get_page(page_number)
    
    return render(request, 'index.html', {'news_list': news_list})

class NavbarAPIView(APIView):
    def get(self, request):
        links = NavbarLink.objects.all()
        serializer = NavbarLinkSerializer(links, many=True)
        return Response(serializer.data)

class CategoryAPIView(APIView):
    def get(self, request):
        category = Category.objects.all()
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data)

class NewsListCreateView(generics.ListCreateAPIView):
    queryset = New.objects.all()
    serializer_class = NewsSerializer

class TrendingNewsAPIView(APIView):
    def get(self, request):
        trending_news = New.objects.filter(is_trending=True).order_by('-date')[:10]  # Limit to 10 latest trending news
        serializer = NewsSerializer(trending_news, many=True)
        return Response(serializer.data)

class TopNewsList(generics.ListCreateAPIView):
    queryset = TopNew.objects.all()
    serializer_class = TopNewSerializer

def news_view(request):
    news_list = New.objects.all()  # Fetch all news
    return render(request, 'index.html', {'news_list': news_list})

def news_detail_view(request, id):
    logo = SiteLogo.objects.all()
    categories = Category.objects.all()
    print(categories)
    news = get_object_or_404(New, id=id)
    related_news = New.objects.filter(category=news.category).exclude(id=news.id)[:4]  # Limiting to 4 related posts
    return render(request, 'news-details.html', {'news': news, 'logo': logo, 'categories': categories,'related_news':related_news})
    
def topnews_detail_view(request, id):
    logo = SiteLogo.objects.all()  # Fetch the first logo (assuming only one logo)
    categories = Category.objects.all()
    topnews = get_object_or_404(TopNew, id=id)  # Fetch the top news item by ID
    
    # Fetch related news based on the category of the news object in TopNew
    related_news = New.objects.filter(category=topnews.news.category).exclude(id=topnews.news.id)[:4]
    
    return render(request, 'news-details.html', {
        'news': topnews.news,  # Pass the related `New` object
        'logo': logo,
        'categories': categories,
        'related_news': related_news  # Related news articles
    })

def epaper_view(request):
    logo = SiteLogo.objects.all()
    epaper_queryset = EpaperDaily.objects.all()

    # Pagination
    items_per_page = 12  # Adjust the number of items per page if needed
    paginator = Paginator(epaper_queryset, items_per_page)
    page_number = request.GET.get('page', 1)  # Get current page number from request
    page_obj = paginator.get_page(page_number)

    return render(request, 'e-papers.html', {
        'logo': logo,
        'epaper': page_obj  # Pass the paginated object to the template
    })
    
def lokhitmovement_view(request):
    logo = SiteLogo.objects.all()
    lokhitmovement = Lokhitmovement.objects.all()
    
     # Pagination
    items_per_page = 12  # Adjust the number of items per page if needed
    paginator = Paginator(lokhitmovement, items_per_page)
    page_number = request.GET.get('page', 1)  # Get current page number from request
    page_obj = paginator.get_page(page_number)
    
    print("All lokhitmovement", lokhitmovement)
    return render(request, 'lokhit-movement.html', {'logo': logo, 'lokhitmovement': page_obj})

def feedback_view(request):
    if request.method == 'POST':
        # Print the POST data for debugging
        print("POST data:", request.POST)
        
        # Capture form data
        obj = Feedback()
        obj.name = request.POST.get('name')
        obj.email = request.POST.get('email')
        obj.mobile_number = request.POST.get('mobile_number')
        obj.comment_message = request.POST.get('comment_message')
        
        # Check if the data is being correctly fetched
        print("Name:", obj.name)
        print("Email:", obj.email)
        print("Mobile Number:", obj.mobile_number)
        print("Comment:", obj.comment_message)

        try:
            # Save to database
            obj.save()
            messages.success(request, 'Your feedback has been submitted successfully!')
        except IntegrityError:
            messages.error(request, 'This feedback is already subscribed.')
            
        return redirect(request.META.get('HTTP_REFERER', 'index'))  # Redirect back to the 
    
    return render(request, 'news-details.html')

def contact(request):
    logo = SiteLogo.objects.all()
    if request.method == 'POST':
        # Print the POST data for debugging
        print("POST data:", request.POST)
        
        # Capture form data
        obj = Contact()
        obj.name = request.POST.get('contact-name')
        obj.email = request.POST.get('contact-email')
        obj.phone = request.POST.get('contact-phone')
        obj.message = request.POST.get('contact-message')
        
        # Check if the data is being correctly fetched
        print("Name:", obj.name)
        print("Email:", obj.email)
        print("Mobile Number:", obj.phone)
        print("Comment:", obj.message)

        # Save to database
        obj.save()
        try:
            # Save to database
            obj.save()
            messages.success(request, 'Your message has been submitted successfully!')
        except IntegrityError:
            messages.error(request, 'This messages is already subscribed.')
            
        return redirect(request.META.get('HTTP_REFERER', 'index'))  # Redirect back to the referring page

    return render(request, 'contact.html', {'logo': logo}) 

def subscribe(request):
    if request.method == 'POST':
        email = request.POST.get('subscription-email')
        obj = Subscription(email=email)

        try:
            obj.save()
            messages.success(request, 'Your subscription has been submitted successfully!')
           
        except IntegrityError:
            messages.error(request, 'This email is already subscribed.')
           
        return redirect(request.META.get('HTTP_REFERER', 'index'))
    return render(request, 'index.html')

def trending_news_page(request):
    logo = SiteLogo.objects.all()
    epaper = EpaperDaily.objects.all()
    categories = Category.objects.all()
    news_queryset = New.objects.filter(is_trending=True)  # Fetch all trending news

    # Pagination
    items_per_page = 12  # Number of items per page
    paginator = Paginator(news_queryset, items_per_page)
    
    page_number = request.GET.get('page', 1)  # Default to first page if not provided
    page_obj = paginator.get_page(page_number)

    # Serialize the current page's news_queryset to JSON
    news_list_json = json.dumps([{
        "id": news.id,
        "category": news.category.name,
        "category_url": news.category.category_url,
        "category_color": news.category.color,
        "date": news.date.strftime("%Y-%m-%d"),
        "title": news.title,
        "author": news.author,
        "description": news.description,
        "image": news.image.url if news.image else None,
        "is_trending": news.is_trending,
    } for news in page_obj])

    return render(request, 'trending-stories.html', {
        'logo': logo,
        'news_list_json': news_list_json,  # Pass serialized JSON to the template
        'categories': categories,
        'epaper': epaper,
        'page_obj': page_obj
    })
  
def search_news(request):
    logo = SiteLogo.objects.all()
    query = request.GET.get('q', '')

    # Get all news objects
    news_queryset = New.objects.all()
    epaper_queryset = EpaperDaily.objects.all()
    lokhitmovement_queryset = Lokhitmovement.objects.all()

    if query:
        try:
            search_date = datetime.strptime(query, "%d %B %Y").date()
            # Filter by exact date
            news_queryset = news_queryset.filter(date=search_date)
            epaper_queryset = epaper_queryset.filter(uploaded_at__date=search_date)
            lokhitmovement_queryset = lokhitmovement_queryset.filter(uploaded_at__date=search_date)
        except ValueError:
            try:
                month_number = list(calendar.month_name).index(query.capitalize())  # Get the month number
                print(f"month_number:{month_number}")
                if month_number:
                    # Filter by month only
                    news_queryset = news_queryset.filter(date__month=month_number)
                    epaper_queryset = epaper_queryset.filter(uploaded_at__month=month_number)
                    lokhitmovement_queryset = lokhitmovement_queryset.filter(uploaded_at__month=month_number)
                else:
                    raise ValueError
            except ValueError:
                news_queryset = news_queryset.filter(
                    Q(title__icontains=query) | 
                    Q(date__icontains=query) |
                    Q(description__icontains=query) | 
                    Q(author__icontains=query) |
                    Q(category__name__icontains=query)
                )
                epaper_queryset = epaper_queryset.filter(
                    Q(title__icontains=query) |
                    Q(uploaded_at__icontains=query) |
                    Q(name__icontains=query)
                )
                lokhitmovement_queryset = lokhitmovement_queryset.filter(
                    Q(title__icontains=query) |
                    Q(uploaded_at__icontains=query) |
                    Q(name__icontains=query)
                )

    news_list = [
        {
            "id": news.pk,
            "category": news.category.name if news.category else "Uncategorized",
            "category_url": news.category.category_url,
            "category_color": news.category.color,  # Handle category safely
            "date": news.date.strftime("%Y-%m-%d"),
            "title": news.title,
            "author": news.author,
            "description": news.description,
            "image": news.image.url if news.image else None,  # Ensure safe access to image
            "is_trending": news.is_trending,
        }
        for news in news_queryset
    ]

    epaper_list = [
        {
            "id": epaper.pk,
            "title": epaper.title,
            "name": epaper.name,
            "category":"E Paper",
            "category_color": "#7D0552",
            "category_url": "epaper-daily",
            "pdf": epaper.pdf.url if epaper.pdf else None,  # Ensure safe access to the PDF
            "uploaded_at": epaper.uploaded_at.strftime("%Y-%m-%d"),
        }
        for epaper in epaper_queryset
    ]

    lokhitmovement_list = [
        {
            "id": lokhitmovement.pk,
            "title": lokhitmovement.title,
            "category_url": "lokhit-movement",
            "category":"Lokhit Movement",
            "category_color": "#473810",
            "name": lokhitmovement.name,
            "pdf": lokhitmovement.pdf.url if lokhitmovement.pdf else None,  # Ensure safe access to the PDF
            "uploaded_at": lokhitmovement.uploaded_at.strftime("%Y-%m-%d"),
        }
        for lokhitmovement in lokhitmovement_queryset
    ]

    # Combine news and epaper results
    combined_results = []
    for item in news_list:
        combined_results.append({'type': 'news', **item})

    for item in epaper_list:
        combined_results.append({'type': 'epaper', **item})

    for item in lokhitmovement_list:
        combined_results.append({'type': 'lokhitmovement', **item})

    # Pagination
    page_number = request.GET.get('page', 1)
    paginator = Paginator(combined_results, 12)  # Show 5 items per page
    page_obj = paginator.get_page(page_number)

    no_results = len(page_obj) == 0
    # Pass the serialized JSON data to the template
    return render(request, 'search.html', {
        'page_obj': page_obj,
        'query': query,
        'no_results': no_results,
        'logo': logo,
        'combined_results_json': json.dumps(page_obj.object_list)
    })

def about(request):
    logo = SiteLogo.objects.all()
    categories = Category.objects.all()
    return render(request, 'about-us.html', {'logo': logo,'categories': categories})

def dynamic_page_view(request, template_name, category_name):
    logo = SiteLogo.objects.all()
    categories = Category.objects.all()

    if category_name == "Top Stories":
        # Get the current date and time
        today = timezone.now()
        # Calculate the date one week ago
        one_week_ago = today - timedelta(days=7)
        # Filter news from the last one week, ordered by date (descending)
        news_queryset = New.objects.filter(date__gte=one_week_ago).order_by('-date')
        category = None  # No specific category for "Top Stories"
    else:
        # Filter news by the selected category
        category = get_object_or_404(Category, name=category_name)
        news_queryset = New.objects.filter(category=category).order_by('-date')
        
    # Pagination
    items_per_page = 12  # Number of items per page
    paginator = Paginator(news_queryset, items_per_page)
    
    page_number = request.GET.get('page', 1)  # Default to first page if not provided
    page_obj = paginator.get_page(page_number)

    # Serialize the current page's news_queryset to JSON
    news_list_json = json.dumps([{
        "id": news.id,
        "category": news.category.name,
        "category_url": news.category.category_url,
        "category_color": news.category.color,
        "date": news.date.strftime("%Y-%m-%d"),
        "title": news.title,
        "author": news.author,
        "description": news.description,
        "image": news.image.url if news.image else None,
        "is_trending": news.is_trending,
    } for news in page_obj])  # Serialize only the current page

    return render(request, template_name, {
        'logo': logo,
        'news_list_json': news_list_json,
        'categories': categories,
        'page_obj': page_obj,
        'selected_category': category,
        'category_name':category_name
    })
    
def donation(request):
    logo = SiteLogo.objects.all()
    categories = Category.objects.all()
    return render(request, 'donation.html', {'logo':logo,'categories': categories})