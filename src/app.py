#Stephanie Harber Final Project
#Libraries to install
#pip install flask
#pip install mongoengine

from flask import Flask, render_template, request, jsonify
import json
from mongoengine import connect, Document, StringField,ListField, FloatField, DictField
from datetime import date
import os

# app = Flask(__name__)
app = Flask(__name__,
            template_folder="../templates",
            static_folder="../public",
            static_url_path=""
)


#Create the connection to Shop MongoDB database
# client = db.connect('local', username='', password='')

#Connect to the environment variable.
MONGODB_URI = os.environ.get("MONGODB_URI")  # set in Vercel
MONGODB_DB = os.environ.get("MONGODB_DB", "local_")

connect(
    db=MONGODB_DB,
    host=MONGODB_URI,
)

#Messages from the database.
class Messages(Document):
    name= StringField()
    email = StringField()
    phone = StringField()
    content = StringField()
    messageDate = StringField()
    meta = {'collection':'Messages', 'allow_inheritance': False}

#Orders from the database.
class Orders(Document):
    name = StringField()
    email= StringField()
    city = StringField()
    address = StringField()
    orderDate = StringField()
    provinceState= StringField()
    items = ListField(DictField())
    shipPrice = FloatField()
    totalPrice = FloatField()
    meta = {'collection':'Orders', 'allow_inheritance': False}


#Retrieves orders for the history section
@app.route('/get_order', methods=['POST'])
def getOrders():
     data = request.get_json()
     form_data = data.get("form")
  
     name = form_data['histName']
     email = form_data['histEmail']
     
     #Check both name + email or individually.
     if (name and email):
         order = Orders.objects(name=name, email=email)
     elif (name):
         order = Orders.objects(name=name)
     elif(email):
         order = Orders.objects(email=email)
         
     #When an order is not found
     if not order:
        return jsonify({'error':'No Orders Found'})

    #When an order is found.
     else:
        order = order.first()
        order_dict = order.to_mongo().to_dict()
        order_dict['_id'] = str(order_dict['_id']) 
        return jsonify({'success': order_dict})#value})


#=============
# Home Route
#=============
@app.route('/')
def main():
    """"
    Renders the page with the index.html file.
    Method: GET
    """ 
    return render_template('index.html')

#Helper function to format the products in the cart.
def addItems(itemList):
    prodList=[]
    quant = 0
    product = ""
    price = 0

    #Loop through to get cart info details
    for key, value in itemList.items():   
        #Skip when quantity is zero.
        if int(value)<1:
            continue

        quant = int(value)

        match key:
            case "#cardsCart":
                 product ="Women's Hockey Cards"
                 price = 20.00

            case "#puckCart":
                product ="Signed Hockey Puck"
                price = 50.00

            case "#stickCart":
                product ="Mini Stick"
                price = 15.00
            case "#maskCart":
                product ="Goalie Mask"
                price = 100.00
            case "#mysPack":
                product ="Mystery Package"
                price = 35.00
            case "#tShirt":
                product ="Women's Hockey T-Shirt"
                price = 20.00
    
        prodItem = {"productName":product,"pricePer": price,
                                 "quantity" :quant}
        prodList.append(prodItem)
           
    return prodList
            
#Get today's date and set the format to month-day-year.
#Returns the date in the proper format.
def format_date():
    today = date.today()

    #Format the date to Month-Day-Year.
    separ ='/'
    month = str(today.month)
    day = str(today.day)
    if int(month)<10:
        month = '0'+str(month)
    if int(day)<10:
        day = '0'+str(day)

    orderDate = str(month)+separ+str(day)+separ+str(today.year)
    return orderDate


#===================
# Send Message Route
#===================
#Store the message details in the database.
@app.route("/send_message", methods=["POST"])
def save_message():
    """"
    Stores the contact form info into Message
    collection in the database.
    Method: POST
    """
    #Get the form data.
    data = request.get_json()
    form_data = data.get("form")
  
    name = form_data['name']
    email = form_data['email']
    phone = form_data['phone']
    mess_cont = form_data['message']
    messDate =format_date()
    new_mess = Messages(name=name, email=email,
                        phone=phone, content=mess_cont,
                        messageDate=messDate)
    
    #Save to database and return message to user.
    new_mess.save()
    return jsonify({"message": f"Hi {name}, your message has been sent on {messDate}"})


#Submit the order and return a message.
@app.route("/submit_order", methods=["POST"])
def submit_form():
    #Get the form and fields.
    data = request.get_json()
    form_data = data.get("form")
    
    name = form_data['orderName']
    email = form_data['inEmail']
    address = form_data['ordAddress']
    city = form_data['inputCity']
    state = form_data['ordState']
    shipping = data.get("shipping")
    ship = float(shipping.strip())
    zip_pro = form_data['inputZip']
    price = data.get("totPrice")
    result = addItems(data.get('quantities'))

    orderDate = format_date()

    #Create the new order to add to the database.
    new_order = Orders(name=name, email=email, orderDate=orderDate, address=address, 
                       city=city, provinceState=state, totalPrice=price, items=result,
                       shipPrice=ship)
    
    #Save and return a message to the user.
    new_order.save()
    return jsonify({"message": f"Hi {name}, your order has been place on {orderDate}"})

if __name__ =='__main__':
    app.run()#debug=True)

