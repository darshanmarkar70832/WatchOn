const axios = require('axios')

async function generateAccessToken(){
    const response = await axios({
        url:process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method:'post',
        data:'grant_type=client_credentials',
        auth:{
            username:process.env.PAYPAL_CLIENT_ID,
            password:process.eventNames.PAYPAL_SECRET
        }
    })
   
    return response.data.access_token
}

exports.createOrder = async ()=>{
    const accessToken = await generateAccessToken()
    const response = await axios({
        url:process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method:'post',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + accessToken

        },
        data:JSON.stringify({
          intent:'CAPTURE',
          purchase_units:[
            {
                items:[
                    {
                        name:'demo',
                        description:'demo purpose',
                        quantity:1,
                        unit_amount:{
                            currency_code:'USD',
                            value:'100.00'
                        }
                    }
                ],
                amount:{
                    currency_code:'USD',
                    value:'100.00',
                    breakdown:{
                        item_total:{
                            currency_code:'USD',
                            value:'100.00'
                        }
                    }
                }
            }
          ],
          application_context:{
            return_url: process.env.BASE_URL + '/complete-order',
            caNcel_url: process.env.BASE_URL + '/cancel-order'
          }
        })
    })
    console.log(response.data)
}
this.createOrder()