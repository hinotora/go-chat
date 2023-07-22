package message

type Message struct {
	Nickname 	string 	`json:"nickname"`
	Text 		string	`json:"text"`
	Mtype 		string  `json:"type"`
}

func NewMessage(nick string, text string, mtype string) *Message {
	return &Message{
		Nickname: nick,
		Text: text,
		Mtype: mtype,
	}
}