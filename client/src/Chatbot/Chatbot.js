import React, { useEffect } from 'react'
import Axios from 'axios';
import { useDispatch, useSelector} from 'react-redux';
import { saveMessage } from '../_actions/message_actions'
import BotMessage from './section/Botmessage';
import UserMessage from './section/UserMessage';

function Chatbot() {
    const dispatch = useDispatch();

    // useSelector는 리덕스의 store를 subscribe 하는 구조이기 때문에 action이 dispatch되면 마찬가지로 selector를 돌린다.
    const messageFromRedux = useSelector(state => state.message.messages);

    useEffect(() => {
        eventQuery();
    }, [])
    
    const textQuery = async ( text ) => {

        // First Need to take care of the message i sent
        // conversation이 아래와 같은 형식을 취한 이유는 dialogflow에서 보내주는 형식과 동일하게 하기 위해서
        let conversation = {
            who : 'user',
            content : {
                text : {
                    text : text
                }
            }
        }

        
        dispatch(saveMessage(conversation));

        // we need to take care of the message Chatbot sent
        const variable = {
            text
        };

        try {
           const res = await Axios.post('/api/dialogflow/textQuery', variable)
           const content = res.data[0].queryResult.fulfillmentMessages[0];
           
           conversation = {
               who : 'bot',
               content : content
           }
          
           dispatch(saveMessage(conversation));
            
        } catch (error) {
            conversation = {
                who : 'bot',
                content : {
                    text : {
                        text : "Error just occured, please check the problem"
                    }
                }
            }
           
            dispatch(saveMessage(conversation));
        }

      
    }

    const eventQuery = async () => {
        const variable = {
            event : "welcomeToMyWebSite"
        }

        try {
            const res = await Axios.post('/api/dialogflow/eventQuery', variable);
            const content = res.data[0].queryResult.fulfillmentMessages[0];
           
            let conversation = {
                who : 'bot',
                content : content
            }
         
            dispatch(saveMessage(conversation));
           
        } catch (error) {
            let conversation = {
                who : 'bot',
                content : {
                    text : {
                        text : "Error just occured, please check the problem"
                    }
                }
            }
          
            dispatch(saveMessage(conversation));
        }
       
    }

    const keyPressHandler = (e) => {

        // Enter를 쳤을때
        if(e.key === "Enter"){
            // input 값이 없다면
            if(e.target.value === ""){
                return alert('you need to type something first');
            }
            
            // we will send request to text query route 
            textQuery(e.target.value);

            e.target.value = "";
        }
       
    }

    const renderOneMessage = (message, index) => {
        console.log('message', message)
        if(message.who === 'bot'){
            return( 
                
                <BotMessage message={ message } index= { index } />
                
            )
        }else{
            return( 
                
               <UserMessage message={ message } index = { index }/>
            
            )
        }
        
    }

    const renderMessage = (messageFromRedux) => {
       
        if(messageFromRedux){
            // map은 빈배열일 경우 실행이 안되기때문에
            // messageFromRedux의 초기값이 빈배열이더라도 
            // useSelector를 사용해 로직을 잘 구현할 수 있다.
            return messageFromRedux.map((message, index) => {
                return renderOneMessage(message, index);
            })
        }else{
            return null
        }
    
    }  

    return (

        <div style={{ height : 700, width : 700, border : '3px solid black', borderRadius : '7px' }}>
            <div style={{ height : 644, width : '100%', overflow : 'auto' }}>

                
                { renderMessage(messageFromRedux) }

            </div>

            <input 
                style={{
                    margin : 0, width : '100%', height : 50,
                    borderRadius : '4px', padding : '5px', fontSize : '1rem'
                }}
                placeholder = "Send a message..."
                onKeyPress = { keyPressHandler }
                type="text"
            />

        </div>

    )
}

export default Chatbot
