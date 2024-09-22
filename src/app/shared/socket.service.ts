import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/evironment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.connect();
  }

  /**
   * Connect to the socket server with a handshake token
   */
  connect(): void {
    const token = localStorage.getItem('token'); // Get the auth token

    // Initialize socket connection with handshake auth token
    this.socket = io(environment.socketUrl, {
      // extraHeaders: { authorization: `Bearer ${token}` },
      auth: {
        authorization: `Bearer ${token}`,
      },
      transports: ['websocket'], // Ensure the connection is made via WebSocket
    });

    // Listen for connection errors
    this.socket.on('connect_error', (err: any) => {
      console.error('Socket connection error:', err);
    });
  }

  /**
   * Emit an event to the server
   * @param event - The event name
   * @param data - Data to send to the server
   */
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  /**
   * Listen for events from the server
   * @param event - The event name
   * @returns - An observable for the event
   */
  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      // Cleanup when unsubscribed
      return () => this.socket.off(event);
    });
  }

  /**
   * Disconnect from the socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
