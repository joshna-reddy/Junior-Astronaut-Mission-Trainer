from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def homepage():
    return render_template("index.html")


@app.route("/saturn")
def saturn_game():
    return render_template("saturn.html")

@app.route("/moon")
def moon_game():
    return render_template("moon.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


if __name__ == "__main__":
    app.run(debug=True)