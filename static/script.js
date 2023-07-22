function createWs(url)
{
    let ws = new WebSocket(url);

    ws.onopen = event => {
        afterConnectButtonState();
    };

    ws.onmessage = event => {
        let msg = Message.fromJSON(JSON.parse(event.data));

        if(document.hidden) {
            messageAlarm();
        }

        chatDiv.append(msg.toParagraph(event.data));
    };

    ws.onclose = event => {
        p = getMessageParagraph("Disonnected!");
        p.classList.add("info_message");

        chatDiv.append(p);

        beforeConnectButtonState();
    };

    currentNickName = nicknameField.value;
    document.cookie = "CURRENT_NICKNAME=" + currentNickName;
    
    return ws;
}


function sendMessage()
{
    let text = inputField.value;

    let msg = new Message(currentNickName, text, 'message')

    ws.send(msg.toJSON());

    inputField.value = "";
}


function wsConnect() {
    let url = new URL('/socket', location.href);

    if(url.protocol === 'https:') {
        url.protocol = 'wss';
    } else {
        url.protocol = 'ws';
    }

    ws = createWs(url);
}

function wsDisconnect() {
    ws.close()
}

function getMessageParagraph(text) {
    p = document.createElement("p");
        
    p.classList.add("marginfix");

    p.innerHTML = text

    return p;
}

function afterConnectButtonState() {
    nicknameField.disabled = true;

    connectBtn.disabled = true;
    disconnectBtn.disabled = false;

    inputField.disabled = false;
    send_button.disabled = false;
}

function beforeConnectButtonState() {
    nicknameField.disabled = false;

    connectBtn.disabled = false;
    disconnectBtn.disabled = true;

    inputField.disabled = true;
    send_button.disabled = true;
}

function with_leading_zeros(time) 
{ 
    return (time < 10 ? '0' : '') + time;
}

function messageAlarm() {
    var snd = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAUAAARIwAYGBgYJCQkJCQwMDAwMDw8PDw8SUlJSUlVVVVVVWFhYWFhbW1tbW15eXl5eYaGhoaGkpKSkpKenp6enqqqqqqqtra2trbDw8PDw8/Pz8/P29vb29vn5+fn5/Pz8/Pz//////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJASTAAAAAAAAESOCw1IYAAAAAAAAAAAAAAAAAAAAAP/7UGQAAAFtDNJtBGAAFUFHoKCIAAiYWWKYkwAAUoAiQwQgAIS0AwAAAYABMxjY9wAAl7u+gQIgg4Hz5cH+GKz5cPwQcyfl/lwf/1vLn+GP8P/9jGMYxsAGLD/8EAQcJzX+n///qD8kkBIBBAJaaTkCJLokaUxyZI2gGYInGmH2ajkLgfOU38f8pa4SBJwEUVAwlYwEARDAcBQBIy+tO0YbAJcMuStXWKs6P2/qfeSI7m1/5dmnWi+7/9+ztpu/+lVVlwQAIAtCALWjf0Zog93/+1JkB4DyEyDadz5AAhSgCFDhCAAIhQ1v57RLwEuAYUABCABahJo6xJGUoLgE8E/jGi5TxcJ4fxcglAuPLpfz5Pl9an0zE1UgpfMi8gul0DT0z459P8E69k/3sOnct2f/9D+5e5enTr/7xSrf7SqAAxcQC2A6mkPJqP8yBxn6D3Jr6J3JIAclvOHz5eic/sYkAh/pEkZv9ZRhfmmMN/gv85P/9Mza8pTE+lwAnysO1H01nf/1++j9Ka9Nv/bXpl/rcylodwVRAwhJJCAYGdgVbv/7UmQHAPIDIlt56DwkEgAYUABCAAjo82PHsKlAR4AggAEJcC+UKWwVpuszenkDhrWQequ/FGe8sCV6VywSCILv54jP+YIgTKv2L+D53gi7kf/qiF3Ev935FVvq7fvq/v7U6d/73L69F7di0AABwNYITAOPo94tiMGGKWExidxFqlzAmq6fFm1bH1+sv0CQGFlbKhw6X6zGdehA4DP9Q+OX5GFmT9F/Wz/nQ38TDVdX/o/X+Vbr/vp//X/WuSRxFUIlbMYBMAAAgQBB1VZ2ksQ+//tSZAeE8fMYVnHpFBASQAgQCEJcCAx/TYeEdABPgCFAAQlwhzoaDmYdRocTehhAOoQZS6a2ngBCYIT67Ziv+P6gXcgaCgWlhK41vIf/+JUssK0+3b//s1qPuJo8szelH/Gp/+9WfwhAAAT5wkPwAwtgng7g6R0O2tgYevkhAWl9o7e523ISlG/gc7MrUQvjkakneMSMFUTdqXopAb3f/l8VtE9vFv02+39Ta9TN9ttffsU8mjo2//8gd+SgAAIBoKckABkChVhfidoxGo4ekkH/+1JkC4CB6CvSWewqsA/gGFAAQgAJNDdt5LEkOEAAYdQBCABNUmRlImB8iTmqqioI3pLM7pQtUvUrWtnXdEEa36//x///1GkDqf//Sx3//Tc1ZNjf2fYhWxDQ8OzMqrG2mUASkZCFHkwpLwwLQm9sq1AXRJOn5pRSBuXO8dgiq9jAA2SI5R1Qz/+xFIP3pX7crW2XhGJ6RChPxQwqVnDY6qmgPvsfuO36tPp+3d/6ai/Z/oooSWNDIAAAAOsBIKID5gzAiaMZJFbsQgdZyhiR9P/7UmQOgPHVEFHxhiowEyAIUABCXAec7VPEhFSITIBgwAEIAIyORsFK84BlGXpiPYlAysns1uY6lrcGDZaxg5KxP/rs/fZ/8XXvvgJbMUN193r/06mqWEiIABUAQHiEcFaACzh4ueRpMI1oadQidAm9yaTkCNJxlN5/HR8YpeRaVRB////////4P6Yc7JWt8qkn+rZ37/7fo7Pso1nEuvX/qXtQSmU4ZkIAH0cAnqbG/usYRSex6JA50sAadHUTCGJ3yIRFDGWvtPtcUwVIw1lT//tSZBYA8wstVnM4SmAPIBgwAEIACHCzi+ysrrBMAGEAAQgAWYi5DttbauyiDblG/ZcuGxQKRUZwxp0+UOisV8UQO7VGChjijOm9NJAjTR/9Gk44KOcPf8Uf6v6vej/9/+30Oqq0s/6omGhWZESRpNICe3vPVdow8KkxEM89S4A9hi6ub+9woE05P6Qwy9w4LfFgRH8AEN1EG+YU+oCfjQRq0KLvw/lwui39aPs/s513V+kil2R2F3dutv+MfcmKgWVAICjIKbAfcAMvYE/BmUH/+1JkCQDyMxtd+ZhZtBTAGEAAQgAIOIFz5kVKwFOAYUABCABiDsVeVFIp99+mvBYZnP4gEIeQ7Fy8EIPQgK/ai//9F2sE8qHMFG1hsMVCvRBURunZf2EtP+xKrrmJuVObAIJUfZZ/+n6tNv7V78gciBAc4AAgFWyuPDZc0aR/u2cVFkEoS1NzyY6RBjTKoE4Fd1WYC+FJSearfkJP9CInbBV+DTsScv/Z+IgXbLA/+qr+alN2/cUd/VR0ijP9NPpbQl+q3+EnMBBDWACQFk/Fo//7UmQGgPIQJ9r581MgE0AYUABCAAhgrX3nrFZwRYBggAEIAOj7Dd2aArYZ6l203IkBfZFbKK0hgjFCiOYMgtP8GQ5pwYO2qwcf54ijPlS38tw52c7q9+rq/Ga3fb//1hLs/an9hHo6r2tTeiYYlVAMksYBBAF+2tzfAXfDuJ8yVUfgLgum/4brUIyt++f1OKV8Q/uRePtTbtUvr3ewTfqN9Q4n6h290CuqBHkf7ee//V9n/9X+3VnLdNy22oGr/1W2goApxkAFAPZE8yTtAOUM//tSZAgA8iYq2mmYUqQToAgQCEJcCFCLb6exUpBXgCEAAQlwKy380yDEGQZ51p7MHxPMmusIBDsxbF5IuysVdpu4rv9BCt8q/5j/k3ZrRz1QsxMWfLDXTauyr9mn/xq7iCu77q8x5nTx1X+hH/CYDb1aAbAfKFXuBpiaZMlHw0/F9SBAv3fgN79+SE1sfJ2w7hES6KdVFUfJ7v3hcjewKk9BLGn5NyXPd2jsOaOM1f/9HeaN5pjV5zXUHBnK39/o75Kz6KlYYDQAIj9ZCcAz5Cj/+1JkBgDx+i5ceesUtBRAGFAAQgAIfMlv57D0UEGAYYABCADVhv4MJWPEIjfqcLqf0jxaplb1/4HwOqqnjPUHGvqKai3/qCBW+o36//8b8D/iH8LP1Oq/9D+83GaxlKqPtRQ9WKf/dXX/8UaWAyADMvUgHAE1lCx9NZ6ZJmqbO9ZwVJJK9wfOD0Lwpnv//cwzHdUTGEhAU/MOQRj/5gJs/UIyKX/9P6/r/Kt/6ux1fUn+1df+7Qyqv/dJUf1p/62KkUMQU0+aLkANVPK8V4ohd//7UmQIgPI0Md157DykFCAIYAhCXAgcqW/nrFDQWYBhQAEIAMEES2VbJ+kSO/V6sRTATJ9//yQycb09TWgF3P+3yKDvoEAlfi1fU/+/5gu75E33jw3P9/6e7RZeqm/p729nX/9/0I97P5lGhGtbzAKQgpH6iTGAaqaXMSEXHlzZIjNj8wxU/tKlPicef/xDtYlGrh9ePkPmOgo/j/2+pPyP84rodk1k5ZtZH28nGL+2pf701dmKv/ZF0q/JUXq3i+tNuzRQ3wrARmhADYCTfMbb//tSZAYM8f4bWunpO7QVwBhQAEIAB7zJcGes7VBDgGDAAQgAVTZFsHS8NV79Ayx42wu9Ehb3+7WBkJoXpiMTggGfVQd/eT6M4S7+/T4OHMVYCi5Qh8sqS+8eu1nv6l+75ln26Lkp/1Xa6GcWNK2YRsAS72dW4XODvYGVpYfw7zf3OPPNP/gKjxu1U/h+PuRa2HgEt9Q9zP/qW/Gn6P+n6RqgVCEA1ra8h3aCunM3ZlXtWtX/1/o//1duv/oqvgZAIcRBBIDNn6WmXMjbVINEKGD/+1JkCgDyRzDXaws7tBPgGDAAQgAINKVfrCxPUFGAYYABCAD+1b6SNgzZGOWf5mYCX9yZqEzJGmouMBmvhFruJxlDPGv4Km+pQas0xHKflS343rQz2VdP0a6qzmpnT9cV0+iyh1Ndv/9ns3+qRgkABRkABAUlnVupDcoAzYpUi9/5UDNETr3+qRDX/8UXoPc11jXFuhLBBr+JKRBxXi/yP8EO/wrcl2Uf+4WfgTPfTvQzYYVpo8nZr+jffV1Wqq/9aa5oYEMAIEzIBSAf2kZykv/7UmQHAPISMNh7LTwUFEAIUAhCXAh403XlsPRwSABhQAEIAA46YGYskPBuOyCSbmBmBxN81bsQEN7/DoRypcOCUaBCS/Ak/zQ/6mfo/5zfR/q35W2j9OS7JTp93+uz/qZ5w6x0Ud6vXd+KwWaYBkAFNtmgEQGvHg3GwPeHAMEARY8XDR5QXkAVkB/+Dy7y6CYeGPJN6qIyL/gUO+PN+d+rfl/0/tOdpgjBt0kSES/6uYa6R/7dW//1tst7d31L/fuFqrqGQGnm0AkBYqRaBLUC//tSZAcA8gkeWGsMO7QRYAhAAEJcCNCnbeeYrvBOgGGAAQgA9FtttQyrnbzEiiN/2GxUcAR6Z2aEKhWLOLrcX6Y+cvhQLsRTUfcmS53X18hU5u68yv00f/7tD3/ZVj/9mi23sTGd3/6HhgVAMyWtskoBSx3MzGMmWR+C4zklYfKBvE1YL3lHJf9tc9QFsIQiaemyq3EgZfl5Sys29DesR51jaQEhgNX2VokTamromOus5/2VfxqGfjn6nr9nX+7tZ6ddeoBkAFdbc0wQO9hiNwz/+1JkBwLx4CnX+wwTKBNAGFAAQgAHUGVd54xPIEqAYQABCAA0t4El1LIYadP4TYWMG8Xr4IVrl6PMStVIcizPdlL+Dg/R6W+uTpTBf//1o70p98Wud/dV3lO//wFRmvqR/jK75makHcjdmhICFyTxFGZC6HqCVm+SV95jBVkfQA8OqchHb5ogrRyyVoOD5ayEJTiXTnt6BR9uoklRq/Sj19lHo6+h36v+7SBd0XV7fT+lSrqOQWBAAVSUPAyDwMCxBU+TR6fFQJEdUH8DU4hol//7UmQPAfHLEtFZ6RogFUAIMAhCXAcoP0CHsQLAWYAhQCEJcAWPgQA90EhRKQgYr1OvmHVNKUc2r1+Ra0mOqT1ZJl3bv/za3enWvMNbsu4Y+no7G0P0qMMIAtSQOU2wMl1MTj7nD4mgeO+mJFVWttWJOkiAdLAVa3FRF9IlOxMHYiDvDXUBXkYdXUPdEtHr5f28WFY7sr/bfu+hGifT2qZ17U966gAAwKobJOEPUC20OQcyMA0WzIap8c1RGspZcop8gM6zvSq+6zGfnqvb99T6//tSZBYA8WIYxBHhGfAAAAigAAABBajzBSCEQABaACFAAAAABiACIBDFA4lKMBU9BvjoCoTM7/BBn4Lx+vE//Bf6TenmK+A4/1l/jxwQP+1+n/2KIsq3KChG3r3VNV2dJlHay/6Wf+hS1qBlVFIlcEBgLYJTAikNYx14/lracr+V//d9vW9P/09eW9UqCox54qCoCPLDXKjRj5HPfxL4arO9ckJYNZYO+IpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+1JkNI/xBQDA6CEQACEgF6AAAAAAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==");  
    
	snd.play();
}
