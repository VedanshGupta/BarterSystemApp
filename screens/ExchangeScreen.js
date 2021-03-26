import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { RFValue } from "react-native-responsive-fontsize";
import { Input } from 'react-native-elements';

export default class ExchangeScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      productName:"",
      reasonToRequest:"",
      IsproductRequestActive : "",
      itemValue: '',
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addBarter =(productName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_products').add({
        "user_id": userId,
        "product_name":productName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "item_value"  : this.state.itemValue,
    })

    this.setState({
        productName :'',
        reasonToRequest : ''
    })

    return alert("Product Requested Successfully")
  }

  getIsProductRequestActive(){
    db.collection('users')
    .where('email_id','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsproductRequestActive:doc.data().IsproductRequestActive,
          userDocId : doc.id
        })
      })
    })
  }

  sendNotification=()=>{
    //to get the first name and last name
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name

        // to get the donor id and product nam
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var productName =  doc.data().product_name

            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " received the product " + productName ,
              "notification_status" : "unread",
              "product_name" : productName
            })
          })
        })
      })
    })
  }

  updateProductRequestStatus=()=>{
    //updating the product status after receiving the product
    db.collection('requested_products').doc(this.state.docId)
    .update({
      product_status : 'recieved'
    })

    //getting the  doc id to update the users doc
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('users').doc(doc.id).update({
          IsProductRequestActive: false
        })
      })
    })
  }

  receivedproducts=(productName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received_products').add({
        "user_id": userId,
        "product_name":productName,
        "request_id"  : requestId,
        "productStatus"  : "received",

    })
  }

  getData(){
  fetch("http://data.fixer.io/api/latest?access_key=e66518499396d5949e104f4b9bd75a92&format=1")
  .then(response=>{
    return response.json();
  }).then(responseData =>{
    var currencyCode = this.state.currencyCode
    var currency = responseData.rates.INR
    var value =  69 / currency
    console.log(value);
  })
  }

  getExchangeRequest =()=>{
  // getting the requested book
var exchangeRequest=  db.collection('requested_products')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().product_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedProductName: doc.data().product_name,
          productStatus:doc.data().product_status,
          docId     : doc.id
        })
      }
    })
})}

  componentDidMount(){
    this.getExchangeRequest()
    this.getIsProductRequestActive()
    this.getData()
  }

  render(){

      if(this.state.IsproductRequestActive === true){
        return(

          // Status screen

          <View style = {{flex:1,justifyContent:'center'}}>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Product Name</Text>
            <Text>{this.state.requestedProductName}</Text>
            </View>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Product Status </Text>

            <Text>{this.state.productStatus}</Text>
            </View>

            <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
            onPress={()=>{
              this.sendNotification()
              this.updateProductRequestStatus();
              this.receivedProducts(this.state.requestedProductName)
            }}>
            <Text>I recieved the product </Text>
            </TouchableOpacity>
          </View>
        )
      }
      else
      {
      return(
        // Form screen
          <View style={{flex:1}}>
            <MyHeader title="Request Product" navigation ={this.props.navigation}/>

            <ScrollView>
              <KeyboardAvoidingView style={styles.keyBoardStyle}>
                <Input
                  style ={styles.formInput}
                  label={"Product Name"}
                  placeholder={"enter product name"}
                  onChangeText={(text)=>{
                      this.setState({
                          productName:text
                      })
                  }}
                  value={this.state.productName}
                />
                {this.state.showFlatList ? 
                  (<Flatlist
                  data={this.state.dataSource}
                  renderItem={this.renderItem}
                  enableEmptySections={true}
                  style={{marginTop:10}}
                  keyExtractor={(item, index)=>index.toString()}
                  />)
                  : (<View style={{alignItems: 'center'}}>
                      <Input
                        style ={[styles.formInput,{height:300}, {width: 1075}]}
                        label={"Reason to exchange the product"}
                        multiline
                        numberOfLines ={8}
                        placeholder={"Why do you need the product"}
                        onChangeText ={(text)=>{
                            this.setState({
                                reasonToRequest:text
                            })
                        }}
                        value ={this.state.reasonToRequest}
                      />
                      <Input
                        style={styles.formInput}
                        label={"Value of the product"}
                        placeholder ={"Item Value"}
                        maxLength ={8}
                        onChangeText={(text)=>{
                          this.setState({
                            itemValue: text
                          })
                        }}
                        value={this.state.itemValue}
                      />
                      <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{ this.addBarter(this.state.productName,this.state.reasonToRequest);
                        }}
                        >
                        <Text>Request</Text>
                      </TouchableOpacity>
                     </View>)
                }

              </KeyboardAvoidingView>
              </ScrollView>
          </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formInput:{
    width:"75%",
    height:RFValue(15),
    alignSelf:'center',
    borderColor:'#ffab91',
    borderBottomWidth:1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  button:{
    width:"25%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ffa500",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
