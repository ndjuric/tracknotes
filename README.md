### Pre
Make sure that nothing is listening on ports:
 - 8000 (needed for backend)
 - 8080 (needed for frontend dev server if you plan on running it)

### Unpack
```bash
~ $ tar -xvzf tracknotes.tar.gz
```
or
```bash
~ $ git clone https://github.com/ndjuric/tracknotes.git
```
Now you have a ./tracknotes folder.  
```bash
~ $ cd tracknotes
~/tracknotes $
```

### Backend
```bash
~/tracknotes $ cd backend
~/tracknotes/backend $ virtualenv -p python3 venv
~/tracknotes/backend $ source venv/bin/activate
~/tracknotes/backend $ pip install -r requirements.txt
~/tracknotes/backend $ python manage.py migrate
~/tracknotes/backend $ python manage.py runserver
```
You should now be able to access backend on http://localhost:8000

### Frontend
Code is a mess, I'm still learning React.
```bash
~/tracknotes $ cd frontend
~/tracknotes/frontend $ npm install
~/tracknotes/frontend $ npm run dev
```
You should no be able to access frontend dev server with hot reloading enabled on http://localhost:8080  
