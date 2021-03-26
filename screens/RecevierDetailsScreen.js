import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';

export default class RecieverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId : firebase.auth().currentUser.email,
      recieverId : this.props.navigation.getParam('details')["user_id"],
      requestId : this.props.navigation.getParam('details')["request_id"],
      productName : this.props.navigation.getParam('details')["product_name"],
      reason_for_requesting : this.props.navigation.getParam('details')["reason_to_request"],
      recieverName : '',
      recieverContact : '',
      recieverAddress : '',
      recieverRequestDocId : ''
    }
  }

getUserDetails(){
  db.collection('users').where('email_id','==',this.state.recieverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        recieverName    : doc.data().first_name,
        recieverContact : doc.data().contact,
        recieverAddress : doc.data().address,
      })
    })
  });

  db.collection('requested_products').where('request_id','==',this.state.requestId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({recieverRequestDocId:doc.id})
   })
})}

updateProductStatus=()=>{
  db.collection('all_donations').add({
    product_name : this.state.productName,
    request_id : this.state.requestId,
    requested_by : this.state.recieverName,
    exchanger_id : this.state.userId,
    request_status : "Exchanger Interested"
  })
}

getReceiverDetails(){
  console.log("receiver ",this.state.receiverId);
  db.collection('users').where('username','==',this.state.receiverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        receiverName    : doc.data().first_name,
        receiverContact : doc.data().mobile_number,
        receiverAddress : doc.data().address,
      })
    })
  });

addNotifications=()=>{
  var message = this.state.username+" has shown interest in exchanging with you."
  db.collection('all_notifications').add({
    "targeted_user_id"    : this.state.recieverId,
    "product_name"           : this.state.productName,
    "request_id"          : this.state.requestId,
    "exchanger_id"            : this.state.userId,
    "date"                : firebase.firestore.fieldValue.serverTimestamp(),
    "notification_status" : "Unread",
    "message"             : message
  })
}

sendNotifications=(productDetails, request_status)=>{
  var requestId = productDetails.request_id
  var exchangerId = productDetails.exchanger_id
  db.collection("all_notifications").where("request_id", "==", requestId).where("exchanger_id", "==", exchangerId).get()
  .then((snapshot)=>{
    snapshot.foreach((doc)=>{
      var message = " "
      if(requestStatus === "Product Sent"){
        message = this.state.exchangerName+ " sent you a product."
      }else{
        message = this.state.exchangerName+ " has shown interest in exchanging with you."
      }
      db.collection('all_notifications').doc(doc.id).update({
        "date"                : firebase.firestore.fieldValue.serverTimestamp(),
        "notification_status" : "Unread",
        "message"             : message
      })
    })
  })
}

componentDidMount(){
  this.getRecieverDetails();
  this.getUserDetails(this.state.userId);
}


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#ffff'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Exchange Items", style: { color:'#ffff', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#32867d"
          />
        </View>
        <View style={{flex:0.3,marginTop:RFValue(20)}}>
          <Card
              title={"Item Information"}
              titleStyle= {{fontSize : 20}}
            >
            
              <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
            
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.description}</Text>
          
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Receiver Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.receiverName}</Text>
            
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.receiverContact}</Text>
            
              <Text style={{fontWeight:'bold'}}>Address: {this.state.receiverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.receiverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBarterStatus()
                    this.addNotification()
                    this.props.navigation.navigate('MyBarters')
                  }}>
                <Text style={{color:'#ffff'}}>I want to Exchange</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})