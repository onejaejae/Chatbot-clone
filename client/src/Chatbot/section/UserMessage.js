import React from 'react'
import { List, Icon, Avatar } from 'antd';

function userMessage({message, index}) {
    return (
      
             <List.Item style={{ padding : '1rem'}}>
                    <List.Item.Meta
                        avatar={ <Avatar icon={<Icon type="smile" />}/> }
                        title={ message.who }
                        description={ message.content.text.text }
                    />
                </List.Item>
        
    )
}

export default userMessage
