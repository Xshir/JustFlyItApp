from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory user data store (replace with a database in production)
users = {

# 'Role' : (uid, 'real_full_name', 'username', 'password') 
# Roles => Developer, Administrator, Trainer, Backend
}


# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in users and users[username]['password'] == password:
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Login failed'})

if __name__ == '__main__':
    app.run()
