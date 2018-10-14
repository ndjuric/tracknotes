#!/bin/bash
#find . -name "*.pyc" -exec rm -f {} \;
find . -regex '^.*\(__pycache__\|\.py[co]\)$' -delete
