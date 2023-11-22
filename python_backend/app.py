from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import time
from threading import Thread


app = Flask(__name__)
CORS(app)

# PostgreSQL connection parameters
db_params = {
    'host': '192.168.0.106',
    'port': '5432',
    'user': 'postgres',  # Replace with your PostgreSQL username
    'password': 'JustFlyItDatabase123',  # Replace with your PostgreSQL password
    'database': 'postgres',  # Replace with your database name
}

# Function to fetch usernames from the PostgreSQL database
def get_usernames():
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        cursor.execute("SELECT usernames FROM LoginDetails;")
        usernames = cursor.fetchall()

        return [username[0] for username in usernames]

    except (Exception, psycopg2.Error) as error:
        print("Error fetching usernames from the database:", error)
        return []

    finally:
        if connection:
            cursor.close()
            connection.close()

# Function to periodically update usernames
def periodic_update():
    global username_list
    while True:
        username_list = get_usernames()
        time.sleep(5)  # Update every 5 seconds

# Start the periodic update in a separate thread
update_thread = Thread(target=periodic_update)
update_thread.start()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print('Received data:', data)
    username = data.get('username')

    if username in username_list:
        print("LOGIN SUCCESS")
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        print("LOGIN FAILURE")
        return jsonify({'success': False, 'message': 'Invalid username'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
