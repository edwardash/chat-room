import React, { useState, useEffect } from 'react'
import './Chat.css';
import queryString from 'query-string'
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;
const Chat = () => {

    const [name, setname] = useState('');
    const [room, setroom] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState('');
    const [messages, setmessages] = useState([]);

    const ENDPOINT = 'https://chat-room-bvcz.onrender.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(window.location.search);
        socket = io(ENDPOINT);
        setname(name);
        setroom(room);



        socket.emit("join", { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });


        return () => {
            socket.disconnect();

            socket.off();
        }

    }, [ENDPOINT, window.location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setmessages([...messages, message]);
        })


        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages])


    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);


    return (

        <>

            <div className="outerContainer">
                <div className="container">
                    <InfoBar room={room} />
                    <Messages messages={messages} name={name} />
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                </div>
                <TextContainer users={users} />
            </div>

        </>
    )
}

export default Chat