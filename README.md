# nestjs-socket-handlers-with-ack
Gateway socket handler decorator with automatic acknowledgement callback call

### Usage
Install this module with this command:
```
$ npm install --save nestjs-socket-handlers-with-ack
```
In your gateway:
```
import { SubscribeMessageWithAck } from 'nestjs-socket-handlers-with-ack';

@WebSocketGateway()
export class MyGateway {

    @SubscribeMessageWithAck('checkIsNumberOdd')
    async checkIsNumberOdd(socket: SocketIO.Socket, num: number): Promise<boolean> {
        if (isNaN(num)) {
            throw new Error('Wrong number received');
        }
        return num % 2 === 1;
    }
   
}
```

On the client (example for Angular):
```
    check(1);// => "returned true"
    check(2);// => "returned false"
    check('asdf');// => "caught error 'Wrong number received'"
    
    private check(num): void {
        emit<boolean>('checkIsNumberOdd', num)
            .subscribe(
                (result: boolean) => { console.log(`returned ${result}`); },
                (error) => { console.log(`caught error '${result}'`); }
            );
    }

    private emit<T>(chanel: string, message?: any): Observable<T> {
        return new Observable<T>(observer => {
            this.socket.emit(chanel, message, (data: any): void => {
                if ( data.success ) {
                    observer.next(data.msg as T);
                } else {
                    observer.error(data.msg);
                }
                observer.complete();
            });
        });
    }
```