import React from 'react'
import { List, Icon, Avatar } from 'antd';

function BotMessage({ message, index }) {
    return (
        <List.Item style={{ padding : '1rem'}}>
                        <List.Item.Meta
                            avatar={ <Avatar icon={<Icon type="robot" />}/> }
                            title={ message.who }
                            description={ message.content.text.text[0] }
                        />
        </List.Item>
    )
}
 
export default BotMessage
