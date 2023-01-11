from flask import Flask, render_template, request

from scrape import search
app = Flask(__name__)

@app.route('/')
def hello_world():
   return render_template("index.html")


@app.route('/submit')
def submit():
   res = search(request.args.get('item_name'))
   return render_template("results.html", result=res)


if __name__ == '__main__':
   app.run()