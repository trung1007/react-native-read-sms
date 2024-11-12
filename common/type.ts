export interface SMSMessage {
  _id: number;
  address: string;
  body: string;
  creator?: string;
  date: number;
  date_sent?: number;
  error_code?: number;
  locked?: number;
  protocol?: number;
  read: number;
  reply_path_present?: number;
  seen?: number;
  status?: number;
  sub_id?: number;
  thread_id?: number;
  type: number;
}

export interface SpamLabel{
    spam?:boolean
}
export interface Message{
  message:string,
  spam:any,
  number?:string
}
