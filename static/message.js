class Message {
    timestamp = 0;

    constructor(nickname, text, type) {
        this.nickname = nickname;
        this.text = text
        this.type = type
    }

    toJSON() {
        let data = {
            nickname: this.nickname,
            text: this.text,
            type: this.type
        };

        return JSON.stringify(data)
    }

    toParagraph(raw_data)
    {
        let time = new Date();

        switch (this.type) {
            case 'info':
                p = getMessageParagraph(this.text);
                p.classList.add("info_message");
                
                break;

            case 'message':
                if(this.timestamp !== 0) {
                    time.setTime(this.timestamp);
                }
        
                let time_formatted = with_leading_zeros(time.getHours()) + ":" + with_leading_zeros(time.getMinutes()) + ":" + with_leading_zeros(time.getSeconds());
                
                p = getMessageParagraph("[" + time_formatted + "] " + this.nickname + ": " + this.text);

                p.classList.add("basic_message");

                break;
            
            default:
                console.log("ERROR " + raw_data);

                p = '';
        }

        return p
    }

    static fromJSON(object) {
        return Object.assign(new Message, object)
    }
}