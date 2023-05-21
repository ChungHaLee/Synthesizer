from flask import Flask, render_template, request
import os

app = Flask(__name__)

user_name = ""
user_emailAdress = ""

## 필요한 함수 선언 

# @app.route('/', methods=['POST', 'GET'])
# def login():
#     return render_template('login.html')



# @app.route('/menu', methods=['POST', 'GET'])
# def menu():
#     if request.method == 'POST':
#         id = request.form['id_name']  # 아이디 저장
#         pw = request.form['pw_name']  # 패스워드 저장

#     return render_template('menu.html', UserID = id, UserPW = pw)



@app.route('/', methods=['POST', 'GET'])
def login(): 
    return render_template('login.html')


@app.route('/melody', methods=['POST', 'GET'])
def shape():
    return render_template('shape.html')



@app.route('/edit', methods=['POST', 'GET'])
def edit():
    return render_template('edit.html')


# @app.route('/template', methods=['POST', 'GET'])
# def shape_template():
#     return render_template('shape_template.html')


if __name__ == '__main__':
  app.run(host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 2000)), debug=True, use_reloader=False)