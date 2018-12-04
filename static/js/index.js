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


    function sendMsg() {
        var user = current_user;
        var text = document.getElementById('inputMessage').value;
        var send_msg = [user, text];
        console.log(text);
        socket.send(send_msg);
        clearInput();

    }

    function clearInput() {

     document.getElementById("inputMessage").value = "";
}
