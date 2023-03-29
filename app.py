import requests
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def hello_world():
   return render_template("index.html")

@app.route('/about')
def about_page():
   return render_template("about.html")

@app.route('/contact')
def contact_page():
   return render_template("contact.html")



@app.route('/submit')
def submit():

   r = requests.get('http://localhost:9000/blinkit?s='+request.args.get('item_name'));
   res = r.json()

   r = requests.get('http://localhost:9000/dunzo?s='+request.args.get('item_name'));
   res2 = r.json()


   return render_template("results.html", blinkit=res, dunzo=res2)


if __name__ == '__main__':
   app.run()