import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyBartersScreen extends Component {
   constructor(){
     super()
     this.state = {
       exchangerId : firebase.auth().currentUser.email,
       exchangerName : "",
       allDonations : []
     }
     this.requestRef= null
   }

   static navigationOptions = { header: null };

   getExchangerDetails=(exchangerId)=>{
     db.collection("users").where("email_id","==", exchangerId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "exchangerName" : doc.data().first_name + " " + doc.data().last_name
         })
       });
     })
   }

   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("exchanger_id" ,'==', this.state.exchangerId)
     .onSnapshot((snapshot)=>{
       var allDonations = []
       snapshot.docs.map((doc) =>{
         var donation = doc.data()
         donation["doc_id"] = doc.id
         allDonations.push(donation)
       });
       this.setState({
         allDonations : allDonations
       });
     })
   }

   sendProduct=(productDetails)=>{
     if(productDetails.request_status === "product Sent"){
       var requestStatus = "exchanger Interested"
       db.collection("all_donations").doc(productDetails.doc_id).update({
         "request_status" : "Exchanger Interested"
       })
       this.sendNotification(productDetails,requestStatus)
     }
     else{
       var requestStatus = "product Sent"
       db.collection("all_donations").doc(productDetails.doc_id).update({
         "request_status" : "product Sent"
       })
       this.sendNotification(productDetails,requestStatus)
     }
   }

   sendNotification=(productDetails,requestStatus)=>{
     var requestId = productDetails.request_id
     var exchangerId = productDetails.exchanger_id
     db.collection("all_notifications")
     .where("request_id","==", requestId)
     .where("exchanger_id","==",exchangerId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(requestStatus === "product Sent"){
           message = this.state.exchangerName + " sent you product"
         }else{
            message =  this.state.exchangerName  + " has shown interest in donating the product"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message": message,
           "notification_status" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.product_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="product" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.request_status === "product Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendproduct(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "product Sent" ? "product Sent" : "Send product"
             }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getExchangerDetails(this.state.exchangerId)
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all barters</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})