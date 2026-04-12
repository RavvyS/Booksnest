import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def test():
    req = urllib.request.Request("http://localhost:8070/api/books", method="GET")
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            data = json.loads(res.read().decode())
            if not data:
                print("No books found")
                return
            book = data[0]
            print("Editing:", book['title'])
            
            # PUT
            put_data = json.dumps({
                "title": book['title'] + " x",
                "author": book['author'],
                "isbn": book['isbn'],
                "categoryId": book.get('categoryId', ''),
                "description": book.get('description', ''),
                "totalCopies": 10,
                "availableCopies": 5
            }).encode('utf-8')
            req2 = urllib.request.Request("http://localhost:8070/api/books/" + book['id'], data=put_data, method="PUT")
            req2.add_header('Content-Type', 'application/json')
            try:
                with urllib.request.urlopen(req2, context=ctx) as res2:
                    print("Update result:", json.loads(res2.read().decode()))
            except urllib.error.HTTPError as e:
                print("HTTP Error:", e.code, e.read().decode())
    except Exception as e:
        print("Error:", e)

test()
