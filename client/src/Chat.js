import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, name, room }) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                author: name,
                room: room,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ':' +
                    new Date(Date.now()).getMinutes(),
            };

            socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
        }
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className='chat-window'>
            <div className='chat-header'>
              <p><center>Welcome to Chat Room</center></p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                    {messageList.map((messageContent) => {
                        return (
                            <div
                                className='message'
                                id={name === messageContent.author ? 'other' : 'you'}
                            >
                                <div>
                                    <div className='message-content'>
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className='message-meta'>
                                        <p id='time'>{messageContent.time}</p>
                                        <p id='author'>{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input
                    type='text'
                    value={currentMessage}
                    placeholder='Start chatting now'
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === 'Enter' && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
