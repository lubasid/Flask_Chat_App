var socket = io.connect('http://' + document.domain + ':' + location.port);
    
    (function(){
     
        socket.on('connect', function() {
            var user = current_user;
            var send_info = ['logged in', user];
            socket.send(send_info);
        });

        socket.on('message', function(msg) {
            var ul = document.getElementById('messages');
            var li = document.createElement("li");
            var user = current_user;
            console.log(msg[1]);
            if(!(msg[1] === user))
                msg[1] = decryptMsg(msg[1]);
            var input_msg = msg[0] + ":   " + msg[1];

            if (msg[0] == 'logged in')
                    li.setAttribute("class", "login_notif");
            else{
                    if (msg[0] == user){
                        li.setAttribute("class", "cur_client");
                    }
                    else{
                        li.setAttribute("class", "other_client");
                    }
            }


            li.appendChild(document.createTextNode(input_msg));
            ul.appendChild(li);

            var messageBody = document.querySelector('#chatBox');
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
            console.log('client msg received');
        });
    })();


    var input = document.getElementById("inputMessage");
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("sendBtn").click();
        }
    });

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


    function sendMsg() {
        var user = current_user;
        var text = document.getElementById('inputMessage').value;
        var send_msg = [user, text];
        send_msg[1] = encryptMsg(text);
        console.log(text);
        console.log(send_msg);
        socket.send(send_msg);
        clearInput();

    }

    function clearInput() {

     document.getElementById("inputMessage").value = "";
}