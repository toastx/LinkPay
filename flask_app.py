from flask import Flask, request, jsonify
from stellar_sdk import TransactionBuilder, Asset, Server, exceptions, Network, Keypair
import uuid
import base64
from payments import create_payment_request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, support_credentials=True)
server = Server(horizon_url="https://horizon-futurenet.stellar.org")

@app.route('/pay', methods=['GET',"POST"])
def pay():
    data = request.get_json()
    amount = data.get('amount')
    receiver = data.get('receiver')
    key = data.get('key')
    sender = data.get('sender')

    try:
        receiver_account = server.load_account(receiver)
        payment_request_data = server.accounts().account_id(receiver).call()["data"].get(key)


        if payment_request_data:
            payment_request_data = base64.b64decode(payment_request_data).decode()

        
        expected_request_data = f"request:{amount}:{key}"

        print(payment_request_data)
        print(expected_request_data)
        if payment_request_data != expected_request_data:
            return jsonify({"data":payment_request_data,"status": "error", "message": "Invalid payment request data"})

        print("found request")
        sender_account = server.load_account(sender)
        base_fee = server.fetch_base_fee()

        transaction = TransactionBuilder(
            source_account=sender_account,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=base_fee
        ).append_payment_op(
            destination=receiver,
            amount=amount,
            asset=Asset.native()
        ).build()

        txn_xdr = transaction.to_xdr()
        return {"xdr":txn_xdr}

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    


@app.route('/create', methods=['POST','GET'])
def create_payment_request():
    
    data = request.get_json()
    receiver_public_key = data.get('receiver_public')
    amount = data.get('amount')
    unique_key = uuid.uuid4().hex
    request_data = f"request:{amount}:{unique_key}"
    receiver_account = server.load_account(receiver_public_key)
    print("!")
    
    base_fee = server.fetch_base_fee()

    transaction = TransactionBuilder(
        source_account=receiver_account,
        network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
        base_fee=base_fee
    ).append_manage_data_op(
        data_name=unique_key,
        data_value=request_data
    ).build()

    print("!")
    txn_xdr = transaction.to_xdr()
    url = f"http://localhost:3000/pay?amount={amount}&receiver={receiver_public_key}&key={unique_key}"
    return {"xdr":txn_xdr,"unique_key":unique_key,'url':url}




if __name__ == '__main__':
    app.run(debug=True)
