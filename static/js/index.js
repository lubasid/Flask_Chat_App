// Client side code for the socketIO chat

// Creates a connection based on where Flask serves the application
var socket = io.connect('http://' + document.domain + ':' + location.port);
    
    (function(){
        
        // Event for the socket connection
        socket.on('connect', function() {
            var user = current_user;
            var send_info = ['logged in', user];
            send_info[0] = encryptMsg(send_info[0]);
            send_info[1] = encryptMsg(user);
            socket.send(send_info);
        });

        // Create the event handler for messages
        socket.on('message', function(msg) {
            var ul = document.getElementById('messages');   // Create element to hold message
            var li = document.createElement("li");
            var user = current_user;                        // Grab the current user 
            msg[0] = decryptMsg(msg[0]);                     
            msg[1] = decryptMsg(msg[1]);
            var input_msg = msg[0] + ":   " + msg[1];

            if (msg[0] == 'logged in')                      // If message is a login notification
                    li.setAttribute("class", "login_notif");// Apply login css 
            else{
                    if (msg[0] == user){                    // If message is from current user
                        li.setAttribute("class", "cur_client");// Set css for message box
                    }
                    else{                                      // Else if message is from another user
                        li.setAttribute("class", "other_client");// Apply other css format
                    }
            }


            li.appendChild(document.createTextNode(input_msg)); // Insert the message into li element
            ul.appendChild(li);

            // Below code allows the chat box vew to stick to the bottom see new messages
            var messageBody = document.querySelector('#chatBox');
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        });
    })();

    // Function which attaches an event listener to the enter key
    // to allow the user to send a message
    var input = document.getElementById("inputMessage");
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("sendBtn").click();
        }
    });

// Function for custom encryption based on a time value
function encryptMsg(msg)
    {
        var time = new Date().getTime();
        var encryptionList = [];
        var i = 0;
        console.log(time)
        if(time % 2 === 0)
        {
            for(i = 0; i < msg.length; i++)
            {
                var character = msg.charAt(i);
                console.log(character.charCodeAt());
                var encryptedCharacter = (character.charCodeAt() + 36) ** 2;
                encryptionList.push(encryptedCharacter);
            }
        }
        else
        {
            for(i = 0; i < msg.length; i++)
            {
                var character = msg.charAt(i);
                var encryptedCharacter = (character.charCodeAt() + 62) ** 2;
                encryptionList.push(encryptedCharacter);
            }
        }

        console.log(encryptionList.push(time));
        encryptionList = encryptionList.reverse();
        console.log(encryptionList);
        return encryptionList;
    }

    function decryptMsg(msg)
    {
        var decryptedMsg = "";
        msg = msg.reverse();
        console.log(msg[msg.length - 1]);
        if(msg[msg.length - 1] % 2 === 0)
        {
            for(i = 0;i < msg.length - 1;i++)
            {
                decryptedChar = (Math.sqrt(msg[i]) - 36);
                console.log(decryptedChar);
                decryptedMsg = decryptedMsg.concat(String.fromCharCode(decryptedChar));
            }
        }
        else
        {
            for(i = 0;i < msg.length - 1;i++)
            {
                decryptedChar = (Math.sqrt(msg[i]) - 62);
                console.log(decryptedChar);
                decryptedMsg = decryptedMsg.concat(String.fromCharCode(decryptedChar));
            }
        }
        return decryptedMsg;
    }

    // Function which sends the message after the send button or enter is clicked. 
    function sendMsg() {
        var user = current_user;
        var text = document.getElementById('inputMessage').value;
        var send_msg = [user, text];
        send_msg[0] = encryptMsg(user);
        send_msg[1] = encryptMsg(text);
        // console.log(text);
        // console.log(send_msg);
        socket.send(send_msg);
        clearInput();

    }
    // Function which automatically resets the message box
    // after the message is sent. 
    function clearInput() {

     document.getElementById("inputMessage").value = "";
}