#!/bin/bash
rm db.sqlite3
rm -rf notes/migrations/*
python manage.py makemigrations
python manage.py makemigrations notes
python manage.py migrate