from flask import Flask, render_template, request
import os

app = Flask(__name__)

## 필요한 함수 선언 



@app.route('/', methods=['GET', 'POST'])
def login(): 
    return render_template('login.html')



@app.route('/phase1', methods=['POST', 'GET'])
def shape():
    if request.method == "POST":
        username = request.form.get('username')
        print('유저 이름', username)  # Debug print
        return render_template('shape.html', username=username)



@app.route('/phase2', methods=['POST', 'GET'])
def shapetwo():
    if request.method == "POST":
        username = request.form.get('username')
        print('유저 이름', username)  # Debug print

        return render_template('shape_two.html', username=username)






if __name__ == '__main__':
  app.run(host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 2000)), debug=True, use_reloader=False)